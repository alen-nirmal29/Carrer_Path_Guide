/**
 * Form handling for the Career Path Prediction Quiz
 * Manages the additional information form, validation, and data processing
 */

// Form configuration
const interestOptions = [
    'AI/ML', 'Programming', 'Web Development', 'Mobile Development',
    'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps',
    'UI/UX Design', 'Game Development', 'Blockchain', 'IoT',
    'Networking', 'Database Management', 'Business Intelligence'
];

const workStyleOptions = [
    'Research-oriented', 'Organized/Managerial', 'Technical Hands-on', 'Creative'
];

// Initialize the form when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the form fields
    createFormFields();
    
    // Set up form validation
    setupFormValidation();
});

/**
 * Create the form fields for additional information
 */
function createFormFields() {
    const form = document.getElementById('additional-info-form');
    
    // CGPA field
    const cgpaGroup = createFormGroup(
        'cgpa',
        'CGPA',
        'number',
        'Enter your Cumulative Grade Point Average (0-10)',
        'float'
    );
    form.appendChild(cgpaGroup);
    
    // Interests field (multi-select)
    const interestsGroup = document.createElement('div');
    interestsGroup.className = 'form-group';
    interestsGroup.innerHTML = `<label for="interests">Interests (Select all that apply)</label>`;
    
    const checkboxGroup = document.createElement('div');
    checkboxGroup.className = 'checkbox-group';
    
    interestOptions.forEach(interest => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `interest-${interest.toLowerCase().replace(/[\s\/]/g, '-')}`;
        checkbox.name = 'interests';
        checkbox.value = interest;
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = interest;
        
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        checkboxGroup.appendChild(checkboxItem);
    });
    
    interestsGroup.appendChild(checkboxGroup);
    form.appendChild(interestsGroup);
    
    // Skill Level field (dropdown)
    const skillLevelGroup = createFormGroup(
        'skill-level',
        'Skill Level',
        'select',
        'Select your overall skill level',
        'categorical',
        ['Beginner', 'Intermediate', 'Advanced']
    );
    form.appendChild(skillLevelGroup);
    
    // Projects Done field
    const projectsGroup = createFormGroup(
        'projects-done',
        'Projects Done',
        'number',
        'Enter the number of projects you have completed',
        'integer'
    );
    form.appendChild(projectsGroup);
    
    // Internships field
    const internshipsGroup = createFormGroup(
        'internships',
        'Internships',
        'number',
        'Enter the number of internships you have completed',
        'integer'
    );
    form.appendChild(internshipsGroup);
    
    // Certifications field
    const certificationsGroup = createFormGroup(
        'certifications',
        'Certifications',
        'number',
        'Enter the number of relevant certifications you have obtained',
        'integer'
    );
    form.appendChild(certificationsGroup);
    
    // Soft Skills field (range slider)
    const softSkillsGroup = createRangeGroup(
        'soft-skills',
        'Soft Skills',
        'Rate your soft skills (communication, teamwork, etc.)',
        1, 10, 5
    );
    form.appendChild(softSkillsGroup);
    
    // Leadership field (range slider)
    const leadershipGroup = createRangeGroup(
        'leadership',
        'Leadership',
        'Rate your leadership abilities',
        1, 10, 5
    );
    form.appendChild(leadershipGroup);
    
    // Preferred Work Style field (radio buttons)
    const workStyleGroup = document.createElement('div');
    workStyleGroup.className = 'form-group';
    workStyleGroup.innerHTML = `<label>Preferred Work Style</label>`;
    
    const workStyleOptions = [
        'Research-oriented', 'Organized/Managerial', 'Technical Hands-on', 'Creative'
    ];
    
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    
    workStyleOptions.forEach(style => {
        const radioItem = document.createElement('div');
        radioItem.className = 'radio-item';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = `work-style-${style.toLowerCase().replace(/[\s\/]/g, '-')}`;
        radio.name = 'work-style';
        radio.value = style;
        
        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = style;
        
        radioItem.appendChild(radio);
        radioItem.appendChild(label);
        radioGroup.appendChild(radioItem);
    });
    
    workStyleGroup.appendChild(radioGroup);
    form.appendChild(workStyleGroup);
    
    // Hackathon Participation field (radio buttons)
    const hackathonGroup = document.createElement('div');
    hackathonGroup.className = 'form-group';
    hackathonGroup.innerHTML = `<label>Hackathon Participation</label>`;
    
    const hackathonRadioGroup = document.createElement('div');
    hackathonRadioGroup.className = 'radio-group';
    
    ['Yes', 'No'].forEach(option => {
        const radioItem = document.createElement('div');
        radioItem.className = 'radio-item';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = `hackathon-${option.toLowerCase()}`;
        radio.name = 'hackathon';
        radio.value = option;
        
        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = option;
        
        radioItem.appendChild(radio);
        radioItem.appendChild(label);
        hackathonRadioGroup.appendChild(radioItem);
    });
    
    hackathonGroup.appendChild(hackathonRadioGroup);
    form.appendChild(hackathonGroup);
    
    // Programming Languages Known field
    const languagesGroup = createFormGroup(
        'programming-languages',
        'Programming Languages Known',
        'number',
        'Enter the number of programming languages you are familiar with',
        'integer'
    );
    form.appendChild(languagesGroup);
}

/**
 * Create a form group element
 * @param {string} id - The input ID
 * @param {string} label - The label text
 * @param {string} type - The input type
 * @param {string} placeholder - The input placeholder
 * @param {string} dataType - The data type (float, integer, categorical)
 * @param {Array} options - Options for select inputs
 * @returns {HTMLElement} - The form group element
 */
function createFormGroup(id, label, type, placeholder, dataType, options = []) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    
    let input;
    
    if (type === 'select') {
        input = document.createElement('select');
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an option';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        input.appendChild(defaultOption);
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    } else {
        input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        
        if (type === 'number') {
            input.step = dataType === 'float' ? '0.1' : '1';
            input.min = '0';
        }
    }
    
    input.id = id;
    input.name = id;
    input.dataset.type = dataType;
    
    group.appendChild(labelElement);
    group.appendChild(input);
    
    return group;
}

/**
 * Create a range input group
 * @param {string} id - The input ID
 * @param {string} label - The label text
 * @param {string} description - The description text
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @param {number} defaultValue - The default value
 * @returns {HTMLElement} - The form group element
 */
function createRangeGroup(id, label, description, min, max, defaultValue) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    
    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'form-description';
    descriptionElement.textContent = description;
    
    const rangeContainer = document.createElement('div');
    rangeContainer.className = 'range-container';
    
    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.name = id;
    input.min = min;
    input.max = max;
    input.value = defaultValue;
    input.dataset.type = 'integer';
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'range-value';
    valueDisplay.textContent = defaultValue;
    
    input.addEventListener('input', () => {
        valueDisplay.textContent = input.value;
    });
    
    rangeContainer.appendChild(input);
    rangeContainer.appendChild(valueDisplay);
    
    group.appendChild(labelElement);
    group.appendChild(descriptionElement);
    group.appendChild(rangeContainer);
    
    return group;
}

/**
 * Set up form validation
 */
function setupFormValidation() {
    const form = document.getElementById('additional-info-form');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Process form data
            const formData = getFormData();
            console.log('Form data:', formData);
        }
    });
}

/**
 * Validate the form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    const form = document.getElementById('additional-info-form');
    let isValid = true;
    
    // Validate CGPA
    const cgpaInput = form.querySelector('#cgpa');
    const cgpa = parseFloat(cgpaInput.value);
    
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        alert('Please enter a valid CGPA between 0 and 10.');
        isValid = false;
    }
    
    // Validate Interests (at least one must be selected)
    const interestCheckboxes = form.querySelectorAll('input[name="interests"]:checked');
    
    if (interestCheckboxes.length === 0) {
        alert('Please select at least one interest.');
        isValid = false;
    }
    
    // Validate Skill Level
    const skillLevelSelect = form.querySelector('#skill-level');
    
    if (!skillLevelSelect.value) {
        alert('Please select your skill level.');
        isValid = false;
    }
    
    // Validate Work Style
    const workStyleRadios = form.querySelectorAll('input[name="work-style"]:checked');
    
    if (workStyleRadios.length === 0) {
        alert('Please select your preferred work style.');
        isValid = false;
    }
    
    // Validate Hackathon Participation
    const hackathonRadios = form.querySelectorAll('input[name="hackathon"]:checked');
    
    if (hackathonRadios.length === 0) {
        alert('Please indicate whether you have participated in hackathons.');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Get data from the form
 * @returns {Object} - The form data
 */
function getFormData() {
    const form = document.getElementById('additional-info-form');
    
    // Get CGPA
    const cgpa = parseFloat(form.querySelector('#cgpa').value);
    
    // Get Interests
    const interestCheckboxes = form.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestCheckboxes).map(checkbox => checkbox.value);
    
    // Get Skill Level (not used in prediction but collected for user profiling)
    const skillLevel = form.querySelector('#skill-level').value;
    
    // Get Projects Done
    const projectsDone = parseInt(form.querySelector('#projects-done').value) || 0;
    
    // Get Internships
    const internships = parseInt(form.querySelector('#internships').value) || 0;
    
    // Get Certifications
    const certifications = parseInt(form.querySelector('#certifications').value) || 0;
    
    // Get Soft Skills
    const softSkills = parseInt(form.querySelector('#soft-skills').value) || 5;
    
    // Get Leadership
    const leadership = parseInt(form.querySelector('#leadership').value) || 5;
    
    // Get Preferred Work Style
    const workStyleRadio = form.querySelector('input[name="work-style"]:checked');
    const preferredWorkStyle = workStyleRadio ? workStyleRadio.value : '';
    
    // Get Hackathon Participation
    const hackathonRadio = form.querySelector('input[name="hackathon"]:checked');
    const hackathonParticipation = hackathonRadio ? hackathonRadio.value : '';
    
    // Get Programming Languages Known
    const programmingLanguagesKnown = parseInt(form.querySelector('#programming-languages').value) || 0;
    
    // Return the formatted data
    return {
        CGPA: cgpa,
        Interests: interests,
        ProjectsDone: projectsDone,
        Internships: internships,
        Certifications: certifications,
        SoftSkills: softSkills,
        Leadership: leadership,
        PreferredWorkStyle: preferredWorkStyle,
        HackathonParticipation: hackathonParticipation,
        ProgrammingLanguagesKnown: programmingLanguagesKnown
    };
}

// Export the getFormData function for use in quiz.js
window.getFormData = getFormData;