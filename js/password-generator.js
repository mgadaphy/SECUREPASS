// DOM Elements
const passwordOutput = document.getElementById('password-output');
const generateBtn = document.getElementById('generate-password');
const copyBtn = document.getElementById('copy-password');
const lengthSlider = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const excludeAmbiguous = document.getElementById('exclude-ambiguous');
const excludeSimilar = document.getElementById('exclude-similar');
const strengthMeter = document.getElementById('strength-meter');
const strengthText = document.getElementById('strength-text');
const strengthLabel = document.getElementById('strength-label');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const advancedToggle = document.getElementById('advanced-toggle');
const advancedOptions = document.getElementById('advanced-options');
const themeToggle = document.getElementById('theme-toggle');
const toast = document.getElementById('toast');
const wordInput = document.getElementById('word-input');
const addWordBtn = document.getElementById('add-word');
const wordTags = document.getElementById('word-tags');
const mixWordsCheckbox = document.getElementById('mix-words');
const randomizeWordOrderCheckbox = document.getElementById('randomize-word-order');
const capitalizeWordsCheckbox = document.getElementById('capitalize-words');

// Character sets
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Ambiguous characters to exclude
const ambiguousChars = 'l1I0O';
const similarChars = 'ijlo01';

// Store words for password generation
let wordList = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    updateLengthDisplay();
    setupEventListeners();
    loadTheme();
});

function setupEventListeners() {
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);
    lengthSlider.addEventListener('input', updateLengthDisplay);
    clearHistoryBtn.addEventListener('click', clearHistory);
    advancedToggle.addEventListener('click', toggleAdvancedOptions);
    themeToggle.addEventListener('click', toggleTheme);
    addWordBtn.addEventListener('click', addWord);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addWord();
        }
    });
}

function updateLengthDisplay() {
    lengthValue.textContent = lengthSlider.value;
}

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const options = {
        uppercase: uppercaseCheckbox.checked,
        lowercase: lowercaseCheckbox.checked,
        numbers: numbersCheckbox.checked,
        symbols: symbolsCheckbox.checked,
        excludeAmbiguous: excludeAmbiguous.checked,
        excludeSimilar: excludeSimilar.checked,
        mixWords: mixWordsCheckbox.checked,
        randomizeWordOrder: randomizeWordOrderCheckbox.checked,
        capitalizeWords: capitalizeWordsCheckbox.checked
    };

    let password = '';
    
    if (options.mixWords && wordList.length > 0) {
        password = generateWordBasedPassword(length, options);
    } else {
        password = generateRandomPassword(length, options);
    }

    passwordOutput.value = password;
    updateStrengthMeter(password);
    addToHistory(password);
}

function generateRandomPassword(length, options) {
    let chars = '';
    if (options.uppercase) chars += charSets.uppercase;
    if (options.lowercase) chars += charSets.lowercase;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;

    if (options.excludeAmbiguous) {
        chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('');
    }
    if (options.excludeSimilar) {
        chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function generateWordBasedPassword(length, options) {
    let words = [...wordList];
    if (options.randomizeWordOrder) {
        words = shuffleArray(words);
    }
    
    if (options.capitalizeWords) {
        words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    }

    let password = words.join('');
    
    // Add random characters if needed to reach desired length
    while (password.length < length) {
        password += generateRandomPassword(1, options);
    }

    // Trim to exact length if too long
    if (password.length > length) {
        password = password.slice(0, length);
    }

    return password;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateStrengthMeter(password) {
    const result = zxcvbn(password);
    const strength = result.score;
    const feedback = result.feedback.warning || result.feedback.suggestions[0] || '';

    strengthMeter.className = `h-2.5 rounded-full password-strength-${strength}`;
    strengthMeter.style.width = `${(strength + 1) * 20}%`;

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    strengthText.textContent = strengthLabels[strength];
    strengthLabel.textContent = feedback ? `Password Strength (${feedback})` : 'Password Strength:';
}

function copyToClipboard() {
    const password = passwordOutput.value;
    if (!password) return;

    navigator.clipboard.writeText(password).then(() => {
        showToast('Password copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy password');
        console.error('Failed to copy password:', err);
    });
}

function showToast(message) {
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-10', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

function addToHistory(password) {
    const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
    history.unshift({
        password,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 passwords
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('passwordHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No passwords generated yet</p>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
            <div class="flex-1">
                <div class="font-mono">${item.password}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    ${new Date(item.timestamp).toLocaleString()}
                </div>
            </div>
            <button class="history-copy opacity-0 p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" 
                    onclick="copyHistoryItem(${index})">
                <i class="far fa-copy"></i>
            </button>
        </div>
    `).join('');
}

function copyHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
    const password = history[index].password;
    navigator.clipboard.writeText(password).then(() => {
        showToast('Password copied to clipboard!');
    });
}

function clearHistory() {
    localStorage.removeItem('passwordHistory');
    updateHistoryDisplay();
}

function loadHistory() {
    updateHistoryDisplay();
}

function toggleAdvancedOptions() {
    advancedOptions.classList.toggle('hidden');
    const icon = advancedToggle.querySelector('i');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
}

function addWord() {
    const word = wordInput.value.trim();
    if (word && !wordList.includes(word)) {
        wordList.push(word);
        updateWordTags();
        wordInput.value = '';
    }
}

function removeWord(word) {
    wordList = wordList.filter(w => w !== word);
    updateWordTags();
}

function updateWordTags() {
    wordTags.innerHTML = wordList.map(word => `
        <div class="tag">
            ${word}
            <span class="tag-remove" onclick="removeWord('${word}')">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `).join('');
} 