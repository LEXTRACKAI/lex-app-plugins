// ==========================================================================
// STUDY BUDDY - COMPLETE ENHANCED APPLICATION SCRIPT
// ==========================================================================

// Application State
let appState = {
    studyMode: '',
    selectedTopic: '',
    selectedDifficulty: '',
    questionFormat: 'mixed', // 'essay', 'mcq', or 'mixed'
    currentPhase: 'setup',
    currentQuestion: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    lessonContent: null,
    generatedQuestions: [],
    sessionStartTime: null,
    studyHistory: [],
    detailedScores: [],
    hasCompletedLesson: false,
    selectedMCQAnswer: null,
    randomTopicData: null,
    currentQuestionType: null // 'essay' or 'mcq'
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎓 Study Buddy loading...');
    initializeApp();
    setupEventListeners();
    setTimeout(() => {
        showScreen('setup-screen');
    }, 100);
});

function initializeApp() {
    appState.sessionStartTime = new Date();
    console.log('✅ Study Buddy initialized successfully');
}

function setupEventListeners() {
    // Difficulty button listeners
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            appState.selectedDifficulty = this.dataset.difficulty;
            
            // Show start button for random topics if topic is selected
            const startBtn = document.getElementById('startRandomBtn');
            if (startBtn && appState.randomTopicData) {
                startBtn.style.display = 'inline-block';
            }
        });
    });
    
    console.log('📝 Event listeners set up');
}

// ==========================================================================
// NAVIGATION & SCREEN MANAGEMENT
// ==========================================================================

function selectPrebuiltTopics() { 
    selectCustomTopic(); 
}

function selectCustomTopic() {
    appState.studyMode = 'custom';
    showScreen('custom-setup-screen');
    console.log('📚 Switched to custom topic mode');
}

function selectStreamSpecific() { 
    selectCustomTopic(); 
}

function selectRandomTopic() {
    appState.studyMode = 'random';
    showScreen('random-topic-screen');
    generateNewRandomTopics();
    console.log('🎲 Switched to random topic mode');
}

function goBack() {
    appState.randomTopicData = null;
    appState.selectedTopic = '';
    appState.selectedDifficulty = '';
    appState.questionFormat = 'mixed';
    
    // Reset difficulty selections
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset question format selections
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Set default question format
    const defaultFormatBtn = document.querySelector('[data-format="mixed"]');
    if (defaultFormatBtn) {
        defaultFormatBtn.classList.add('selected');
    }
    
    showScreen('setup-screen');
    console.log('↩️ Returned to setup screen');
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.setup-screen, .custom-setup-screen, .study-screen, .random-topic-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.querySelector(`.${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log(`📱 Showing screen: ${screenId}`);
    } else {
        console.error(`❌ Screen not found: ${screenId}`);
    }
}

// ==========================================================================
// QUESTION FORMAT SELECTION
// ==========================================================================

function selectQuestionFormat(format) {
    appState.questionFormat = format;
    
    // Update UI to show selection
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`[data-format="${format}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    console.log(`📝 Selected question format: ${format}`);
}

// ==========================================================================
// RANDOM TOPIC FUNCTIONS
// ==========================================================================

function generateNewRandomTopics() {
    console.log('🎲 Generating new random topics...');
    
    if (!window.getRandomTopicOptions) {
        console.error('❌ Random topic function not available');
        return;
    }
    
    const randomTopics = window.getRandomTopicOptions(3);
    const container = document.getElementById('randomTopicsContainer');
    
    if (!container) {
        console.error('❌ Random topics container not found');
        return;
    }
    
    container.innerHTML = randomTopics.map(topic => `
        <div class="random-topic-card" onclick="selectRandomTopicOption('${topic.topic}', '${topic.category}')">
            <h3 style="color: ${topic.categoryColor}">${topic.topic}</h3>
            <div class="topic-category" style="background: ${topic.categoryColor}20; color: ${topic.categoryColor}; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold;">${topic.category.toUpperCase()}</div>
            <p>${topic.description}</p>
        </div>
    `).join('');
    
    // Hide difficulty selector until topic is chosen
    const difficultySelector = document.getElementById('randomTopicDifficulty');
    if (difficultySelector) {
        difficultySelector.style.display = 'none';
    }
    
    console.log('✅ Random topics generated');
}

function selectRandomTopicOption(topic, category) {
    appState.selectedTopic = topic;
    appState.randomTopicData = { topic, category };
    
    console.log(`🎯 Selected random topic: ${topic} (${category})`);
    
    // Show difficulty selector
    const difficultySelector = document.getElementById('randomTopicDifficulty');
    if (difficultySelector) {
        difficultySelector.style.display = 'block';
    }
    
    // Highlight selected topic
    document.querySelectorAll('.random-topic-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Find and highlight the clicked card
    const clickedCard = event.target.closest('.random-topic-card');
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    // Show start button if difficulty is already selected
    const startBtn = document.getElementById('startRandomBtn');
    if (startBtn && appState.selectedDifficulty) {
        startBtn.style.display = 'inline-block';
    }
}

function startRandomTopicStudy() {
    if (!appState.selectedDifficulty || !appState.randomTopicData) {
        alert('Please select a topic and difficulty level first!');
        return;
    }
    
    console.log('🚀 Starting random topic study:', appState.randomTopicData.topic);
    
    // Update UI with selected topic
    document.getElementById('currentTopicDisplay').textContent = appState.randomTopicData.topic;
    const categoryBadge = document.getElementById('topicCategory');
    if (categoryBadge) {
        categoryBadge.textContent = appState.randomTopicData.category.toUpperCase();
    }
    
    showScreen('study-screen');
    startTeachingPhase(appState.randomTopicData.topic, appState.selectedDifficulty, '');
}

// ==========================================================================
// CUSTOM TOPIC FUNCTIONS
// ==========================================================================

function fillTopic(topicName) {
    const topicInput = document.getElementById('customTopic');
    if (topicInput) {
        topicInput.value = topicName;
        console.log(`✏️ Filled topic: ${topicName}`);
    }
}

function startCustomStudy() {
    const topicInput = document.getElementById('customTopic');
    const descriptionInput = document.getElementById('topicDescription');
    
    if (!topicInput || !descriptionInput) {
        console.error('❌ Input elements not found');
        return;
    }
    
    const topic = topicInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!topic) {
        alert('Please enter a topic to study!');
        return;
    }
    
    if (!appState.selectedDifficulty) {
        alert('Please select your difficulty level!');
        return;
    }
    
    if (!appState.questionFormat) {
        alert('Please select your question format!');
        return;
    }
    
    appState.selectedTopic = topic;
    console.log('🚀 Starting custom study:', topic, 'Format:', appState.questionFormat);
    
    // Update UI with selected topic
    document.getElementById('currentTopicDisplay').textContent = topic;
    const categoryBadge = document.getElementById('topicCategory');
    if (categoryBadge) {
        categoryBadge.textContent = 'CUSTOM';
    }
    
    showScreen('study-screen');
    startTeachingPhase(topic, appState.selectedDifficulty, description);
}

// ==========================================================================
// TEACHING PHASE
// ==========================================================================

function startTeachingPhase(topic, difficulty, description) {
    console.log('📖 Starting teaching phase for:', topic, 'Difficulty:', difficulty);
    appState.currentPhase = 'teaching';
    updateUIForTeaching();
    generateLessonContent(topic, difficulty, description);
}

function updateUIForTeaching() {
    // Hide question-related UI elements
    document.getElementById('answerInput').style.display = 'none';
    document.querySelector('.submit-btn').style.display = 'none';
    document.querySelector('.next-btn').style.display = 'none';
    
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.style.display = 'none';

    // Update stats for teaching phase
    document.getElementById('questionsAnswered').textContent = 'Teaching';
    document.getElementById('correctAnswers').textContent = 'Phase';
    document.getElementById('currentStreak').textContent = '📚';
    document.getElementById('masteryLevel').textContent = 'Learning';
    document.getElementById('progressFill').style.width = '20%';

    // Create lesson complete button if it doesn't exist
    const questionCard = document.querySelector('.question-card');
    let lessonCompleteBtn = document.getElementById('lessonCompleteBtn');
    
    if (!lessonCompleteBtn) {
        lessonCompleteBtn = document.createElement('button');
        lessonCompleteBtn.id = 'lessonCompleteBtn';
        lessonCompleteBtn.className = 'start-btn';
        lessonCompleteBtn.textContent = 'I\'ve finished reading - Start Questions! 🎯';
        lessonCompleteBtn.onclick = startQuestioningPhase;
        lessonCompleteBtn.style.display = 'none';
        questionCard.appendChild(lessonCompleteBtn);
    }
    
    console.log('🎨 UI updated for teaching phase');
}

async function generateLessonContent(topic, difficulty, description) {
    console.log('🤖 Generating lesson content for:', topic);
    
    // Show loading message
    document.getElementById('questionText').innerHTML = `
        <div class="loading-message" style="padding: 30px; text-align: center; background: #f0f9ff; border-radius: 10px; color: #0369a1;">
            <div style="font-size: 1.2em; margin-bottom: 10px;">📚 Creating your personalized lesson about "${topic}"...</div>
            <div style="font-size: 0.9em; opacity: 0.8;">This may take a few moments while our AI analyzes the topic</div>
            <div style="margin-top: 15px;">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        // Check if API function exists
        if (!window.generateStudyMaterial) {
            throw new Error('Study material generation function not available');
        }
        
        const lessonContent = await window.generateStudyMaterial(topic, difficulty, description);
        appState.lessonContent = lessonContent;
        displayLessonContent(lessonContent);
        console.log('✅ Lesson content generated successfully');
        
    } catch (error) {
        console.error('❌ Error generating lesson:', error);
        document.getElementById('questionText').innerHTML = `
            <div class="error-message" style="padding: 20px; background: #fef2f2; color: #dc2626; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.1em; margin-bottom: 10px;">❌ Error generating lesson content</div>
                <div style="font-size: 0.9em; margin-bottom: 15px;">${error.message}</div>
                <button onclick="generateLessonContent('${topic}', '${difficulty}', '${description}')" 
                        class="retry-btn" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    🔄 Try Again
                </button>
            </div>
        `;
    }
}

function displayLessonContent(content) {
    // Convert markdown-style content to HTML
    let htmlContent = content
        .replace(/^# (.+)$/gm, '<h2 style="color: #2563eb; margin: 20px 0 15px 0; font-size: 1.4em;">$1</h2>')
        .replace(/^## (.+)$/gm, '<h3 style="color: #475569; margin: 15px 0 10px 0; font-size: 1.2em;">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #1e40af;">$1</strong>')
        .replace(/^• (.+)$/gm, '<li style="margin: 5px 0; line-height: 1.4;">$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>')
        .replace(/<p><li/g, '<ul style="margin: 10px 0; padding-left: 20px;"><li')
        .replace(/<\/li><\/p>/g, '</li></ul>')
        .replace(/---/g, '<hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">');

    document.getElementById('questionText').innerHTML = `
        <div style="max-height: 400px; overflow-y: auto; padding: 20px; background: #f8fafc; border-radius: 10px; line-height: 1.6; border: 1px solid #e2e8f0;">
            ${htmlContent}
        </div>
    `;

    // Show the lesson complete button after a delay
    setTimeout(() => {
        const lessonCompleteBtn = document.getElementById('lessonCompleteBtn');
        if (lessonCompleteBtn) {
            lessonCompleteBtn.style.display = 'inline-block';
        }
    }, 2000);
    
    console.log('📖 Lesson content displayed');
}

// ==========================================================================
// QUESTIONING PHASE
// ==========================================================================

function startQuestioningPhase() {
    console.log('❓ Starting questioning phase with format:', appState.questionFormat);
    appState.currentPhase = 'questioning';
    appState.hasCompletedLesson = true;
    
    // Show question-related UI elements
    document.getElementById('answerInput').style.display = 'block';
    document.querySelector('.submit-btn').style.display = 'inline-block';
    
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.style.display = 'inline-block';
    
    // Hide lesson complete button
    const lessonCompleteBtn = document.getElementById('lessonCompleteBtn');
    if (lessonCompleteBtn) lessonCompleteBtn.style.display = 'none';
    
    generateQuestions();
    updateStats();
}

async function generateQuestions() {
    const topic = appState.selectedTopic;
    const difficulty = appState.selectedDifficulty;
    const format = appState.questionFormat;
    
    console.log('🤖 Generating AI questions for:', topic, 'Format:', format, 'Difficulty:', difficulty);
    
    // Show loading message
    document.getElementById('questionText').innerHTML = `
        <div class="loading-message" style="padding: 30px; text-align: center; background: #f0f9ff; border-radius: 10px; color: #0369a1;">
            <div style="font-size: 1.2em; margin-bottom: 10px;">🤖 Creating personalized questions about "${topic}"...</div>
            <div style="font-size: 0.9em; opacity: 0.8;">AI is analyzing the topic and generating ${format} questions</div>
            <div style="margin-top: 15px;">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        // Generate questions using AI
        const questions = await window.studyBuddyAPI.generateQuestions(topic, difficulty, format, 5);
        appState.generatedQuestions = questions;
        
        console.log(`✅ Generated ${questions.length} questions successfully`);
        
        // Start with the first question
        loadNextQuestion();
        
    } catch (error) {
        console.error('❌ Error generating questions:', error);
        
        // Show error and fallback
        document.getElementById('questionText').innerHTML = `
            <div class="error-message" style="padding: 20px; background: #fef2f2; color: #dc2626; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.1em; margin-bottom: 10px;">⚠️ Unable to generate AI questions</div>
                <div style="font-size: 0.9em; margin-bottom: 15px;">Using backup questions for ${topic}</div>
                <button onclick="generateQuestions()" class="retry-btn" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    🔄 Try AI Generation Again
                </button>
            </div>
        `;
        
        // Use fallback questions
        setTimeout(() => {
            appState.generatedQuestions = window.studyBuddyAPI.generateFallbackQuestions(topic, format, 5);
            loadNextQuestion();
        }, 3000);
    }
}

function loadNextQuestion() {
    const q = appState.generatedQuestions[appState.currentQuestion];
    
    if (!q) {
        showCompletionMessage();
        return;
    }
    
    appState.currentQuestionType = q.type;
    
    if (q.type === 'mcq') {
        displayMCQQuestion(q);
    } else {
        displayEssayQuestion(q);
    }
    
    console.log(`📋 Loaded question ${appState.currentQuestion + 1} (${q.type})`);
}

function displayMCQQuestion(question) {
    document.getElementById('questionText').innerHTML = `
        <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <strong style="color: #1e40af;">Question ${appState.currentQuestion + 1} of ${appState.generatedQuestions.length}</strong>
                <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.8em;">MULTIPLE CHOICE</span>
            </div>
            <div style="font-size: 1.1em; line-height: 1.5; margin-bottom: 20px;">${question.question}</div>
            <div class="mcq-options">
                ${question.options.map((option, index) => `
                    <div class="mcq-option" onclick="selectMCQOption(${index})" data-option="${index}">
                        <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Hide essay input, show MCQ submit button
    document.getElementById('answerInput').style.display = 'none';
    document.querySelector('.submit-btn').style.display = 'inline-block';
    document.querySelector('.submit-btn').textContent = 'Submit Answer';
    document.querySelector('.next-btn').style.display = 'none';
    document.getElementById('aiResponse').style.display = 'none';
    
    // Reset MCQ selection
    appState.selectedMCQAnswer = null;
}

function displayEssayQuestion(question) {
    document.getElementById('questionText').innerHTML = `
        <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #10b981;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <strong style="color: #1e40af;">Question ${appState.currentQuestion + 1} of ${appState.generatedQuestions.length}</strong>
                <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.8em;">ESSAY</span>
            </div>
            <div style="font-size: 1.1em; line-height: 1.5;">${question.question}</div>
        </div>
    `;
    
    // Show essay input, hide MCQ options
    document.getElementById('answerInput').style.display = 'block';
    document.getElementById('answerInput').value = '';
    document.querySelector('.submit-btn').style.display = 'inline-block';
    document.querySelector('.submit-btn').textContent = 'Submit Answer';
    document.querySelector('.next-btn').style.display = 'none';
    document.getElementById('aiResponse').style.display = 'none';
}

// ==========================================================================
// MCQ OPTION SELECTION
// ==========================================================================

function selectMCQOption(optionIndex) {
    // Remove previous selections
    document.querySelectorAll('.mcq-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    document.querySelector(`[data-option="${optionIndex}"]`).classList.add('selected');
    
    appState.selectedMCQAnswer = optionIndex;
    console.log(`✅ Selected MCQ option: ${optionIndex}`);
}

// ==========================================================================
// ANSWER SUBMISSION
// ==========================================================================

function submitAnswer() {
    const currentQ = appState.generatedQuestions[appState.currentQuestion];
    
    if (currentQ.type === 'mcq') {
        submitMCQAnswer(currentQ);
    } else {
        submitEssayAnswer(currentQ);
    }
}

function submitMCQAnswer(question) {
    if (appState.selectedMCQAnswer === null) {
        alert('Please select an answer before submitting!');
        return;
    }
    
    const isCorrect = appState.selectedMCQAnswer === question.correctAnswer;
    const score = isCorrect ? 100 : 0;
    
    // Update stats
    appState.questionsAnswered++;
    if (isCorrect) appState.correctAnswers++;
    appState.currentStreak = isCorrect ? appState.currentStreak + 1 : 0;
    appState.detailedScores.push(score);
    
    // Show feedback
    const selectedOption = document.querySelector(`[data-option="${appState.selectedMCQAnswer}"]`);
    const correctOption = document.querySelector(`[data-option="${question.correctAnswer}"]`);
    
    if (isCorrect) {
        selectedOption.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        selectedOption.style.borderColor = '#22c55e';
    } else {
        selectedOption.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
        selectedOption.style.borderColor = '#ef4444';
        correctOption.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        correctOption.style.borderColor = '#22c55e';
    }
    
    // Disable all options
    document.querySelectorAll('.mcq-option').forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show explanation
    document.getElementById('aiResponse').innerHTML = `
        <div style="padding: 15px; background: ${isCorrect ? '#f0fdf4' : '#fef2f2'}; 
                    border-radius: 8px; border-left: 4px solid ${isCorrect ? '#22c55e' : '#ef4444'};">
            <div><strong>Result:</strong> ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div>
            <div style="margin-top: 8px;"><strong>Explanation:</strong> ${question.explanation}</div>
            <div style="margin-top: 8px;"><strong>Score:</strong> ${score}/100</div>
        </div>
    `;
    
    document.getElementById('aiResponse').style.display = 'block';
    document.querySelector('.submit-btn').style.display = 'none';
    document.querySelector('.next-btn').style.display = 'inline-block';
    
    updateStats();
    console.log(`✅ MCQ Answer submitted - ${isCorrect ? 'Correct' : 'Incorrect'}`);
}

async function submitEssayAnswer(question) {
    const input = document.getElementById('answerInput').value.trim();
    
    if (!input) {
        alert('Please write an answer before submitting!');
        return;
    }
    
    if (input.length < 30) {
        alert('Please write at least 30 characters to provide a meaningful answer.');
        return;
    }
    
    console.log('📤 Submitting essay answer for AI evaluation...');
    
    // Show evaluation loading state
    document.getElementById('aiResponse').innerHTML = `
        <div style="padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <div><strong>🤖 AI is evaluating your answer...</strong></div>
            <div style="margin-top: 8px; font-size: 0.9em;">This may take a moment</div>
            <div style="margin-top: 10px;">
                <div class="loading-spinner" style="width: 20px; height: 20px;"></div>
            </div>
        </div>
    `;
    document.getElementById('aiResponse').style.display = 'block';
    
    try {
        // Get AI evaluation
        const evaluation = await window.studyBuddyAPI.evaluateEssayAnswer(
            question, 
            input, 
            appState.selectedTopic, 
            appState.selectedDifficulty
        );
        
        // Update stats
        appState.questionsAnswered++;
        if (evaluation.isCorrect) appState.correctAnswers++;
        appState.currentStreak = evaluation.isCorrect ? appState.currentStreak + 1 : 0;
        appState.detailedScores.push(evaluation.score);
        
        // Show detailed feedback
        document.getElementById('aiResponse').innerHTML = `
            <div style="padding: 20px; background: ${evaluation.score >= 80 ? '#f0fdf4' : evaluation.score >= 60 ? '#fffbeb' : '#fef2f2'}; 
                        border-radius: 8px; border-left: 4px solid ${evaluation.score >= 80 ? '#22c55e' : evaluation.score >= 60 ? '#f59e0b' : '#ef4444'};">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <strong style="font-size: 1.1em;">
                        ${evaluation.isCorrect ? '✅ Great Work!' : '📚 Keep Learning!'}
                    </strong>
                    <span style="background: ${evaluation.score >= 80 ? '#22c55e' : evaluation.score >= 60 ? '#f59e0b' : '#ef4444'}; 
                                 color: white; padding: 4px 12px; border-radius: 15px; font-weight: bold;">
                        ${evaluation.score}/100
                    </span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>AI Feedback:</strong><br>
                    ${evaluation.feedback}
                </div>
                
                ${evaluation.strengths.length > 0 ? `
                <div style="margin-bottom: 10px;">
                    <strong style="color: #059669;">✅ Strengths:</strong><br>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${evaluation.strengths.map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${evaluation.improvements.length > 0 ? `
                <div style="margin-bottom: 10px;">
                    <strong style="color: #d97706;">💡 Areas for Improvement:</strong><br>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${evaluation.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${evaluation.keywordsCovered.length > 0 ? `
                <div style="font-size: 0.9em; color: #059669;">
                    <strong>Key concepts covered:</strong> ${evaluation.keywordsCovered.join(', ')}
                </div>
                ` : ''}
            </div>
        `;
        
        document.querySelector('.submit-btn').style.display = 'none';
        document.querySelector('.next-btn').style.display = 'inline-block';
        
        updateStats();
        console.log(`✅ Essay evaluation completed - Score: ${evaluation.score}`);
        
    } catch (error) {
        console.error('❌ Error in essay evaluation:', error);
        
        // Fallback to simple evaluation
        const fallbackEval = window.studyBuddyAPI.getFallbackEvaluation(input);
        
        // Update stats with fallback
        appState.questionsAnswered++;
        if (fallbackEval.isCorrect) appState.correctAnswers++;
        appState.currentStreak = fallbackEval.isCorrect ? appState.currentStreak + 1 : 0;
        appState.detailedScores.push(fallbackEval.score);
        
        // Show fallback feedback
        document.getElementById('aiResponse').innerHTML = `
            <div style="padding: 15px; background: ${fallbackEval.score >= 60 ? '#fffbeb' : '#fef2f2'}; 
                        border-radius: 8px; border-left: 4px solid ${fallbackEval.score >= 60 ? '#f59e0b' : '#ef4444'};">
                <div><strong>Score:</strong> ${fallbackEval.score}/100</div>
                <div style="margin-top: 8px;">${fallbackEval.feedback}</div>
                <div style="margin-top: 8px; font-size: 0.9em; color: #92400e;">
                    <em>Note: AI evaluation temporarily unavailable, using basic scoring.</em>
                </div>
            </div>
        `;
        
        document.querySelector('.submit-btn').style.display = 'none';
        document.querySelector('.next-btn').style.display = 'inline-block';
        
        updateStats();
    }
}

function nextQuestion() {
    appState.currentQuestion++;
    appState.selectedMCQAnswer = null;
    document.querySelector('.next-btn').style.display = 'none';
    loadNextQuestion();
    console.log('➡️ Moving to next question');
}

// ==========================================================================
// HINT SYSTEM
// ==========================================================================

async function getHint() {
    const hintBtn = document.getElementById('hintBtn');
    const currentQ = appState.generatedQuestions[appState.currentQuestion];
    
    if (!currentQ) return;
    
    console.log('💡 Generating hint...');
    
    hintBtn.textContent = '💭 Thinking...';
    hintBtn.disabled = true;
    
    try {
        let hint;
        
        // Try to use API hint generation if available
        if (window.studyBuddyAPI && window.studyBuddyAPI.generateHint) {
            hint = await window.studyBuddyAPI.generateHint(
                currentQ.question, 
                document.getElementById('answerInput').value, 
                appState.selectedTopic
            );
        } else {
            // Fallback hint based on question type
            if (currentQ.type === 'mcq') {
                hint = `💡 Think about the key concepts from the lesson about ${appState.selectedTopic}. Which option best aligns with what you learned?`;
            } else {
                hint = `💡 Consider the main concepts from the lesson about ${appState.selectedTopic}. What were the key principles and examples discussed? Try to structure your answer with: definition, importance, and real-world examples.`;
            }
        }
        
        // Show hint in AI response area
        document.getElementById('aiResponse').innerHTML = `
            <div style="padding: 15px; background: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong style="color: #92400e;">💡 Hint:</strong><br><br>
                <div style="color: #92400e;">${hint}</div>
            </div>
        `;
        document.getElementById('aiResponse').style.display = 'block';
        
        console.log('✅ Hint generated');
        
    } catch (error) {
        console.error('❌ Error getting hint:', error);
        
        // Show fallback hint
        document.getElementById('aiResponse').innerHTML = `
            <div style="padding: 15px; background: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong style="color: #92400e;">💡 Hint:</strong><br><br>
                <div style="color: #92400e;">
                    Think about the main concepts from the lesson about ${appState.selectedTopic}. 
                    What were the key principles and examples discussed? Try to explain it in your own words.
                </div>
            </div>
        `;
        document.getElementById('aiResponse').style.display = 'block';
    }
    
    hintBtn.textContent = '💡 Need Another Hint?';
    hintBtn.disabled = false;
}

// ==========================================================================
// STATS & PROGRESS
// ==========================================================================

function updateStats() {
    document.getElementById('questionsAnswered').textContent = appState.questionsAnswered;
    document.getElementById('correctAnswers').textContent = appState.correctAnswers;
    document.getElementById('currentStreak').textContent = appState.currentStreak;
    
    // Calculate average score
    const avgScore = appState.detailedScores.length > 0 
        ? appState.detailedScores.reduce((a, b) => a + b, 0) / appState.detailedScores.length 
        : 0;
    
    document.getElementById('masteryLevel').textContent = Math.round(avgScore) + '%';
    
    // Update progress bar (20% for lesson + 80% for questions)
    const questionProgress = Math.min(appState.questionsAnswered * 16, 80); // 80% / 5 questions = 16% per question
    const totalProgress = 20 + questionProgress;
    document.getElementById('progressFill').style.width = totalProgress + '%';
    
    console.log(`📊 Stats updated - Q: ${appState.questionsAnswered}, Correct: ${appState.correctAnswers}, Avg: ${Math.round(avgScore)}%`);
}

function showCompletionMessage() {
    const avgScore = appState.detailedScores.length > 0 
        ? appState.detailedScores.reduce((a, b) => a + b, 0) / appState.detailedScores.length 
        : 0;
    const accuracy = appState.questionsAnswered > 0 
        ? (appState.correctAnswers / appState.questionsAnswered * 100) 
        : 0;
    
    // Calculate question type breakdown
    const mcqCount = appState.generatedQuestions.filter(q => q.type === 'mcq').length;
    const essayCount = appState.generatedQuestions.filter(q => q.type === 'essay').length;
    
    // Calculate time spent
    const timeSpent = Math.round((new Date() - appState.sessionStartTime) / 1000 / 60); // minutes
    
    document.getElementById('questionText').innerHTML = `
        <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; border-radius: 15px;">
            <h2 style="margin: 0 0 20px 0;">🎉 Congratulations!</h2>
            <p style="font-size: 1.1em; margin: 0 0 20px 0;">You've completed your study session on <strong>${appState.selectedTopic}</strong>!</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0;">
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    <div style="font-size: 1.5em; font-weight: bold;">${appState.questionsAnswered}</div>
                    <div>Questions</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    <div style="font-size: 1.5em; font-weight: bold;">${Math.round(accuracy)}%</div>
                    <div>Accuracy</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    <div style="font-size: 1.5em; font-weight: bold;">${Math.round(avgScore)}</div>
                    <div>Avg Score</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    <div style="font-size: 1.5em; font-weight: bold;">${appState.currentStreak}</div>
                    <div>Best Streak</div>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 20px 0;">
                <div style="font-size: 0.9em; margin-bottom: 8px;">
                    <strong>Quiz Format:</strong> ${appState.questionFormat.toUpperCase()}
                </div>
                <div style="font-size: 0.9em; margin-bottom: 8px;">
                    <strong>Question Types:</strong> ${mcqCount} Multiple Choice, ${essayCount} Essay
                </div>
                <div style="font-size: 0.9em; margin-bottom: 8px;">
                    <strong>Difficulty:</strong> ${appState.selectedDifficulty.charAt(0).toUpperCase() + appState.selectedDifficulty.slice(1)}
                </div>
                <div style="font-size: 0.9em;">
                    <strong>Time Spent:</strong> ${timeSpent} minute${timeSpent !== 1 ? 's' : ''}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                ${avgScore >= 85 ? '🏆 Outstanding performance! You\'ve mastered this topic!' :
                  avgScore >= 70 ? '🎯 Great job! You have a solid understanding.' :
                  avgScore >= 60 ? '👍 Good work! Keep practicing to improve further.' :
                  '📚 Keep studying! Review the material and try again.'}
            </div>
            
            <button onclick="startNewSession()" style="background: white; color: #1e40af; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1em; margin-right: 10px;">
                🚀 Start New Session
            </button>
            <button onclick="reviewSession()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1em;">
                📝 Review Answers
            </button>
        </div>
    `;
    
    // Hide form elements
    document.getElementById('answerInput').style.display = 'none';
    document.querySelector('.submit-btn').style.display = 'none';
    document.querySelector('.next-btn').style.display = 'none';
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.style.display = 'none';
    
    console.log('🏁 Study session completed!');
}

function reviewSession() {
    // Simple review - show summary of all questions and answers
    let reviewContent = `<h3>📝 Session Review</h3>`;
    
    appState.generatedQuestions.forEach((q, index) => {
        const score = appState.detailedScores[index] || 0;
        reviewContent += `
            <div style="margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid ${score >= 70 ? '#22c55e' : '#f59e0b'};">
                <strong>Q${index + 1} (${q.type.toUpperCase()}):</strong> ${q.question}<br>
                <span style="color: ${score >= 70 ? '#059669' : '#d97706'};">Score: ${score}/100</span>
            </div>
        `;
    });
    
    document.getElementById('questionText').innerHTML = reviewContent;
}

function startNewSession() {
    console.log('🔄 Starting new session...');
    window.location.reload();
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

// Export state for debugging
window.getAppState = () => appState;
window.debugApp = () => {
    console.log('🐛 Debug Info:', {
        state: appState,
        apiAvailable: !!window.studyBuddyAPI,
        randomTopicsAvailable: !!window.getRandomTopicOptions,
        lessonGenAvailable: !!window.generateStudyMaterial
    });
};

// Reset function for testing
window.resetApp = () => {
    appState = {
        studyMode: '',
        selectedTopic: '',
        selectedDifficulty: '',
        questionFormat: 'mixed',
        currentPhase: 'setup',
        currentQuestion: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        lessonContent: null,
        generatedQuestions: [],
        sessionStartTime: new Date(),
        studyHistory: [],
        detailedScores: [],
        hasCompletedLesson: false,
        selectedMCQAnswer: null,
        randomTopicData: null,
        currentQuestionType: null
    };
    showScreen('setup-screen');
    console.log('🔄 App state reset');
};

console.log('✅ Study Buddy script with AI Question System loaded successfully!');