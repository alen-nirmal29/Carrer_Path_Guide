from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback
import numpy as np
import pandas as pd
import joblib
import pickle
import sklearn


app = Flask(__name__)
CORS(app)


MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Expected scikit-learn version used to train the models
EXPECTED_SKLEARN_VERSION = '1.6.1'


def load_model_prefer_joblib(filename):
    """Try to load with joblib first (recommended for sklearn/xgboost),
    fall back to pickle if needed."""
    path = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")

    # Try joblib first
    try:
        return joblib.load(path)
    except Exception:
        # Fall back to pickle
        with open(path, 'rb') as f:
            return pickle.load(f)


# Load models at startup (will raise if files missing or unpickleable)
career_model = load_model_prefer_joblib('career_model.pkl')
column_transformer = load_model_prefer_joblib('column_transformer.pkl')
label_encoder = load_model_prefer_joblib('label_encoder.pkl')
mlb = load_model_prefer_joblib('multilabelbinarizer.pkl')


# Define expected numeric and categorical columns (must match training)
NUMERIC_COLS = [
    'LogicalScore', 'CodingScore', 'QuantitativeScore', 'VerbalScore',
    'CGPA', 'ProjectsDone', 'Internships', 'Certifications',
    'SoftSkills', 'Leadership', 'ProgrammingLanguagesKnown'
]

CATEGORICAL_COLS = ['PreferredWorkStyle', 'HackathonParticipation']

# Known allowed categorical values (kept in sync with frontend options)
ALLOWED_PREFERRED_WORK_STYLES = [
    'Research-oriented', 'Organized/Managerial', 'Technical Hands-on', 'Creative'
]
ALLOWED_HACKATHON = ['Yes', 'No']


def to_array(x):
    try:
        return x.toarray()
    except Exception:
        return np.array(x)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({'error': 'Invalid or empty JSON payload'}), 400

        # Validate and build numeric dataframe (explicit mapping and conversion)
        numeric_data = {}
        errors = []
        for col in NUMERIC_COLS:
            raw = payload.get(col, None)
            if raw is None:
                # allow missing numeric but warn (set to 0)
                numeric_data[col] = 0.0
            else:
                try:
                    numeric_data[col] = float(raw)
                except Exception:
                    errors.append(f"Numeric field '{col}' must be a number")

        # Validate categorical fields explicitly
        preferred = payload.get('PreferredWorkStyle', '')
        hackathon = payload.get('HackathonParticipation', '')

        if preferred and preferred not in ALLOWED_PREFERRED_WORK_STYLES:
            errors.append(f"PreferredWorkStyle must be one of {ALLOWED_PREFERRED_WORK_STYLES}")
        if hackathon and hackathon not in ALLOWED_HACKATHON:
            errors.append(f"HackathonParticipation must be one of {ALLOWED_HACKATHON}")

        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400

        df_numeric = pd.DataFrame([numeric_data], columns=NUMERIC_COLS)

        # Build categorical dataframe with explicit column ordering
        cat_data = {'PreferredWorkStyle': preferred, 'HackathonParticipation': hackathon}
        df_cat = pd.DataFrame([cat_data], columns=CATEGORICAL_COLS)

        # Process Interests via MultiLabelBinarizer
        interests = payload.get('Interests', []) or []
        if isinstance(interests, str):
            interests = [interests]
        if not isinstance(interests, list):
            return jsonify({'error': "Interests must be an array of strings"}), 400

        # Keep only known interests (mlb.classes_)
        known_classes = list(getattr(mlb, 'classes_', []))
        filtered_interests = [i for i in interests if i in known_classes]
        if len(known_classes) > 0:
            mlb_arr = mlb.transform([filtered_interests])
            mlb_arr = to_array(mlb_arr)
        else:
            mlb_arr = np.zeros((1, 0))

        # The column_transformer may expect both numeric and categorical columns
        # (it might contain pipelines for numeric preprocessing). Build a single
        # DataFrame with the same column names used for training and pass it to
        # the transformer.
        df_all = pd.concat([df_numeric, df_cat], axis=1)[NUMERIC_COLS + CATEGORICAL_COLS]

        try:
            cat_trans = column_transformer.transform(df_all)
            cat_trans = to_array(cat_trans)
        except Exception as ex:
            # Try to provide useful debugging info about expected columns
            expected = None
            try:
                expected = getattr(column_transformer, 'feature_names_in_', None)
            except Exception:
                expected = None

            details = {
                'transform_error': str(ex),
                'provided_columns': list(df_all.columns)
            }
            if expected is not None:
                details['transformer_feature_names_in_'] = list(expected)
            else:
                # Try to extract transformer component names
                try:
                    details['transformers_'] = [t[0] for t in getattr(column_transformer, 'transformers_', [])]
                except Exception:
                    pass

            return jsonify({'error': 'column_transformer transform failed', 'details': details}), 500

        # Combine features carefully. The column_transformer may already include
        # numeric pipelines, so cat_trans could represent the full model inputs
        # (excluding the MultiLabelBinarizer output). Avoid double-counting
        # numeric columns.
        cat_trans = np.atleast_2d(cat_trans)
        mlb_arr = np.atleast_2d(mlb_arr)
        numeric_vals = np.atleast_2d(df_numeric.values)

        model_expected = getattr(career_model, 'n_features_in_', None)

        cat_dim = cat_trans.shape[1]
        mlb_dim = mlb_arr.shape[1] if mlb_arr.size > 0 else 0
        num_dim = numeric_vals.shape[1]

        # Helper to build X from components
        def build_X(use_numeric, use_cat, use_mlb):
            parts = []
            if use_numeric:
                parts.append(numeric_vals)
            if use_cat:
                parts.append(cat_trans)
            if use_mlb and mlb_dim > 0:
                parts.append(mlb_arr)
            if not parts:
                return np.zeros((numeric_vals.shape[0], 0))
            return np.hstack(parts)

        chosen_X = None
        chosen_desc = None

        # If model exposes expected n_features_in_, try to match precisely
        if model_expected is not None:
            # Option A: transformer output + mlb
            if cat_dim + mlb_dim == model_expected:
                chosen_X = build_X(False, True, True)
                chosen_desc = 'cat_trans + mlb'
            # Option B: numeric raw + transformer output + mlb
            elif num_dim + cat_dim + mlb_dim == model_expected:
                chosen_X = build_X(True, True, True)
                chosen_desc = 'numeric + cat_trans + mlb'
            # Option C: transformer output only
            elif cat_dim == model_expected and mlb_dim == 0:
                chosen_X = build_X(False, True, False)
                chosen_desc = 'cat_trans only'
            # Option D: numeric + transformer (no mlb)
            elif num_dim + cat_dim == model_expected and mlb_dim == 0:
                chosen_X = build_X(True, True, False)
                chosen_desc = 'numeric + cat_trans'
            else:
                # No exact match; return diagnostic
                provided = num_dim + cat_dim + mlb_dim
                details = {
                    'model_expected_features': int(model_expected),
                    'num_dim': int(num_dim),
                    'cat_dim': int(cat_dim),
                    'mlb_dim': int(mlb_dim),
                    'provided_if_all_concatenated': int(provided),
                    'note': 'Tried common stacking options but none matched model expected feature count.'
                }
                return jsonify({'error': 'Feature shape mismatch', 'details': details}), 500
        else:
            # No model metadata — heuristics: if cat_trans produces at least as many
            # features as numeric inputs, it's likely the transformer contains numeric
            # pipelines and we should not add raw numeric columns.
            if cat_dim >= num_dim:
                chosen_X = build_X(False, True, True)
                chosen_desc = 'cat_trans + mlb (heuristic)'
            else:
                chosen_X = build_X(True, True, True)
                chosen_desc = 'numeric + cat_trans + mlb (heuristic)'

        X = chosen_X

        # Predict
        pred_encoded = career_model.predict(X)

        # Decode label
        if hasattr(label_encoder, 'inverse_transform'):
            pred_label = label_encoder.inverse_transform(pred_encoded)
            career_path = pred_label[0]
        else:
            career_path = str(pred_encoded[0])

        # Probabilities (optional)
        probabilities = None
        if hasattr(career_model, 'predict_proba'):
            probs = career_model.predict_proba(X)[0]
            if hasattr(label_encoder, 'classes_'):
                class_labels = list(label_encoder.classes_)
            else:
                class_labels = [str(i) for i in range(len(probs))]
            probabilities = dict(zip(class_labels, probs.tolist()))

        return jsonify({'career_path': career_path, 'probabilities': probabilities})

    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({'error': str(e), 'traceback': tb}), 500


@app.route('/health', methods=['GET'])
def health():
    skv = getattr(sklearn, '__version__', 'unknown')
    ok = (skv == EXPECTED_SKLEARN_VERSION)
    return jsonify({'status': 'ok', 'sklearn_version': skv, 'expected_sklearn_version': EXPECTED_SKLEARN_VERSION, 'version_match': ok}), 200


if __name__ == '__main__':
    # Run on localhost:5000
    app.run(host='0.0.0.0', port=5000, debug=True)
