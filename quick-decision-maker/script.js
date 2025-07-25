// class DecisionMaker {
//     constructor() {
//         this.currentDecision = null;
//         this.decisionHistory = this.loadHistory();
//         this.initializeEventListeners();
//         this.updateHistoryDisplay();
//         this.checkAPIConfiguration();
//     }

//     initializeEventListeners() {
//         // Main analyze button
//         const analyzeBtn = document.getElementById('analyzeBtn');
//         if (analyzeBtn) {
//             analyzeBtn.addEventListener('click', () => {
//                 console.log('Analyze button clicked!');
//                 this.analyzeDecision();
//             });
//         } else {
//             console.error('Analyze button not found!');
//         }

//         // New decision button
//         const newDecisionBtn = document.getElementById('newDecisionBtn');
//         if (newDecisionBtn) {
//             newDecisionBtn.addEventListener('click', () => {
//                 this.resetForm();
//             });
//         }

//         // Save decision button
//         const saveDecisionBtn = document.getElementById('saveDecisionBtn');
//         if (saveDecisionBtn) {
//             saveDecisionBtn.addEventListener('click', () => {
//                 this.saveCurrentDecision();
//             });
//         }

//         // Enter key support for decision input
//         const decisionInput = document.getElementById('decision');
//         if (decisionInput) {
//             decisionInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') {
//                     this.analyzeDecision();
//                 }
//             });
//         }

//         // Auto-resize textareas
//         document.querySelectorAll('textarea').forEach(textarea => {
//             textarea.addEventListener('input', this.autoResize);
//         });
//     }

//     checkAPIConfiguration() {
//         if (!window.CONFIG) {
//             console.error('❌ CONFIG not loaded! Make sure config.js is included.');
//             return false;
//         }
        
//         if (!window.CONFIG.GROQ_API_KEY || window.CONFIG.GROQ_API_KEY === 'ADD_YOUR_API_KEY_HERE') {
//             console.warn('⚠️ Groq API key not configured. Please update config.js with your real API key.');
//             return false;
//         } else {
//             console.log('✅ Groq API configuration detected');
//             return true;
//         }
//     }

//     autoResize(event) {
//         const textarea = event.target;
//         textarea.style.height = 'auto';
//         textarea.style.height = textarea.scrollHeight + 'px';
//     }

//     getFormData() {
//         const decision = document.getElementById('decision').value.trim();
//         const prosText = document.getElementById('pros').value.trim();
//         const consText = document.getElementById('cons').value.trim();

//         const pros = prosText ? prosText.split('\n').filter(item => item.trim()) : [];
//         const cons = consText ? consText.split('\n').filter(item => item.trim()) : [];

//         console.log('Form data:', { decision, pros, cons });
//         return { decision, pros, cons };
//     }

//     validateForm(data) {
//         if (!data.decision) {
//             this.showError('Please enter a decision you need to make.');
//             document.getElementById('decision').focus();
//             return false;
//         }

//         if (data.pros.length === 0 && data.cons.length === 0) {
//             this.showError('Please enter at least one pro or con to analyze.');
//             document.getElementById('pros').focus();
//             return false;
//         }

//         return true;
//     }

//     resetForm() {
//         document.getElementById('decision').value = '';
//         document.getElementById('pros').value = '';
//         document.getElementById('cons').value = '';
//         document.getElementById('resultsContainer').style.display = 'none';
//         document.getElementById('decisionForm').style.display = 'block';
        
//         // Reset textarea heights
//         document.querySelectorAll('textarea').forEach(textarea => {
//             textarea.style.height = 'auto';
//         });
//     }

//     showError(message) {
//         alert(message);
//     }

//     async analyzeDecision() {
//         console.log('🚀 Starting decision analysis...');
        
//         const formData = this.getFormData();
        
//         if (!this.validateForm(formData)) {
//             return;
//         }

//         this.setLoadingState(true);

//         try {
//             // Check if API is configured
//             if (!this.checkAPIConfiguration()) {
//                 throw new Error('API_KEY_NOT_CONFIGURED');
//             }

//             // Use real AI analysis
//             const analysis = await this.analyzeDecisionWithAI(formData);
            
//             this.currentDecision = {
//                 ...formData,
//                 analysis,
//                 timestamp: new Date().toISOString()
//             };

//             this.displayResults(analysis);
            
//         } catch (error) {
//             console.error('Analysis error:', error);
//             this.handleAnalysisError(error);
//         } finally {
//             this.setLoadingState(false);
//         }
//     }

//     async analyzeDecisionWithAI(data) {
//         console.log('🤖 Calling Groq API...');
        
//         const prompt = this.createAnalysisPrompt(data);
    
//         try {
//             const response = await fetch(window.CONFIG.GROQ_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${window.CONFIG.GROQ_API_KEY}`
//                 },
//                 body: JSON.stringify({
//                     decision: data.decision,
//                     pros: data.pros,
//                     cons: data.cons
//                 })
//             });
    
//             console.log('📡 API Response status:', response.status);
    
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 console.error('API Error:', errorData);
//                 throw new Error(`API_ERROR: ${errorData.error?.message || `HTTP ${response.status}`}`);
//             }
    
//             const responseData = await response.json();
//             console.log('✅ API Response received:', responseData);
            
//             // Handle the response from your backend
//             let aiResponse;
//             if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
//                 // Direct Groq API response format
//                 aiResponse = responseData.choices[0].message.content;
//             } else if (typeof responseData === 'string') {
//                 // String response
//                 aiResponse = responseData;
//             } else if (responseData.response) {
//                 // Backend wrapped response
//                 aiResponse = responseData.response;
//             } else {
//                 // Fallback - use the whole response as text
//                 aiResponse = JSON.stringify(responseData);
//             }
            
//             console.log('🧠 AI Response:', aiResponse);
    
//             return this.parseAIResponse(aiResponse);
    
//         } catch (error) {
//             console.error('🚨 Fetch error:', error);
//             if (error.name === 'TypeError' && error.message.includes('fetch')) {
//                 throw new Error('NETWORK_ERROR');
//             }
//             throw error;
//         }
//     }

//     createAnalysisPrompt(data) {
//         let prompt = `Please analyze this decision: "${data.decision}"\n\n`;
        
//         if (data.pros.length > 0) {
//             prompt += `POSITIVE FACTORS:\n`;
//             data.pros.forEach(pro => prompt += `• ${pro}\n`);
//             prompt += `\n`;
//         }
        
//         if (data.cons.length > 0) {
//             prompt += `CONCERNS/NEGATIVES:\n`;
//             data.cons.forEach(con => prompt += `• ${con}\n`);
//             prompt += `\n`;
//         }

//         prompt += `Please provide:
// 1. A clear recommendation (PROCEED, DO NOT PROCEED, or NEUTRAL)
// 2. Confidence percentage (0-100%)
// 3. Detailed reasoning for your recommendation
// 4. Key factors that influenced your analysis
// 5. Any additional considerations or suggestions

// Please structure your response clearly with your recommendation and confidence level at the beginning.`;

//         return prompt;
//     }

//     parseAIResponse(aiResponse) {
//         try {
//             // Extract confidence percentage
//             const confidenceMatches = aiResponse.match(/(\d+)%/g);
//             let confidence = 50; // default
            
//             if (confidenceMatches && confidenceMatches.length > 0) {
//                 confidence = parseInt(confidenceMatches[0].replace('%', ''));
//                 confidence = Math.max(0, Math.min(100, confidence));
//             }

//             // Extract recommendation
//             let recommendation = "NEUTRAL";
//             const upperResponse = aiResponse.toUpperCase();
            
//             if (upperResponse.includes("DO NOT PROCEED") || upperResponse.includes("DON'T PROCEED")) {
//                 recommendation = "DO NOT PROCEED";
//             } else if (upperResponse.includes("PROCEED")) {
//                 recommendation = "PROCEED";
//             } else if (upperResponse.includes("NEUTRAL") || upperResponse.includes("UNDECIDED")) {
//                 recommendation = "NEUTRAL";
//             }

//             let reasoning = aiResponse.trim();
//             reasoning = reasoning.replace(/^(RECOMMENDATION|CONFIDENCE|ANALYSIS):\s*/gim, '');
            
//             return {
//                 confidence,
//                 recommendation,
//                 reasoning
//             };

//         } catch (error) {
//             console.error('Error parsing AI response:', error);
//             return {
//                 confidence: 50,
//                 recommendation: "NEUTRAL",
//                 reasoning: aiResponse || "Unable to analyze the decision at this time. Please try again."
//             };
//         }
//     }

//     handleAnalysisError(error) {
//         let errorMessage = 'Sorry, there was an error analyzing your decision.';
//         let suggestion = 'Please try again in a moment.';
        
//         if (error.message.includes('API_KEY_NOT_CONFIGURED')) {
//             errorMessage = 'API Configuration Required';
//             suggestion = 'Please add your Groq API key to config.js file. Visit console.groq.com to get your free API key.';
//         } else if (error.message.includes('API_ERROR')) {
//             errorMessage = 'API Service Error';
//             suggestion = 'The AI service is temporarily unavailable. Please try again in a few moments.';
//         } else if (error.message.includes('NETWORK_ERROR')) {
//             errorMessage = 'Network Connection Error';
//             suggestion = 'Please check your internet connection and try again.';
//         } else if (error.message.includes('rate limit')) {
//             errorMessage = 'Rate Limit Exceeded';
//             suggestion = 'Please wait a moment before making another request.';
//         }
        
//         alert(`${errorMessage}\n\n${suggestion}`);
//     }

//     setLoadingState(isLoading) {
//         const btn = document.getElementById('analyzeBtn');
//         const btnText = document.getElementById('btnText');
//         const spinner = document.getElementById('loadingSpinner');

//         if (isLoading) {
//             btn.disabled = true;
//             btnText.style.display = 'none';
//             spinner.style.display = 'inline';
//             spinner.textContent = '🤔';
//         } else {
//             btn.disabled = false;
//             btnText.style.display = 'inline';
//             spinner.style.display = 'none';
//         }
//     }

//     displayResults(analysis) {
//         console.log('📊 Displaying results:', analysis);
        
//         const confidenceElement = document.getElementById('confidenceScore');
//         if (confidenceElement) {
//             confidenceElement.textContent = `${analysis.confidence}%`;
            
//             if (analysis.confidence >= 75) {
//                 confidenceElement.style.background = '#28a745';
//             } else if (analysis.confidence >= 50) {
//                 confidenceElement.style.background = '#ffc107';
//             } else {
//                 confidenceElement.style.background = '#dc3545';
//             }
//         }
        
//         const recommendationText = this.formatRecommendation(analysis);
//         const recommendationElement = document.getElementById('recommendationText');
//         if (recommendationElement) {
//             recommendationElement.innerHTML = recommendationText;
//         }
        
//         const reasoningElement = document.getElementById('reasoningText');
//         if (reasoningElement) {
//             reasoningElement.innerHTML = this.formatReasoning(analysis.reasoning);
//         }
        
//         document.getElementById('resultsContainer').style.display = 'block';
//         document.getElementById('decisionForm').style.display = 'none';
        
//         setTimeout(() => {
//             document.getElementById('resultsContainer').scrollIntoView({ 
//                 behavior: 'smooth', 
//                 block: 'start' 
//             });
//         }, 100);
//     }

//     formatRecommendation(analysis) {
//         const icons = {
//             'PROCEED': '✅',
//             'DO NOT PROCEED': '❌',
//             'NEUTRAL': '🤔'
//         };
        
//         const icon = icons[analysis.recommendation] || '🤔';
//         const confidence = analysis.confidence;
        
//         return `<strong>${icon} ${confidence}% Confidence: ${analysis.recommendation}</strong>`;
//     }

//     formatReasoning(reasoning) {
//         const paragraphs = reasoning.split('\n\n').filter(p => p.trim());
        
//         let html = `<div class="reasoning-basic-section">
//             <h4><span class="section-icon">🧠</span>AI Analysis</h4>
//             <div class="basic-reasoning-content">`;
        
//         paragraphs.forEach((paragraph, index) => {
//             const cleanParagraph = paragraph
//                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                 .replace(/\n/g, '<br>');
            
//             html += `<div class="reasoning-paragraph" style="animation-delay: ${index * 0.2}s">
//                     ${cleanParagraph}
//                 </div>`;
//         });
        
//         html += `</div></div>`;
//         return html;
//     }

//     saveCurrentDecision() {
//         if (!this.currentDecision) {
//             alert('No decision to save.');
//             return;
//         }

//         const existingIndex = this.decisionHistory.findIndex(
//             d => d.decision === this.currentDecision.decision && 
//                  d.timestamp === this.currentDecision.timestamp
//         );

//         if (existingIndex === -1) {
//             this.decisionHistory.unshift(this.currentDecision);
            
//             if (this.decisionHistory.length > 20) {
//                 this.decisionHistory = this.decisionHistory.slice(0, 20);
//             }

//             this.saveHistory();
//             this.updateHistoryDisplay();
            
//             alert('✅ Decision saved to history!');
//         } else {
//             alert('This decision is already saved in your history.');
//         }
//     }

//     loadHistory() {
//         try {
//             const saved = localStorage.getItem('quickDecisionMakerHistory');
//             const history = saved ? JSON.parse(saved) : [];
            
//             return history.filter(decision => 
//                 decision && 
//                 decision.decision && 
//                 decision.analysis && 
//                 decision.timestamp
//             );
//         } catch (error) {
//             console.error('Error loading decision history:', error);
//             return [];
//         }
//     }

//     saveHistory() {
//         try {
//             localStorage.setItem('quickDecisionMakerHistory', JSON.stringify(this.decisionHistory));
//         } catch (error) {
//             console.error('Error saving decision history:', error);
//             alert('Unable to save decision history. Your browser storage might be full.');
//         }
//     }

//     updateHistoryDisplay() {
//         const historyContainer = document.getElementById('historyContainer');
//         const historyList = document.getElementById('historyList');

//         if (!historyContainer || !historyList) {
//             return;
//         }

//         if (this.decisionHistory.length === 0) {
//             historyContainer.style.display = 'none';
//             return;
//         }

//         historyContainer.style.display = 'block';
//         historyList.innerHTML = '';

//         this.decisionHistory.forEach((decision, index) => {
//             const item = this.createHistoryItem(decision, index);
//             historyList.appendChild(item);
//         });
//     }

//     createHistoryItem(decision, index) {
//         const item = document.createElement('div');
//         item.className = 'history-item';
        
//         const date = new Date(decision.timestamp).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
        
//         const preview = `${decision.analysis.confidence}% confidence - ${decision.analysis.recommendation}`;
        
//         item.innerHTML = `
//             <div class="history-item-title">${this.escapeHtml(decision.decision)}</div>
//             <div class="history-item-date">${date}</div>
//             <div class="history-item-preview">${this.escapeHtml(preview)}</div>
//         `;

//         item.addEventListener('click', () => {
//             this.loadDecisionFromHistory(decision);
//         });

//         return item;
//     }

//     loadDecisionFromHistory(decision) {
//         document.getElementById('decision').value = decision.decision;
//         document.getElementById('pros').value = decision.pros.join('\n');
//         document.getElementById('cons').value = decision.cons.join('\n');
        
//         this.currentDecision = decision;
//         this.displayResults(decision.analysis);
//     }

//     escapeHtml(text) {
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML;
//     }
// }

// // Initialize when DOM is ready
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('🚀 DOM Content Loaded - Initializing Decision Maker...');
    
//     const requiredElements = ['analyzeBtn', 'decision', 'pros', 'cons', 'resultsContainer'];
//     const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
//     if (missingElements.length > 0) {
//         console.error('❌ Missing required elements:', missingElements);
//         alert('Error: Some required HTML elements are missing. Please check the HTML file.');
//         return;
//     }

//     setTimeout(() => {
//         try {
//             window.decisionMaker = new DecisionMaker();
//             console.log('✅ Quick Decision Maker initialized successfully!');
//         } catch (error) {
//             console.error('❌ Error initializing Decision Maker:', error);
//             alert('Error initializing the application. Please check the console for details.');
//         }
//     }, 200);
// });

// window.addEventListener('error', (event) => {
//     console.error('🚨 Global error:', event.error);
// });

// window.addEventListener('unhandledrejection', (event) => {
//     console.error('🚨 Unhandled promise rejection:', event.reason);
// });

class DecisionMaker {
    constructor() {
        this.currentDecision = null;
        this.decisionHistory = this.loadHistory();
        this.initializeEventListeners();
        this.updateHistoryDisplay();
    }

    initializeEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeDecision();
        });

        document.getElementById('newDecisionBtn').addEventListener('click', () => {
            this.resetForm();
        });

        document.getElementById('saveDecisionBtn').addEventListener('click', () => {
            this.saveCurrentDecision();
        });

        document.getElementById('decision').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeDecision();
            }
        });
    }

    async analyzeDecision() {
        const decision = document.getElementById('decision').value.trim();
        const pros = document.getElementById('pros').value.trim().split('\n').filter(Boolean);
        const cons = document.getElementById('cons').value.trim().split('\n').filter(Boolean);

        if (!decision || pros.length === 0 || cons.length === 0) {
            alert('Please enter a decision, at least one pro, and one con.');
            return;
        }

        this.toggleLoading(true);

        try {
            console.log('📤 Sending request:', { decision, pros, cons });
            
            const response = await fetch('http://localhost:5050/analyze', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ decision, pros, cons })
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error:', errorText);
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ API Response:', result);
            
            // Pass the entire result object
            this.currentDecision = { decision, pros, cons, result: result };
            this.displayResult(result);
            
        } catch (error) {
            console.error('❌ API call failed:', error);
            
            // More helpful error messages
            if (error.message.includes('Failed to fetch')) {
                alert('Cannot connect to server. Make sure your backend is running on port 5050.');
            } else {
                alert(`API call failed: ${error.message}\nCheck the console for details.`);
            }
        } finally {
            this.toggleLoading(false);
        }
    }

    displayResult(result) {
        console.log("🧠 AI Response:", result);
        
        // Extract the nested data if it exists
        const data = result.basic_output || result;
        
        // Show results container
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
        
        // Update recommendation badge
        const recommendationBadge = document.getElementById('recommendationBadge');
        const recommendationIcon = document.getElementById('recommendationIcon');
        const recommendationTextNew = document.getElementById('recommendationTextNew');
        
        if (recommendationTextNew && recommendationIcon) {
            const recommendation = (data.recommendation || 'WAIT').toUpperCase();
            recommendationTextNew.textContent = recommendation;
            
            // Update icon and badge color based on recommendation
            if (recommendation === 'PROCEED') {
                recommendationIcon.textContent = '✅';
                recommendationBadge.className = 'recommendation-badge proceed';
            } else if (recommendation === 'AVOID') {
                recommendationIcon.textContent = '❌';
                recommendationBadge.className = 'recommendation-badge avoid';
            } else {
                recommendationIcon.textContent = '⏸️';
                recommendationBadge.className = 'recommendation-badge wait';
            }
        }
        
        // Update confidence circle
        const confidenceNumber = document.getElementById('confidenceNumber');
        const progressRingFill = document.getElementById('progressRingFill');
        const confidence = data.confidence_percentage || 0;
        
        if (confidenceNumber) {
            confidenceNumber.textContent = `${confidence}%`;
        }
        
        if (progressRingFill) {
            // Update progress circle (assuming circumference of ~188.5 for r=30)
            const circumference = 2 * Math.PI * 30;
            const offset = circumference - (confidence / 100) * circumference;
            progressRingFill.style.strokeDasharray = `${circumference} ${circumference}`;
            progressRingFill.style.strokeDashoffset = offset;
        }
        
        // Update reasoning text
        const reasoningText = document.getElementById('reasoningText');
        if (reasoningText) {
            reasoningText.innerHTML = `<p>${data.reasoning || 'No detailed reasoning available.'}</p>`;
        }
        
        // Update key factors list
        const keyFactorsList = document.getElementById('keyFactorsList');
        if (keyFactorsList) {
            keyFactorsList.innerHTML = '';
            const factors = data.key_factors || [];
            if (factors.length > 0) {
                factors.forEach(factor => {
                    const li = document.createElement('li');
                    li.textContent = factor;
                    keyFactorsList.appendChild(li);
                });
            } else {
                keyFactorsList.innerHTML = '<li>No key factors identified</li>';
            }
        }
        
        // Update additional suggestions
        const extraAdvice = document.getElementById('extraAdvice');
        if (extraAdvice) {
            const suggestions = data.suggestions || [];
            if (suggestions.length > 0) {
                extraAdvice.innerHTML = '<ul>' + 
                    suggestions.map(s => `<li>${s}</li>`).join('') + 
                    '</ul>';
            } else {
                extraAdvice.innerHTML = '<p>No additional suggestions at this time.</p>';
            }
        }
    }

    updateConfidenceCircle(percentage) {
        // Implementation for updating the confidence circle
        // This depends on your specific circle implementation
        const circle = document.querySelector('.confidence-circle');
        if (circle) {
            circle.textContent = `${percentage}%`;
            // You might have additional logic here for styling based on percentage
        }
    }

    toggleLoading(isLoading) {
        document.getElementById('btnText').style.display = isLoading ? 'none' : 'inline';
        document.getElementById('loadingSpinner').style.display = isLoading ? 'inline' : 'none';
    }

    resetForm() {
        document.getElementById('decision').value = '';
        document.getElementById('pros').value = '';
        document.getElementById('cons').value = '';
        document.getElementById('resultsContainer').style.display = 'none';
        this.currentDecision = null;
    }

    saveCurrentDecision() {
        if (this.currentDecision) {
            this.decisionHistory.push(this.currentDecision);
            this.saveHistory();
            this.updateHistoryDisplay();
            alert('Decision saved to history!');
        }
    }

    saveHistory() {
        localStorage.setItem('decisionHistory', JSON.stringify(this.decisionHistory));
    }

    loadHistory() {
        const history = localStorage.getItem('decisionHistory');
        return history ? JSON.parse(history) : [];
    }

    updateHistoryDisplay() {
        const container = document.getElementById('historyContainer');
        const list = document.getElementById('historyList');
        
        if (!list) return;
        
        list.innerHTML = '';

        if (this.decisionHistory.length > 0) {
            container.style.display = 'block';
            this.decisionHistory.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'history-item';
                // Access the nested data structure correctly
                const data = entry.result.basic_output || entry.result;
                item.innerHTML = `
                    <strong>Decision:</strong> ${entry.decision}<br>
                    <strong>Recommendation:</strong> ${data.recommendation || 'N/A'}<br>
                    <strong>Confidence:</strong> ${data.confidence_percentage || 0}%<br>
                    <button onclick="window.decisionMaker.removeFromHistory(${index})">Remove</button>
                    <hr>`;
                list.appendChild(item);
            });
        } else {
            container.style.display = 'none';
        }
    }

    removeFromHistory(index) {
        if (confirm('Remove this decision from history?')) {
            this.decisionHistory.splice(index, 1);
            this.saveHistory();
            this.updateHistoryDisplay();
        }
    }
}

// Initialize globally for debugging
window.addEventListener('DOMContentLoaded', () => {
    window.decisionMaker = new DecisionMaker();
});