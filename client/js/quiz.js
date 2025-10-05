/**
 * Main quiz functionality for the Career Path Prediction Quiz
 * Handles quiz navigation, question rendering, and score calculation
 */

// Quiz configuration
const QUESTIONS_PER_SECTION = 10;
const MAX_SCORE = 10;

// Quiz state
let currentSection = 'start-screen';
let quizData = {
    logical: [],
    coding: [],
    quantitative: [],
    verbal: [],
    scores: {
        LogicalScore: 0,
        CodingScore: 0,
        QuantitativeScore: 0,
        VerbalScore: 0
    },
    userResponses: {
        logical: {},
        coding: {},
        quantitative: {},
        verbal: {}
    }
};

// Initialize the quiz when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quiz sections with random questions
    initializeQuiz();
    
    // Set up navigation buttons
    setupNavigation();
    
    // Handle quiz submission
    document.getElementById('submit-quiz').addEventListener('click', handleQuizSubmission);
    
    // Handle quiz restart
    document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
});

/**
 * Initialize the quiz by loading random questions for each section
 */
function initializeQuiz() {
    // Get random questions for each section
    quizData.logical = getRandomQuestions('logical', QUESTIONS_PER_SECTION);
    quizData.coding = getRandomQuestions('coding', QUESTIONS_PER_SECTION);
    quizData.quantitative = getRandomQuestions('quantitative', QUESTIONS_PER_SECTION);
    quizData.verbal = getRandomQuestions('verbal', QUESTIONS_PER_SECTION);
    
    // Render questions for each section
    renderQuestions('logical', quizData.logical);
    renderQuestions('coding', quizData.coding);
    renderQuestions('quantitative', quizData.quantitative);
    renderQuestions('verbal', quizData.verbal);
}

/**
 * Render questions for a specific section
 * @param {string} section - The section ID (logical, coding, quantitative, verbal)
 * @param {Array} questions - Array of question objects
 */
function renderQuestions(section, questions) {
    const container = document.getElementById(`${section}-questions`);
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-container';
        questionElement.id = `${section}-question-${index}`;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.innerHTML = `<strong>Question ${index + 1}:</strong> ${question.question}`;
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        question.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('label');
            optionElement.className = 'option';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `${section}-q${index}`;
            radio.value = optionIndex;
            radio.dataset.questionId = question.id;
            radio.addEventListener('change', () => handleOptionSelect(section, question.id, optionIndex));
            
            optionElement.appendChild(radio);
            optionElement.appendChild(document.createTextNode(option));
            optionsContainer.appendChild(optionElement);
        });
        
        questionElement.appendChild(questionText);
        questionElement.appendChild(optionsContainer);
        container.appendChild(questionElement);
    });
}

/**
 * Handle option selection for a question
 * @param {string} section - The section ID
 * @param {string} questionId - The question ID
 * @param {number} optionIndex - The selected option index
 */
function handleOptionSelect(section, questionId, optionIndex) {
    quizData.userResponses[section][questionId] = optionIndex;
}

/**
 * Set up navigation between quiz sections
 */
function setupNavigation() {
    // Start quiz button
    document.getElementById('start-btn').addEventListener('click', () => {
        navigateToSection('logical-section');
    });
    
    // Logical section navigation
    document.getElementById('logical-next').addEventListener('click', () => {
        navigateToSection('coding-section');
    });
    
    // Coding section navigation
    document.getElementById('coding-prev').addEventListener('click', () => {
        navigateToSection('logical-section');
    });
    document.getElementById('coding-next').addEventListener('click', () => {
        navigateToSection('quantitative-section');
    });
    
    // Quantitative section navigation
    document.getElementById('quantitative-prev').addEventListener('click', () => {
        navigateToSection('coding-section');
    });
    document.getElementById('quantitative-next').addEventListener('click', () => {
        navigateToSection('verbal-section');
    });
    
    // Verbal section navigation
    document.getElementById('verbal-prev').addEventListener('click', () => {
        navigateToSection('quantitative-section');
    });
    document.getElementById('verbal-next').addEventListener('click', () => {
        navigateToSection('additional-info-section');
    });
    
    // Additional info section navigation
    document.getElementById('info-prev').addEventListener('click', () => {
        navigateToSection('verbal-section');
    });
}

/**
 * Navigate to a specific section
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigateToSection(sectionId) {
    // Hide current section
    document.querySelector(`.section.active`).classList.remove('active');
    
    // Show new section
    document.getElementById(sectionId).classList.add('active');
    
    // Update current section
    currentSection = sectionId;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * Calculate the score for a specific section
 * @param {string} section - The section ID (logical, coding, quantitative, verbal)
 * @returns {number} - The normalized score (out of 10)
 */
function calculateSectionScore(section) {
    const questions = quizData[section];
    const responses = quizData.userResponses[section];
    
    let correctAnswers = 0;
    
    questions.forEach(question => {
        if (responses[question.id] === question.correctAnswer) {
            correctAnswers++;
        }
    });
    
    // Normalize score to be out of MAX_SCORE
    return (correctAnswers / questions.length) * MAX_SCORE;
}

/**
 * Handle quiz submission
 */
function handleQuizSubmission() {
    // Calculate scores for each section
    quizData.scores.LogicalScore = calculateSectionScore('logical');
    quizData.scores.CodingScore = calculateSectionScore('coding');
    quizData.scores.QuantitativeScore = calculateSectionScore('quantitative');
    quizData.scores.VerbalScore = calculateSectionScore('verbal');
    
    // Get additional information from the form
    const formData = getFormData();
    
    // Combine scores and form data
    const predictionData = {
        ...quizData.scores,
        ...formData
    };
    
    // Show results section
    navigateToSection('results-section');
    
    // Send data to prediction endpoint
    document.querySelector('.loader').style.display = 'block';
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictionData)
    })
    .then(res => res.json())
    .then(response => {
        document.querySelector('.loader').style.display = 'none';
        document.getElementById('prediction-result').style.display = 'block';

        if (response.error) {
            document.getElementById('career-path').textContent = 'Error: ' + response.error;
            return;
        }

        // Show career path from backend
        document.getElementById('career-path').textContent = response.career_path || 'Unknown';

        // Show scores summary as before
        const scoresSummary = document.getElementById('scores-summary');
        scoresSummary.innerHTML = `
            <h3>Your Scores:</h3>
            <div class="score-item">
                <span>Logical Reasoning:</span>
                <span>${predictionData.LogicalScore.toFixed(1)} / 10</span>
            </div>
            <div class="score-item">
                <span>Coding Knowledge:</span>
                <span>${predictionData.CodingScore.toFixed(1)} / 10</span>
            </div>
            <div class="score-item">
                <span>Quantitative Skills:</span>
                <span>${predictionData.QuantitativeScore.toFixed(1)} / 10</span>
            </div>
            <div class="score-item">
                <span>Verbal Reasoning:</span>
                <span>${predictionData.VerbalScore.toFixed(1)} / 10</span>
            </div>
        `;
    })
    .catch(err => {
        document.querySelector('.loader').style.display = 'none';
        document.getElementById('prediction-result').style.display = 'block';
        document.getElementById('career-path').textContent = 'Error connecting to prediction service.';
        console.error('Prediction error:', err);
    });
}

/**
 * Get data from the additional information form
 * @returns {Object} - The form data
 */
function getFormData() {
    // This function will be implemented in form.js
    return window.getFormData();
}

/**
 * Display a mock prediction result
 * @param {Object} data - The prediction data
 */
function displayMockPrediction(data) {
    // Mock career paths based on highest scores
    const careerPaths = {
        logical: 'Data Scientist',
        coding: 'Software Developer',
        quantitative: 'Financial Analyst',
        verbal: 'Content Strategist'
    };
    
    // Find the section with the highest score
    const scores = [
        { section: 'logical', score: data.LogicalScore },
        { section: 'coding', score: data.CodingScore },
        { section: 'quantitative', score: data.QuantitativeScore },
        { section: 'verbal', score: data.VerbalScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    const topSection = scores[0].section;
    
    // Display the recommended career path
    document.getElementById('career-path').textContent = careerPaths[topSection];
    
    // Display scores summary
    const scoresSummary = document.getElementById('scores-summary');
    scoresSummary.innerHTML = `
        <h3>Your Scores:</h3>
        <div class="score-item">
            <span>Logical Reasoning:</span>
            <span>${data.LogicalScore.toFixed(1)} / 10</span>
        </div>
        <div class="score-item">
            <span>Coding Knowledge:</span>
            <span>${data.CodingScore.toFixed(1)} / 10</span>
        </div>
        <div class="score-item">
            <span>Quantitative Skills:</span>
            <span>${data.QuantitativeScore.toFixed(1)} / 10</span>
        </div>
        <div class="score-item">
            <span>Verbal Reasoning:</span>
            <span>${data.VerbalScore.toFixed(1)} / 10</span>
        </div>
    `;
}

/**
 * Restart the quiz
 */
function restartQuiz() {
    // Reset quiz data
    quizData = {
        logical: [],
        coding: [],
        quantitative: [],
        verbal: [],
        scores: {
            LogicalScore: 0,
            CodingScore: 0,
            QuantitativeScore: 0,
            VerbalScore: 0
        },
        userResponses: {
            logical: {},
            coding: {},
            quantitative: {},
            verbal: {}
        }
    };
    
    // Re-initialize the quiz with new random questions
    initializeQuiz();
    
    // Navigate to start screen
    navigateToSection('start-screen');
}