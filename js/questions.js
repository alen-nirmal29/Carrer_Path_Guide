/**
 * Questions database for the Career Path Prediction Quiz
 * Each section contains a pool of questions from which a subset will be randomly selected
 * This ensures that the quiz is different each time it is taken
 */

const questionBank = {
    logical: [
        {
            id: "L1",
            question: "If all Zips are Zaps, and all Zaps are Zops, then which of the following must be true?",
            options: [
                "All Zips are Zops",
                "All Zops are Zips",
                "No Zips are Zops",
                "Some Zops are not Zips"
            ],
            correctAnswer: 0
        },
        {
            id: "L2",
            question: "In a certain code, COMPUTER is written as RFUVQNPC. How will MEDICINE be written in that code?",
            options: [
                "EOJDJEFM",
                "MFEDJJOE",
                "EOJDEJFM",
                "MFEJDJOE"
            ],
            correctAnswer: 3
        },
        {
            id: "L3",
            question: "Which number should come next in the series: 2, 3, 5, 9, 17, ?",
            options: [
                "24",
                "26",
                "33",
                "34"
            ],
            correctAnswer: 2
        },
        {
            id: "L4",
            question: "A is taller than B. C is shorter than A. Which of the following statements would be sufficient to determine whether B is taller than C?",
            options: [
                "B is taller than the average height of A and C",
                "The combined height of B and C is less than twice the height of A",
                "B is shorter than A by the same amount that B is taller than C",
                "The combined height of A and C is twice the height of B"
            ],
            correctAnswer: 2
        },
        {
            id: "L5",
            question: "If the day before yesterday was Thursday, what day will it be the day after tomorrow?",
            options: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Sunday"
            ],
            correctAnswer: 1
        },
        {
            id: "L6",
            question: "All cars have wheels. Some vehicles are cars. Which of the following conclusions can be drawn from these statements?",
            options: [
                "All vehicles have wheels",
                "Some vehicles have wheels",
                "No vehicles have wheels",
                "Some vehicles don't have wheels"
            ],
            correctAnswer: 1
        },
        {
            id: "L7",
            question: "Find the odd one out: Lion, Tiger, Leopard, Wolf, Cheetah",
            options: [
                "Lion",
                "Tiger",
                "Wolf",
                "Cheetah"
            ],
            correctAnswer: 2
        },
        {
            id: "L8",
            question: "If FRIEND is coded as HUMJTK, how is CANDLE coded?",
            options: [
                "EDRIRL",
                "DCQHQK",
                "ESJFME",
                "FYOBQN"
            ],
            correctAnswer: 1
        },
        {
            id: "L9",
            question: "Which figure completes the pattern?",
            options: [
                "A square with a circle inside",
                "A triangle with a square inside",
                "A circle with a triangle inside",
                "A square with a triangle inside"
            ],
            correctAnswer: 3,
            imageUrl: "images/pattern-question.png" // Optional image for pattern questions
        },
        {
            id: "L10",
            question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
            options: [
                "5 minutes",
                "100 minutes",
                "20 minutes",
                "500 minutes"
            ],
            correctAnswer: 0
        },
        {
            id: "L11",
            question: "Which word does NOT belong with the others?",
            options: [
                "Rectangle",
                "Triangle",
                "Cylinder",
                "Circle"
            ],
            correctAnswer: 2
        },
        {
            id: "L12",
            question: "Complete the analogy: Book is to Reading as Fork is to ___",
            options: [
                "Drawing",
                "Writing",
                "Eating",
                "Cooking"
            ],
            correctAnswer: 2
        },
        {
            id: "L13",
            question: "If you rearrange the letters 'ANLDEG' you would have the name of a(n):",
            options: [
                "Animal",
                "Country",
                "Ocean",
                "City"
            ],
            correctAnswer: 1 // ENGLAND
        },
        {
            id: "L14",
            question: "Which number is the odd one out: 2, 3, 8, 16, 32, 64",
            options: [
                "2",
                "3",
                "16",
                "64"
            ],
            correctAnswer: 1 // All others are powers of 2
        },
        {
            id: "L15",
            question: "A man is 24 years older than his son. In 6 years, the man will be 5 times as old as his son. How old is the son now?",
            options: [
                "4 years",
                "6 years",
                "8 years",
                "10 years"
            ],
            correctAnswer: 0
        }
    ],
    coding: [
        {
            id: "C1",
            question: "What will be the output of the following Python code?\n\nx = 5\ny = 10\nprint(x + y * 2)",
            options: [
                "25",
                "30",
                "15",
                "20"
            ],
            correctAnswer: 1
        },
        {
            id: "C2",
            question: "Which data structure operates on a Last-In-First-Out (LIFO) principle?",
            options: [
                "Queue",
                "Stack",
                "Linked List",
                "Tree"
            ],
            correctAnswer: 1
        },
        {
            id: "C3",
            question: "What is the time complexity of binary search?",
            options: [
                "O(n)",
                "O(n²)",
                "O(log n)",
                "O(n log n)"
            ],
            correctAnswer: 2
        },
        {
            id: "C4",
            question: "In JavaScript, what does the following code return?\n\ntypeof null",
            options: [
                "'null'",
                "'undefined'",
                "'object'",
                "'number'"
            ],
            correctAnswer: 2
        },
        {
            id: "C5",
            question: "Which of the following is NOT a programming paradigm?",
            options: [
                "Object-Oriented Programming",
                "Functional Programming",
                "Procedural Programming",
                "Descriptive Programming"
            ],
            correctAnswer: 3
        },
        {
            id: "C6",
            question: "What does SQL stand for?",
            options: [
                "Structured Query Language",
                "Simple Question Language",
                "Structured Question Logic",
                "System Query Language"
            ],
            correctAnswer: 0
        },
        {
            id: "C7",
            question: "What will be the output of the following Java code?\n\nint x = 5;\nSystem.out.println(x++);\nSystem.out.println(x);",
            options: [
                "5, 5",
                "5, 6",
                "6, 6",
                "6, 5"
            ],
            correctAnswer: 1
        },
        {
            id: "C8",
            question: "Which of the following is NOT a valid variable name in most programming languages?",
            options: [
                "_variable",
                "variable123",
                "123variable",
                "$variable"
            ],
            correctAnswer: 2
        },
        {
            id: "C9",
            question: "What is the purpose of a constructor in object-oriented programming?",
            options: [
                "To destroy objects when they are no longer needed",
                "To initialize objects when they are created",
                "To define methods that can be inherited",
                "To restrict access to class properties"
            ],
            correctAnswer: 1
        },
        {
            id: "C10",
            question: "Which of the following is a valid way to comment in HTML?",
            options: [
                "// This is a comment",
                "/* This is a comment */",
                "<!-- This is a comment -->",
                "# This is a comment"
            ],
            correctAnswer: 2
        },
        {
            id: "C11",
            question: "What does API stand for?",
            options: [
                "Application Programming Interface",
                "Application Process Integration",
                "Automated Programming Interface",
                "Application Protocol Interface"
            ],
            correctAnswer: 0
        },
        {
            id: "C12",
            question: "Which of the following is NOT a common HTTP status code?",
            options: [
                "200 OK",
                "404 Not Found",
                "500 Internal Server Error",
                "600 Server Timeout"
            ],
            correctAnswer: 3
        },
        {
            id: "C13",
            question: "What is the output of the following code?\n\nfunction example() {\n  var x = 10;\n  if (true) {\n    var x = 20;\n    console.log(x);\n  }\n  console.log(x);\n}\nexample();",
            options: [
                "10, 10",
                "20, 10",
                "20, 20",
                "10, 20"
            ],
            correctAnswer: 2
        },
        {
            id: "C14",
            question: "Which sorting algorithm has the best average-case time complexity?",
            options: [
                "Bubble Sort",
                "Insertion Sort",
                "Quick Sort",
                "Selection Sort"
            ],
            correctAnswer: 2
        },
        {
            id: "C15",
            question: "What does CSS stand for?",
            options: [
                "Computer Style Sheets",
                "Creative Style System",
                "Cascading Style Sheets",
                "Colorful Style Sheets"
            ],
            correctAnswer: 2
        }
    ],
    quantitative: [
        {
            id: "Q1",
            question: "If a car travels at 60 km/h, how far will it travel in 2.5 hours?",
            options: [
                "120 km",
                "150 km",
                "180 km",
                "200 km"
            ],
            correctAnswer: 1
        },
        {
            id: "Q2",
            question: "What is the value of x in the equation 3x + 7 = 22?",
            options: [
                "3",
                "5",
                "7",
                "15"
            ],
            correctAnswer: 1
        },
        {
            id: "Q3",
            question: "If the probability of an event occurring is 0.35, what is the probability of it not occurring?",
            options: [
                "0.35",
                "0.5",
                "0.65",
                "0.75"
            ],
            correctAnswer: 2
        },
        {
            id: "Q4",
            question: "A shirt costs $45 after a 25% discount. What was the original price?",
            options: [
                "$56.25",
                "$60",
                "$33.75",
                "$65"
            ],
            correctAnswer: 0
        },
        {
            id: "Q5",
            question: "What is the area of a circle with radius 6 cm? (Use π = 3.14)",
            options: [
                "36π cm²",
                "12π cm²",
                "18π cm²",
                "24π cm²"
            ],
            correctAnswer: 0
        },
        {
            id: "Q6",
            question: "If 8 workers can complete a task in 6 days, how many days would it take 12 workers to complete the same task?",
            options: [
                "4 days",
                "9 days",
                "3 days",
                "8 days"
            ],
            correctAnswer: 0
        },
        {
            id: "Q7",
            question: "What is the value of 2³ × 4²?",
            options: [
                "64",
                "128",
                "32",
                "96"
            ],
            correctAnswer: 0
        },
        {
            id: "Q8",
            question: "A train travels at 80 km/h for 1.5 hours and then at 100 km/h for 2 hours. What is the average speed for the entire journey?",
            options: [
                "90 km/h",
                "92 km/h",
                "88 km/h",
                "94 km/h"
            ],
            correctAnswer: 1
        },
        {
            id: "Q9",
            question: "If a rectangle has a length of 12 cm and a width of 8 cm, what is its perimeter?",
            options: [
                "20 cm",
                "40 cm",
                "96 cm²",
                "32 cm"
            ],
            correctAnswer: 1
        },
        {
            id: "Q10",
            question: "What is the median of the following set of numbers: 3, 7, 8, 5, 12, 14, 21?",
            options: [
                "7",
                "8",
                "10",
                "12"
            ],
            correctAnswer: 1
        },
        {
            id: "Q11",
            question: "If x:y = 3:4 and y:z = 2:3, what is x:z?",
            options: [
                "1:2",
                "2:3",
                "1:1",
                "1:3"
            ],
            correctAnswer: 0
        },
        {
            id: "Q12",
            question: "A car depreciates in value by 15% each year. After 2 years, its value is $28,900. What was its original value?",
            options: [
                "$38,533",
                "$40,000",
                "$42,500",
                "$45,000"
            ],
            correctAnswer: 1
        },
        {
            id: "Q13",
            question: "What is the sum of the interior angles of a hexagon?",
            options: [
                "540°",
                "720°",
                "900°",
                "1080°"
            ],
            correctAnswer: 1
        },
        {
            id: "Q14",
            question: "If f(x) = 2x² + 3x - 5, what is f(3)?",
            options: [
                "16",
                "22",
                "28",
                "34"
            ],
            correctAnswer: 1
        },
        {
            id: "Q15",
            question: "A mixture contains acid and water in the ratio 2:3. If 10 liters of water is added to the mixture, the ratio becomes 2:5. How many liters of acid were in the original mixture?",
            options: [
                "10 liters",
                "15 liters",
                "20 liters",
                "25 liters"
            ],
            correctAnswer: 0
        }
    ],
    verbal: [
        {
            id: "V1",
            question: "Choose the word that is most nearly OPPOSITE in meaning to BENEVOLENT:",
            options: [
                "Charitable",
                "Malevolent",
                "Generous",
                "Beneficial"
            ],
            correctAnswer: 1
        },
        {
            id: "V2",
            question: "Choose the word that best completes the sentence: The detective's _____ attention to detail helped solve the case.",
            options: [
                "Meticulous",
                "Careless",
                "Superficial",
                "Negligent"
            ],
            correctAnswer: 0
        },
        {
            id: "V3",
            question: "Choose the word that is most nearly SIMILAR in meaning to ELOQUENT:",
            options: [
                "Silent",
                "Articulate",
                "Hesitant",
                "Confused"
            ],
            correctAnswer: 1
        },
        {
            id: "V4",
            question: "Identify the error in the following sentence: 'Neither the students nor the teacher were able to solve the problem.'",
            options: [
                "'Neither' should be 'Either'",
                "'Were' should be 'was'",
                "'Nor' should be 'or'",
                "There is no error"
            ],
            correctAnswer: 3
        },
        {
            id: "V5",
            question: "Choose the word that best completes the sentence: Despite his _____ appearance, he was actually quite wealthy.",
            options: [
                "Affluent",
                "Opulent",
                "Impoverished",
                "Luxurious"
            ],
            correctAnswer: 2
        },
        {
            id: "V6",
            question: "Choose the correct meaning of the idiom: 'To bite the bullet'",
            options: [
                "To act aggressively",
                "To face a difficult situation with courage",
                "To speak without thinking",
                "To make a costly mistake"
            ],
            correctAnswer: 1
        },
        {
            id: "V7",
            question: "Choose the word with the correct spelling:",
            options: [
                "Accomodate",
                "Acommodate",
                "Accommodate",
                "Accomadate"
            ],
            correctAnswer: 2
        },
        {
            id: "V8",
            question: "Choose the correct meaning of the word 'Ephemeral':",
            options: [
                "Lasting for a very short time",
                "Extremely important",
                "Highly dangerous",
                "Visually appealing"
            ],
            correctAnswer: 0
        },
        {
            id: "V9",
            question: "Choose the word that best completes the sentence: The company's profits showed a significant _____ compared to last year.",
            options: [
                "Decline",
                "Increase",
                "Stagnation",
                "Fluctuation"
            ],
            correctAnswer: 1
        },
        {
            id: "V10",
            question: "Choose the correct meaning of the prefix 'inter-':",
            options: [
                "Against",
                "Between",
                "Within",
                "Beyond"
            ],
            correctAnswer: 1
        },
        {
            id: "V11",
            question: "Choose the word that is most nearly OPPOSITE in meaning to FRUGAL:",
            options: [
                "Economical",
                "Thrifty",
                "Extravagant",
                "Prudent"
            ],
            correctAnswer: 2
        },
        {
            id: "V12",
            question: "Identify the part of speech of the underlined word in the sentence: 'She QUICKLY finished her assignment.'",
            options: [
                "Noun",
                "Verb",
                "Adjective",
                "Adverb"
            ],
            correctAnswer: 3
        },
        {
            id: "V13",
            question: "Choose the correct meaning of the word 'Ubiquitous':",
            options: [
                "Rare and unusual",
                "Present everywhere",
                "Extremely large",
                "Highly controversial"
            ],
            correctAnswer: 1
        },
        {
            id: "V14",
            question: "Choose the word that best completes the analogy: Book is to Read as Food is to _____",
            options: [
                "Cook",
                "Eat",
                "Recipe",
                "Taste"
            ],
            correctAnswer: 1
        },
        {
            id: "V15",
            question: "Choose the correct meaning of the idiom: 'To let the cat out of the bag'",
            options: [
                "To create confusion",
                "To reveal a secret",
                "To escape from danger",
                "To solve a problem"
            ],
            correctAnswer: 1
        }
    ]
};

/**
 * Function to get a random subset of questions from each section
 * @param {string} section - The section name (logical, coding, quantitative, verbal)
 * @param {number} count - The number of questions to select
 * @returns {Array} - Array of randomly selected questions
 */
function getRandomQuestions(section, count = 10) {
    const questions = questionBank[section];
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Export the functions and data for use in other files
window.questionBank = questionBank;
window.getRandomQuestions = getRandomQuestions;