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

        # Transform categorical columns
        # Ensure column_transformer receives columns in the form it was trained on
        # If it's a ColumnTransformer that expects the categorical columns by name,
        # passing df_cat with the same column names and order should be fine.
        cat_trans = column_transformer.transform(df_cat)
        cat_trans = to_array(cat_trans)

        # Combine features: numeric + categorical transformed + multilabel interests
        X = np.hstack([df_numeric.values, cat_trans, mlb_arr])

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
