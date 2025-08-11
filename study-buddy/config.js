window.APP_CONFIG = {
    version: '1.0.0',
    debug: true,
    maxQuestionsPerSession: 12,
    enableAnalytics: false
};

window.configureGroqAPI = function(apiKey) {
    if (window.studyBuddyAPI) {
        window.studyBuddyAPI.setApiKey(apiKey);
        console.log('✅ Groq API configured successfully');
    } else {
        console.error('❌ StudyBuddyAPI not loaded yet');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Config.js loaded - initializing Groq API...');
    
    const GROQ_API_KEY = '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'; 
    
    setTimeout(() => {
        if (window.studyBuddyAPI) {
            window.configureGroqAPI(GROQ_API_KEY);
        } else {
            console.warn('⚠️ StudyBuddyAPI not ready, retrying...');
            setTimeout(() => {
                if (window.studyBuddyAPI) {
                    window.configureGroqAPI(GROQ_API_KEY);
                }
            }, 1000);
        }
    }, 500);
});

console.log('📋 Study Buddy configuration with Groq API loaded successfully');