class StudyBuddyGroqAPI {
    constructor() {
        this.groqKey = null;
        this.groqURL = 'https://api.groq.com/openai/v1/chat/completions';
        this.isEnabled = false;
        this.model = 'llama-3.3-70b-versatile'; // Updated model name
        
        // Random topic categories
        this.topicCategories = {
            science: ['Quantum Physics', 'Marine Biology', 'Genetics', 'Climate Science', 'Neuroscience', 'Astronomy', 'Chemistry', 'Ecology', 'Microbiology'],
            technology: ['Artificial Intelligence', 'Blockchain', 'Cybersecurity', 'Cloud Computing', 'Machine Learning', 'Internet of Things', 'Virtual Reality', 'Data Science'],
            history: ['Ancient Civilizations', 'World War II', 'Industrial Revolution', 'Renaissance', 'Cold War', 'Medieval Europe', 'Ancient Rome', 'Egyptian History'],
            arts: ['Renaissance Art', 'Modern Photography', 'Classical Music', 'Digital Art', 'Theater History', 'Film Studies', 'Architecture', 'Literature Analysis'],
            business: ['Marketing Strategy', 'Financial Planning', 'Entrepreneurship', 'Project Management', 'Leadership', 'Economics', 'Business Ethics'],
            psychology: ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology', 'Behavioral Economics', 'Mental Health', 'Learning Theory']
        };
    }
    
    setApiKey(key) {
        this.groqKey = key;
        this.isEnabled = !!key;
        console.log('✅ Groq API configured:', this.isEnabled, 'Key length:', key ? key.length : 0);
    }
    
    // ==========================================================================
    // RANDOM TOPIC FUNCTIONS
    // ==========================================================================
    
    generateRandomTopic() {
        const categories = Object.keys(this.topicCategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const topics = this.topicCategories[randomCategory];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        return {
            topic: randomTopic,
            category: randomCategory,
            description: `Explore ${randomTopic} - a fascinating subject in ${randomCategory}!`,
            categoryColor: this.getCategoryColor(randomCategory)
        };
    }
    
    getRandomTopicOptions(count = 3) {
        const options = [];
        const usedTopics = new Set();
        
        while (options.length < count) {
            const randomTopic = this.generateRandomTopic();
            if (!usedTopics.has(randomTopic.topic)) {
                options.push(randomTopic);
                usedTopics.add(randomTopic.topic);
            }
        }
        return options;
    }
    
    getCategoryColor(category) {
        const colors = {
            science: '#10b981', technology: '#3b82f6', history: '#f59e0b',
            arts: '#8b5cf6', business: '#ef4444', psychology: '#06b6d4'
        };
        return colors[category] || '#6b7280';
    }
    
    // ==========================================================================
    // LESSON GENERATION
    // ==========================================================================
    
    async generateStudyMaterial(topic, difficulty, description = '') {
        console.log('🎓 Generating lesson for:', topic, 'Difficulty:', difficulty);
        console.log('🔑 API Enabled:', this.isEnabled, 'Key exists:', !!this.groqKey);
        
        if (!this.isEnabled) {
            return `❌ ERROR: Groq API is not enabled!

Check your setup:
1. Go to https://console.groq.com and get a free API key
2. Put your API key in config.js (replace 'YOUR_GROQ_API_KEY_HERE')
3. Refresh the page

Current status:
- API Key: ${this.groqKey ? `Present (${this.groqKey.length} chars)` : 'MISSING'}
- API Enabled: ${this.isEnabled}

WITHOUT a working API key, you'll only get generic template content.`;
        }
        
        try {
            console.log('🚀 Calling Groq API...');
            const prompt = this.createLessonPrompt(topic, difficulty, description);
            const response = await this.callGroq(prompt);
            console.log('✅ Groq API successful! Response length:', response.length);
            return response;
            
        } catch (error) {
            console.error('❌ Groq API Error:', error.message);
            return `❌ GROQ API ERROR: ${error.message}

This error means:
${this.diagnoseError(error)}

To fix this:
1. Check your API key is correct in config.js
2. Make sure you have credits/quota remaining
3. Check your internet connection
4. Verify the API key has proper permissions

Current API status:
- Key: ${this.groqKey ? 'Present' : 'Missing'}
- URL: ${this.groqURL}
- Model: ${this.model}`;
        }
    }
    
    createLessonPrompt(topic, difficulty, description) {
        return `You are an expert educator. Create a comprehensive ${difficulty} level lesson about "${topic}".

IMPORTANT: Write REAL educational content with specific facts, not generic text.

Structure:
# Learning About ${topic.toUpperCase()}

## Introduction
[2-3 paragraphs with specific facts about what ${topic} is, its history/origin, and importance]

## Key Concepts
**1. [Specific Concept]**: [Real details and examples]
**2. [Specific Concept]**: [Real details and examples]  
**3. [Specific Concept]**: [Real details and examples]
**4. [Specific Concept]**: [Real details and examples]

## Real Examples
• **[Real Example 1]**: [Specific details]
• **[Real Example 2]**: [Specific details]
• **[Real Example 3]**: [Specific details]

## Key Facts
• [Specific fact about ${topic}]
• [Specific fact about ${topic}]
• [Specific fact about ${topic}]

## Why It Matters
[Real applications and current relevance]

Requirements:
- Use ACTUAL facts and details about ${topic}
- Include real examples, not placeholders
- ${difficulty} level language
- 400-600 words

${description ? `Focus on: ${description}` : ''}`;
    }
    
    // ==========================================================================
    // AI QUESTION GENERATION
    // ==========================================================================
    
    async generateQuestions(topic, difficulty, questionType = 'mixed', count = 5) {
        console.log(`🤖 Generating ${questionType} questions for: ${topic}`);
        
        if (!this.isEnabled) {
            console.warn('⚠️ API not enabled, using fallback questions');
            return this.generateFallbackQuestions(topic, questionType, count);
        }
        
        try {
            let prompt;
            
            if (questionType === 'mcq') {
                prompt = this.createMCQPrompt(topic, difficulty, count);
            } else if (questionType === 'essay') {
                prompt = this.createEssayPrompt(topic, difficulty, count);
            } else {
                prompt = this.createMixedPrompt(topic, difficulty, count);
            }
            
            const response = await this.callGroq(prompt);
            const questions = this.parseQuestionsResponse(response, questionType);
            
            console.log(`✅ Generated ${questions.length} AI questions`);
            return questions;
            
        } catch (error) {
            console.error('❌ Error generating questions:', error);
            return this.generateFallbackQuestions(topic, questionType, count);
        }
    }
    
    createMCQPrompt(topic, difficulty, count) {
        return `Create ${count} multiple choice questions about "${topic}" at ${difficulty} level.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "What is the primary characteristic of ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Requirements:
- Questions should test real understanding of ${topic}, not just definitions
- Make questions thought-provoking and practical
- Options should be plausible but clearly distinguishable
- Explanations should be educational and helpful
- Difficulty level: ${difficulty}
- Focus on concepts, applications, and real-world relevance

Return only the JSON, no other text.`;
    }
    
    createEssayPrompt(topic, difficulty, count) {
        return `Create ${count} essay questions about "${topic}" at ${difficulty} level.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "type": "essay",
      "question": "Explain the key principles of ${topic} and provide real-world examples.",
      "points": 20,
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "rubric": "Look for understanding of core concepts, practical examples, and clear explanations"
    }
  ]
}

Requirements:
- Questions should require thoughtful, detailed responses
- Test deep understanding, not just memorization
- Include practical applications and examples
- Make questions engaging and relevant to current contexts
- Difficulty level: ${difficulty}
- Each question should take 3-5 minutes to answer well

Return only the JSON, no other text.`;
    }
    
    createMixedPrompt(topic, difficulty, count) {
        const mcqCount = Math.ceil(count * 0.6); // 60% MCQ
        const essayCount = count - mcqCount; // 40% Essay
        
        return `Create a mixed quiz about "${topic}" at ${difficulty} level with ${mcqCount} multiple choice and ${essayCount} essay questions.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Which statement best describes ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Brief explanation"
    },
    {
      "id": 2,
      "type": "essay",
      "question": "Analyze the impact of ${topic} in modern society.",
      "points": 20,
      "keywords": ["impact", "society", "analysis"],
      "rubric": "Look for critical thinking and real examples"
    }
  ]
}

Requirements:
- Mix question types for variety and engagement
- MCQ questions should test quick recognition and understanding
- Essay questions should require deeper analysis and explanation
- All questions should be relevant to ${topic} and ${difficulty} level
- Make questions practical and thought-provoking
- Ensure good progression from basic to more complex concepts

Return only the JSON, no other text.`;
    }
    
    parseQuestionsResponse(response, questionType) {
        try {
            // Clean the response - remove any markdown or extra text
            let cleanResponse = response.trim();
            
            // Try to extract JSON if wrapped in markdown
            const jsonMatch = cleanResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[1];
            }
            
            // Remove any text before the first { or after the last }
            const startIndex = cleanResponse.indexOf('{');
            const endIndex = cleanResponse.lastIndexOf('}');
            if (startIndex !== -1 && endIndex !== -1) {
                cleanResponse = cleanResponse.substring(startIndex, endIndex + 1);
            }
            
            const parsed = JSON.parse(cleanResponse);
            
            if (!parsed.questions || !Array.isArray(parsed.questions)) {
                throw new Error('Invalid response format - missing questions array');
            }
            
            // Validate and clean up questions
            return parsed.questions.map((q, index) => {
                const question = {
                    id: index + 1,
                    type: q.type || questionType,
                    question: q.question || `Question about ${this.selectedTopic}`,
                    points: q.points || (q.type === 'mcq' ? 10 : 20)
                };
                
                if (q.type === 'mcq') {
                    question.options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
                    question.correctAnswer = q.correctAnswer || 0;
                    question.explanation = q.explanation || 'Correct answer explanation.';
                } else {
                    question.keywords = q.keywords || [];
                    question.rubric = q.rubric || 'Look for understanding and examples.';
                }
                
                return question;
            });
            
        } catch (error) {
            console.error('❌ Error parsing questions response:', error);
            console.log('Raw response:', response);
            throw new Error('Failed to parse AI response');
        }
    }
    
    generateFallbackQuestions(topic, questionType, count) {
        console.log('🔄 Using fallback question generation');
        
        if (questionType === 'mcq') {
            return this.generateFallbackMCQ(topic, count);
        } else if (questionType === 'essay') {
            return this.generateFallbackEssay(topic, count);
        } else {
            const mcqCount = Math.ceil(count * 0.6);
            const essayCount = count - mcqCount;
            return [
                ...this.generateFallbackMCQ(topic, mcqCount),
                ...this.generateFallbackEssay(topic, essayCount)
            ];
        }
    }
    
    generateFallbackMCQ(topic, count) {
        const templates = [
            {
                question: `Which of the following best describes ${topic}?`,
                options: [
                    `A fundamental concept in its field`,
                    `A recently discovered phenomenon`,
                    `An outdated theory`,
                    `A simple technique`
                ],
                correctAnswer: 0,
                explanation: `${topic} is indeed a fundamental concept that plays a crucial role in its field.`
            },
            {
                question: `What is the primary purpose of studying ${topic}?`,
                options: [
                    `To memorize facts`,
                    `To understand principles and applications`,
                    `To pass exams only`,
                    `To impress others`
                ],
                correctAnswer: 1,
                explanation: `The main goal is to understand principles and how they apply in real situations.`
            },
            {
                question: `Which approach is most effective when learning ${topic}?`,
                options: [
                    `Memorizing definitions only`,
                    `Understanding concepts and practicing applications`,
                    `Reading once and moving on`,
                    `Avoiding difficult parts`
                ],
                correctAnswer: 1,
                explanation: `Understanding concepts and practicing applications leads to better mastery.`
            }
        ];
        
        return templates.slice(0, count).map((template, index) => ({
            id: index + 1,
            type: 'mcq',
            question: template.question,
            options: template.options,
            correctAnswer: template.correctAnswer,
            explanation: template.explanation,
            points: 10
        }));
    }
    
    generateFallbackEssay(topic, count) {
        const templates = [
            {
                question: `What is ${topic} and why is it important? Explain its key characteristics and significance.`,
                keywords: ['definition', 'importance', 'characteristics'],
                rubric: 'Look for clear definition, understanding of importance, and key characteristics.'
            },
            {
                question: `Describe a real-world application of ${topic} and explain how it works in practice.`,
                keywords: ['application', 'real-world', 'practice'],
                rubric: 'Look for concrete examples and practical understanding.'
            },
            {
                question: `What are the main benefits and potential challenges associated with ${topic}?`,
                keywords: ['benefits', 'challenges', 'analysis'],
                rubric: 'Look for balanced analysis of pros and cons.'
            }
        ];
        
        return templates.slice(0, count).map((template, index) => ({
            id: index + 1,
            type: 'essay',
            question: template.question,
            keywords: template.keywords,
            rubric: template.rubric,
            points: 20
        }));
    }
    
    // ==========================================================================
    // AI ESSAY EVALUATION
    // ==========================================================================
    
    async evaluateEssayAnswer(question, userAnswer, topic, difficulty) {
        console.log('🔍 AI evaluating essay answer...');
        
        if (!this.isEnabled || !userAnswer || userAnswer.length < 10) {
            return this.getFallbackEvaluation(userAnswer);
        }
        
        try {
            const prompt = this.createEvaluationPrompt(question, userAnswer, topic, difficulty);
            const response = await this.callGroq(prompt);
            const evaluation = this.parseEvaluationResponse(response);
            
            console.log('✅ AI evaluation completed');
            return evaluation;
            
        } catch (error) {
            console.error('❌ Error in AI evaluation:', error);
            return this.getFallbackEvaluation(userAnswer);
        }
    }
    
    createEvaluationPrompt(question, userAnswer, topic, difficulty) {
        return `Evaluate this student's essay answer about "${topic}" at ${difficulty} level.

QUESTION: ${question.question}

STUDENT ANSWER: ${userAnswer}

KEYWORDS TO LOOK FOR: ${question.keywords ? question.keywords.join(', ') : 'key concepts'}

RUBRIC: ${question.rubric || 'Look for understanding, examples, and clear explanations'}

Provide evaluation in this EXACT JSON format:
{
  "score": 85,
  "isCorrect": true,
  "feedback": "Detailed feedback on what was good and what could be improved",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "keywordsCovered": ["keyword1", "keyword2"],
  "missingElements": ["element1", "element2"]
}

Scoring Guidelines:
- 90-100: Exceptional understanding, clear examples, comprehensive coverage
- 80-89: Good understanding, some examples, covers most key points
- 70-79: Basic understanding, limited examples, covers some key points
- 60-69: Minimal understanding, few/no examples, misses key points
- Below 60: Poor understanding, significant gaps

Be constructive and encouraging while being accurate. Focus on learning, not just grading.

Return only the JSON, no other text.`;
    }
    
    parseEvaluationResponse(response) {
        try {
            // Clean the response
            let cleanResponse = response.trim();
            
            // Extract JSON if wrapped in markdown
            const jsonMatch = cleanResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[1];
            }
            
            // Remove any text before { or after }
            const startIndex = cleanResponse.indexOf('{');
            const endIndex = cleanResponse.lastIndexOf('}');
            if (startIndex !== -1 && endIndex !== -1) {
                cleanResponse = cleanResponse.substring(startIndex, endIndex + 1);
            }
            
            const evaluation = JSON.parse(cleanResponse);
            
            // Validate and set defaults
            return {
                score: Math.max(0, Math.min(100, evaluation.score || 70)),
                isCorrect: evaluation.isCorrect !== false && (evaluation.score || 70) >= 60,
                feedback: evaluation.feedback || 'Good effort! Keep studying to improve your understanding.',
                strengths: evaluation.strengths || ['Shows effort in answering'],
                improvements: evaluation.improvements || ['Try to include more specific examples'],
                keywordsCovered: evaluation.keywordsCovered || [],
                missingElements: evaluation.missingElements || []
            };
            
        } catch (error) {
            console.error('❌ Error parsing evaluation response:', error);
            throw new Error('Failed to parse AI evaluation');
        }
    }
    
    getFallbackEvaluation(userAnswer) {
        console.log('🔄 Using fallback evaluation');
        
        if (!userAnswer || userAnswer.length < 10) {
            return {
                score: 20,
                isCorrect: false,
                feedback: 'Please provide a more detailed answer to demonstrate your understanding.',
                strengths: ['Attempted to answer'],
                improvements: ['Provide more detail', 'Include specific examples', 'Explain your reasoning'],
                keywordsCovered: [],
                missingElements: ['Detailed explanation', 'Examples', 'Key concepts']
            };
        }
        
        // Simple scoring based on length and content
        let score = Math.min(100, Math.max(30, userAnswer.length * 0.4));
        
        // Bonus points for detailed answers
        if (userAnswer.length > 150) score += 10;
        if (userAnswer.length > 300) score += 10;
        
        // Check for indicators of good answers
        const hasExamples = /example|instance|such as|for example|like/.test(userAnswer.toLowerCase());
        const hasExplanation = /because|therefore|since|due to|as a result/.test(userAnswer.toLowerCase());
        const hasStructure = userAnswer.split(/[.!?]+/).length > 3;
        
        if (hasExamples) score += 8;
        if (hasExplanation) score += 8;
        if (hasStructure) score += 7;
        
        score = Math.min(90, score); // Cap at 90 for fallback
        
        const isCorrect = score >= 60;
        
        const strengths = [];
        const improvements = [];
        
        if (userAnswer.length > 200) strengths.push('Detailed response');
        if (hasExamples) strengths.push('Includes examples');
        if (hasExplanation) strengths.push('Provides explanations');
        if (hasStructure) strengths.push('Well-structured answer');
        
        if (userAnswer.length < 150) improvements.push('Provide more detail');
        if (!hasExamples) improvements.push('Include specific examples');
        if (!hasExplanation) improvements.push('Explain your reasoning');
        if (!hasStructure) improvements.push('Structure your answer in clear sentences');
        
        if (strengths.length === 0) strengths.push('Shows effort in answering');
        if (improvements.length === 0) improvements.push('Continue to expand your knowledge');
        
        return {
            score: Math.round(score),
            isCorrect,
            feedback: isCorrect ? 
                `Good work! Your answer demonstrates ${strengths.join(' and ')}.${improvements.length > 0 ? ' To improve further: ' + improvements.join(', ') + '.' : ''}` :
                `Keep studying! Focus on: ${improvements.join(', ')}.${strengths.length > 0 ? ' Good job on: ' + strengths.join(', ') + '.' : ''}`,
            strengths,
            improvements,
            keywordsCovered: [],
            missingElements: improvements
        };
    }
    
    // ==========================================================================
    // GROQ API CALL
    // ==========================================================================
    
    async callGroq(prompt) {
        if (!this.groqKey) {
            throw new Error('API key not configured');
        }
        
        console.log('🌐 Making Groq API request...');
        
        const response = await fetch(this.groqURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.groqKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📋 API Response received');
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }
        
        return data.choices[0].message.content.trim();
    }
    
    // For backward compatibility
    async callGemini(prompt) {
        return this.callGroq(prompt);
    }
    
    // ==========================================================================
    // ERROR DIAGNOSIS
    // ==========================================================================
    
    diagnoseError(error) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('401') || msg.includes('unauthorized')) {
            return '🔑 Invalid API key - check your Groq API key in config.js';
        }
        if (msg.includes('429') || msg.includes('quota')) {
            return '📊 API quota exceeded - wait or upgrade your Groq plan';
        }
        if (msg.includes('fetch')) {
            return '🌐 Network error - check internet connection';
        }
        if (msg.includes('cors')) {
            return '🔒 CORS error - try serving from a web server, not file://';
        }
        return '❓ Unknown error - check Groq console for details';
    }
    
    // ==========================================================================
    // LEGACY METHODS (for backward compatibility)
    // ==========================================================================
    
    async generateQuestion(topic, difficulty) {
        if (!this.isEnabled) {
            return `Create a detailed answer explaining what ${topic} is, its key concepts, and real-world applications. Base your answer on the lesson content.`;
        }
        
        try {
            const prompt = `Create a ${difficulty} level essay question about "${topic}" that tests real understanding. Make it thought-provoking and specific to ${topic}.`;
            const response = await this.callGroq(prompt);
            return response.trim();
        } catch (error) {
            return `Explain the key concepts of ${topic} covered in the lesson and provide specific examples of how it's applied in the real world.`;
        }
    }
    
    async evaluateAnswer(question, userAnswer, topic) {
        const score = this.calculateBasicScore(userAnswer);
        return {
            isCorrect: score >= 70,
            score: score,
            feedback: `Score: ${score}/100\n\n${score >= 80 ? '✅ Excellent work!' : score >= 60 ? '👍 Good effort!' : '📚 Keep studying!'}`
        };
    }
    
    async generateHint(question, userAttempt, topic) {
        return `💡 Think about the main concepts from the lesson about ${topic}. What were the key principles and examples discussed?`;
    }
    
    calculateBasicScore(answer) {
        let score = 30;
        if (answer.length > 150) score += 30;
        else if (answer.length > 75) score += 20;
        else if (answer.length > 30) score += 15;
        
        const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 2) score += 20;
        
        if (answer.includes('example')) score += 10;
        return Math.min(score, 95);
    }
}

// ==========================================================================
// INITIALIZE
// ==========================================================================

window.studyBuddyAPI = new StudyBuddyGroqAPI();

window.configureGroqAPI = function(apiKey) {
    window.studyBuddyAPI.setApiKey(apiKey);
};

window.configureGeminiAPI = function(apiKey) {
    window.configureGroqAPI(apiKey);
};

// Global functions
window.getRandomTopic = () => window.studyBuddyAPI.generateRandomTopic();
window.getRandomTopicOptions = (count = 3) => window.studyBuddyAPI.getRandomTopicOptions(count);
window.generateStudyMaterial = (topic, difficulty, description) => window.studyBuddyAPI.generateStudyMaterial(topic, difficulty, description);

console.log('🚀 Study Buddy API with AI Question Generation loaded successfully!');