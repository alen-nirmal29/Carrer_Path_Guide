# Career Path Prediction Quiz

## Overview
This web application guides users through a comprehensive quiz and collects additional student information to predict suitable career paths. The application is designed to gather data in a format compatible with a trained career path prediction model.

## Features

### Quiz Sections
The quiz consists of four distinct sections:
1. **Logical Reasoning** - Assesses logical thinking skills
2. **Coding Knowledge** - Evaluates coding knowledge and aptitude
3. **Quantitative Skills** - Measures quantitative and mathematical abilities
4. **Verbal Reasoning** - Tests verbal reasoning and comprehension

Each section contains 10 questions randomly selected from a larger pool, ensuring that the quiz is different each time it is taken.

### Additional Information Collection
Following the quiz, users provide additional information about their academic background and interests:
- CGPA (Cumulative Grade Point Average)
- Areas of interest (multi-select)
- Skill level (Beginner, Intermediate, Advanced)
- Number of projects completed
- Number of internships completed
- Number of certifications obtained
- Soft skills self-assessment
- Leadership abilities self-assessment
- Preferred work style
- Hackathon participation
- Number of programming languages known

### Data Processing
The application processes the collected data by:
1. Grading the quizzes and normalizing scores to be out of 10
2. Formatting interests as a list
3. Assembling the data in the format expected by the prediction model

## Project Structure
```
├── index.html           # Main HTML file
├── styles.css           # CSS styles
├── js/
│   ├── questions.js     # Quiz questions database
│   ├── quiz.js          # Quiz functionality
│   └── form.js          # Form handling and validation
└── README.md            # Project documentation
```

## How to Run
1. Clone or download this repository
2. Open `index.html` in a web browser

## Integration with Prediction Model
To integrate with a real prediction model:
1. Modify the `handleQuizSubmission` function in `quiz.js` to send the data to your prediction endpoint
2. Update the `displayMockPrediction` function to handle the actual prediction response

## Example Prediction Data Format
```json
{
    "LogicalScore": 8,
    "CodingScore": 9,
    "QuantitativeScore": 7,
    "VerbalScore": 6,
    "CGPA": 9.0,
    "ProjectsDone": 6,
    "Internships": 1,
    "Certifications": 2,
    "SoftSkills": 8,
    "Leadership": 7,
    "PreferredWorkStyle": "Research-oriented",
    "HackathonParticipation": "Yes",
    "ProgrammingLanguagesKnown": 3,
    "Interests": ["AI/ML", "Programming"]
}
```

## Future Enhancements
- Add more questions to each section's question pool
- Implement a backend server to store quiz results
- Add user authentication
- Enhance the UI with animations and transitions
- Provide more detailed career path recommendations