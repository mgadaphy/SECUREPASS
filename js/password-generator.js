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
    lengthSlider.addEventListener('input', debounce(updateLengthDisplay, 100));
    clearHistoryBtn.addEventListener('click', clearHistory);
    advancedToggle.addEventListener('click', toggleAdvancedOptions);
    themeToggle.addEventListener('click', toggleTheme);
    addWordBtn.addEventListener('click', addWord);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addWord();
        }
    });

    // Event delegation for word tags and history items
    wordTags.addEventListener('click', (e) => {
        if (e.target.closest('.tag-remove')) {
            const word = e.target.closest('.tag').dataset.word;
            removeWord(word);
        }
    });

    historyList.addEventListener('click', (e) => {
        if (e.target.closest('.history-copy')) {
            const index = e.target.closest('.history-item').dataset.index;
            copyHistoryItem(index);
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

    // Validate at least one character type is selected
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        showToast('Please select at least one character type', 'error');
        return;
    }

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

    // Calculate how many random characters we need
    const totalWordLength = words.join('').length;
    const randomCharsNeeded = Math.max(0, length - totalWordLength);

    // Generate random characters
    let randomChars = '';
    if (randomCharsNeeded > 0) {
        randomChars = generateRandomPassword(randomCharsNeeded, options);
    }

    // Combine words and random characters
    let password = words.join('');
    
    // Insert random characters at random positions
    if (randomChars) {
        const positions = [];
        for (let i = 0; i < randomChars.length; i++) {
            positions.push(Math.floor(Math.random() * (password.length + 1)));
        }
        positions.sort((a, b) => a - b);
        
        for (let i = 0; i < positions.length; i++) {
            password = password.slice(0, positions[i]) + randomChars[i] + password.slice(positions[i]);
        }
    }

    // Ensure password meets requirements
    if (options.numbers && !/\d/.test(password)) {
        const randomNum = charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
        const pos = Math.floor(Math.random() * password.length);
        password = password.slice(0, pos) + randomNum + password.slice(pos + 1);
    }

    if (options.symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        const randomSym = charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
        const pos = Math.floor(Math.random() * password.length);
        password = password.slice(0, pos) + randomSym + password.slice(pos + 1);
    }

    // Trim to exact length if needed
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
    if (!window.zxcvbn) {
        console.error('zxcvbn library not loaded');
        return;
    }

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
    if (!password) {
        showToast('No password to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => {
            showToast('Password copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy password:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Password copied to clipboard!', 'success');
            } catch (err) {
                showToast('Failed to copy password', 'error');
            }
            document.body.removeChild(textArea);
        });
}

function showToast(message, type = 'success') {
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    
    // Remove existing toast classes
    toast.classList.remove('toast-success', 'toast-error', 'toast-info');
    // Add new toast class
    toast.classList.add(`toast-${type}`);
    
    toast.classList.remove('translate-y-10', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

function addToHistory(password) {
    try {
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
    } catch (error) {
        console.error('Error saving to history:', error);
        showToast('Failed to save password to history', 'error');
    }
}

function updateHistoryDisplay() {
    try {
        const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No passwords generated yet</p>';
            return;
        }

        historyList.innerHTML = history.map((item, index) => `
            <div class="history-item flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg" data-index="${index}">
                <div class="flex-1">
                    <div class="font-mono">${item.password}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        ${new Date(item.timestamp).toLocaleString()}
                    </div>
                </div>
                <button class="history-copy opacity-0 p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" 
                        aria-label="Copy password">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating history display:', error);
        showToast('Failed to load password history', 'error');
    }
}

function copyHistoryItem(index) {
    try {
        const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        const password = history[index].password;
        navigator.clipboard.writeText(password)
            .then(() => {
                showToast('Password copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy password:', err);
                showToast('Failed to copy password', 'error');
            });
    } catch (error) {
        console.error('Error copying history item:', error);
        showToast('Failed to copy password', 'error');
    }
}

function clearHistory() {
    try {
        localStorage.removeItem('passwordHistory');
        updateHistoryDisplay();
        showToast('History cleared', 'info');
    } catch (error) {
        console.error('Error clearing history:', error);
        showToast('Failed to clear history', 'error');
    }
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
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    // Check if theme preference is already saved
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('Theme Detection:', {
        savedTheme,
        prefersDark,
        systemTheme: prefersDark ? 'dark' : 'light'
    });
    
    // If no saved preference, detect system theme
    if (!savedTheme) {
        if (prefersDark) {
            console.log('Setting dark theme based on system preference');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            console.log('Setting light theme based on system preference');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    } else {
        // Apply saved preference
        if (savedTheme === 'dark') {
            console.log('Setting dark theme based on saved preference');
            document.documentElement.classList.add('dark');
        } else {
            console.log('Setting light theme based on saved preference');
            document.documentElement.classList.remove('dark');
        }
    }
}

// Add listener for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    console.log('System theme changed:', e.matches ? 'dark' : 'light');
    // Only update if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
});

function addWord() {
    const word = wordInput.value.trim();
    
    // Validate word
    if (!word) {
        showToast('Please enter a word', 'error');
        return;
    }
    
    if (word.length > 15) {
        showToast('Word is too long (max 15 characters)', 'error');
        return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(word)) {
        showToast('Word can only contain letters and numbers', 'error');
        return;
    }
    
    if (wordList.includes(word)) {
        showToast('Word already added', 'error');
        return;
    }
    
    wordList.push(word);
    updateWordTags();
    wordInput.value = '';
    showToast('Word added successfully', 'success');
}

function removeWord(word) {
    wordList = wordList.filter(w => w !== word);
    updateWordTags();
    showToast('Word removed', 'info');
}

function updateWordTags() {
    wordTags.innerHTML = wordList.map(word => `
        <div class="tag" data-word="${word}">
            ${word}
            <span class="tag-remove" aria-label="Remove word">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `).join('');
} 