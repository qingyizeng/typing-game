// 游戏状态管理
class TypingGame {
    constructor() {
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.timer = null;
        this.timeLimit = 60;
        this.remainingTime = 60;
        this.correctChars = 0;
        this.totalChars = 0;
        this.errors = 0;
        this.wpm = 0;
        this.accuracy = 100;
        
        // 游戏设置
        this.settings = {
            mode: 'words',
            difficulty: 'medium',
            timeLimit: 60,
            theme: 'ocean'
        };
        
        // 文本数据
        this.textData = {
            words: {
                easy: ['cat', 'dog', 'sun', 'moon', 'tree', 'book', 'car', 'home', 'love', 'time', 'water', 'light', 'music', 'happy', 'smile'],
                medium: ['computer', 'keyboard', 'practice', 'typing', 'exercise', 'challenge', 'improve', 'accuracy', 'speed', 'focus', 'concentration', 'development'],
                hard: ['programming', 'algorithm', 'implementation', 'optimization', 'architecture', 'methodology', 'sophisticated', 'comprehensive', 'extraordinary'],
                expert: ['pseudocode', 'polymorphism', 'encapsulation', 'inheritance', 'abstraction', 'instantiation', 'serialization', 'deserialization', 'synchronization']
            },
            sentences: {
                easy: [
                    'The quick brown fox jumps over the lazy dog.',
                    'A journey of a thousand miles begins with a single step.',
                    'Practice makes perfect in everything we do.',
                    'The early bird catches the worm every morning.'
                ],
                medium: [
                    'Technology has revolutionized the way we communicate and work.',
                    'Learning to type efficiently can significantly improve your productivity.',
                    'Regular practice and patience are key to mastering any skill.',
                    'The digital age requires us to adapt and learn new technologies.'
                ],
                hard: [
                    'Artificial intelligence and machine learning are transforming industries across the globe.',
                    'The complexity of modern software development requires continuous learning and adaptation.',
                    'Cybersecurity has become increasingly important in our interconnected digital world.'
                ],
                expert: [
                    'Quantum computing represents a paradigm shift in computational capabilities and cryptographic security.',
                    'The intersection of biotechnology and artificial intelligence promises revolutionary advances in healthcare.',
                    'Distributed systems architecture requires careful consideration of consistency, availability, and partition tolerance.'
                ]
            },
            paragraphs: {
                easy: [
                    'Once upon a time, in a small village, there lived a young girl who loved to read books. Every day, she would visit the local library and spend hours reading stories about far-away places and magical adventures. Her favorite books were about brave heroes who helped others and made the world a better place.'
                ],
                medium: [
                    'The art of programming is not just about writing code; it is about solving problems and creating solutions that make life easier. Good programmers think logically, break down complex problems into smaller parts, and write clean, efficient code that others can understand and maintain. They also test their code thoroughly to ensure it works correctly in all situations.'
                ],
                hard: [
                    'In the rapidly evolving landscape of technology, artificial intelligence has emerged as one of the most transformative forces of our time. From autonomous vehicles to medical diagnosis, AI systems are being deployed across various industries to augment human capabilities and solve complex problems that were previously thought to be intractable.'
                ],
                expert: [
                    'The theoretical foundations of computer science rest upon mathematical principles that govern computation, complexity, and algorithmic efficiency. Understanding these principles requires a deep appreciation for discrete mathematics, formal logic, and abstract reasoning. Modern computational theory encompasses areas such as computational complexity theory, which classifies problems according to their inherent difficulty, and algorithmic information theory, which studies the relationship between computation and information.'
                ]
            },
            code: {
                easy: [
                    'function hello() {\n    console.log("Hello World!");\n}',
                    'let x = 10;\nlet y = 20;\nlet sum = x + y;',
                    'if (condition) {\n    return true;\n} else {\n    return false;\n}'
                ],
                medium: [
                    'class Calculator {\n    constructor() {\n        this.result = 0;\n    }\n    \n    add(num) {\n        this.result += num;\n        return this;\n    }\n}',
                    'const fetchData = async (url) => {\n    try {\n        const response = await fetch(url);\n        return await response.json();\n    } catch (error) {\n        console.error(error);\n    }\n};'
                ],
                hard: [
                    'function quickSort(arr, low = 0, high = arr.length - 1) {\n    if (low < high) {\n        const pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n    return arr;\n}',
                    'const memoize = (fn) => {\n    const cache = new Map();\n    return (...args) => {\n        const key = JSON.stringify(args);\n        if (cache.has(key)) {\n            return cache.get(key);\n        }\n        const result = fn.apply(this, args);\n        cache.set(key, result);\n        return result;\n    };\n};'
                ],
                expert: [
                    'class RedBlackTree {\n    constructor() {\n        this.NIL = { color: "BLACK", left: null, right: null, parent: null };\n        this.root = this.NIL;\n    }\n    \n    insert(key) {\n        const node = { key, color: "RED", left: this.NIL, right: this.NIL, parent: this.NIL };\n        this.bstInsert(node);\n        this.insertFixup(node);\n    }\n}'
                ]
            }
        };
        
        this.initializeElements();
        this.bindEvents();
        this.applyTheme();
    }
    
    initializeElements() {
        // 获取DOM元素
        this.elements = {
            settingsPanel: document.getElementById('settingsPanel'),
            gameInterface: document.getElementById('gameInterface'),
            resultsPanel: document.getElementById('resultsPanel'),
            
            // 设置元素
            gameMode: document.getElementById('gameMode'),
            difficulty: document.getElementById('difficulty'),
            timeLimit: document.getElementById('timeLimit'),
            theme: document.getElementById('theme'),
            startBtn: document.getElementById('startBtn'),
            
            // 游戏元素
            textContent: document.getElementById('textContent'),
            textInput: document.getElementById('textInput'),
            inputFeedback: document.getElementById('inputFeedback'),
            
            // 统计元素
            wpm: document.getElementById('wpm'),
            accuracy: document.getElementById('accuracy'),
            timer: document.getElementById('timer'),
            progress: document.getElementById('progress'),
            
            // 控制按钮
            pauseBtn: document.getElementById('pauseBtn'),
            restartBtn: document.getElementById('restartBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            
            // 结果元素
            finalWpm: document.getElementById('finalWpm'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            finalTime: document.getElementById('finalTime'),
            finalRating: document.getElementById('finalRating'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            newGameBtn: document.getElementById('newGameBtn')
        };
    }
    
    bindEvents() {
        // 设置面板事件
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.gameMode.addEventListener('change', (e) => this.settings.mode = e.target.value);
        this.elements.difficulty.addEventListener('change', (e) => this.settings.difficulty = e.target.value);
        this.elements.timeLimit.addEventListener('change', (e) => {
            this.settings.timeLimit = parseInt(e.target.value);
            this.timeLimit = this.settings.timeLimit;
        });
        this.elements.theme.addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme();
        });
        
        // 游戏控制事件
        this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        
        // 输入事件
        this.elements.textInput.addEventListener('input', (e) => this.handleInput(e));
        this.elements.textInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // 结果面板事件
        this.elements.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.elements.newGameBtn.addEventListener('click', () => this.newGame());
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
    }
    
    applyTheme() {
        document.body.className = `theme-${this.settings.theme}`;
    }
    
    startGame() {
        this.gameState = 'playing';
        this.generateText();
        this.resetStats();
        this.showGameInterface();
        this.elements.textInput.focus();
        
        if (this.settings.timeLimit > 0) {
            this.startTimer();
        }
        
        this.createParticleEffect(this.elements.startBtn);
    }
    
    generateText() {
        const { mode, difficulty } = this.settings;
        const textArray = this.textData[mode][difficulty];
        
        if (mode === 'words') {
            // 生成随机单词序列
            const wordCount = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;
            const words = [];
            for (let i = 0; i < wordCount; i++) {
                const randomWord = textArray[Math.floor(Math.random() * textArray.length)];
                words.push(randomWord);
            }
            this.currentText = words.join(' ');
        } else {
            // 选择随机句子、段落或代码
            this.currentText = textArray[Math.floor(Math.random() * textArray.length)];
        }
        
        this.displayText();
    }
    
    displayText() {
        const textElement = this.elements.textContent;
        textElement.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const char = document.createElement('span');
            char.textContent = this.currentText[i];
            char.className = 'char';
            if (i === 0) char.classList.add('current');
            textElement.appendChild(char);
        }
        
        this.currentIndex = 0;
    }
    
    handleInput(e) {
        if (this.gameState !== 'playing') return;
        
        const inputValue = e.target.value;
        const currentChar = this.currentText[this.currentIndex];
        const lastInputChar = inputValue[inputValue.length - 1];
        
        if (!this.startTime) {
            this.startTime = Date.now();
        }
        
        // 检查输入是否正确
        if (lastInputChar === currentChar) {
            this.markCharacter(this.currentIndex, 'correct');
            this.correctChars++;
            this.currentIndex++;
            this.showFeedback('正确!', 'correct');
        } else {
            this.markCharacter(this.currentIndex, 'incorrect');
            this.errors++;
            this.showFeedback('错误!', 'incorrect');
        }
        
        this.totalChars++;
        this.updateCurrentPosition();
        this.updateStats();
        
        // 检查是否完成
        if (this.currentIndex >= this.currentText.length) {
            this.finishGame();
        }
        
        // 清空输入框
        e.target.value = '';
    }
    
    handleKeyDown(e) {
        if (this.gameState !== 'playing') return;
        
        // 处理特殊键
        if (e.key === 'Escape') {
            this.togglePause();
        }
    }
    
    handleGlobalKeyDown(e) {
        if (e.key === 'Escape' && this.gameState === 'playing') {
            this.togglePause();
        }
    }
    
    markCharacter(index, status) {
        const chars = this.elements.textContent.querySelectorAll('.char');
        if (chars[index]) {
            chars[index].classList.remove('current', 'correct', 'incorrect');
            chars[index].classList.add(status);
        }
    }
    
    updateCurrentPosition() {
        const chars = this.elements.textContent.querySelectorAll('.char');
        chars.forEach(char => char.classList.remove('current'));
        
        if (chars[this.currentIndex]) {
            chars[this.currentIndex].classList.add('current');
        }
    }
    
    showFeedback(message, type) {
        const feedback = this.elements.inputFeedback;
        feedback.textContent = message;
        feedback.className = `input-feedback show ${type}`;
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 1000);
    }
    
    updateStats() {
        // 计算WPM
        if (this.startTime) {
            const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // 分钟
            const wordsTyped = this.correctChars / 5; // 标准：5个字符 = 1个单词
            this.wpm = Math.round(wordsTyped / timeElapsed) || 0;
        }
        
        // 计算准确率
        this.accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        
        // 计算进度
        const progress = Math.round((this.currentIndex / this.currentText.length) * 100);
        
        // 更新显示
        this.elements.wpm.textContent = this.wpm;
        this.elements.accuracy.textContent = this.accuracy + '%';
        this.elements.progress.textContent = progress + '%';
    }
    
    startTimer() {
        this.remainingTime = this.timeLimit;
        this.elements.timer.textContent = this.remainingTime;
        
        this.timer = setInterval(() => {
            this.remainingTime--;
            this.elements.timer.textContent = this.remainingTime;
            
            if (this.remainingTime <= 0) {
                this.finishGame();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopTimer();
            this.elements.pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
            this.elements.textInput.disabled = true;
            this.showAchievement('游戏已暂停');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            if (this.settings.timeLimit > 0) {
                this.startTimer();
            }
            this.elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
            this.elements.textInput.disabled = false;
            this.elements.textInput.focus();
        }
    }
    
    restartGame() {
        this.stopTimer();
        this.resetStats();
        this.generateText();
        this.gameState = 'playing';
        this.elements.textInput.disabled = false;
        this.elements.textInput.focus();
        
        if (this.settings.timeLimit > 0) {
            this.startTimer();
        }
        
        this.elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
    }
    
    finishGame() {
        this.gameState = 'finished';
        this.endTime = Date.now();
        this.stopTimer();
        
        // 计算最终统计
        const totalTime = this.endTime - this.startTime;
        const minutes = totalTime / 1000 / 60;
        const finalWpm = Math.round((this.correctChars / 5) / minutes) || 0;
        const finalAccuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        
        // 计算评级
        const rating = this.calculateRating(finalWpm, finalAccuracy);
        
        // 显示结果
        this.showResults(finalWpm, finalAccuracy, Math.round(totalTime / 1000), rating);
        
        // 显示成就
        this.checkAchievements(finalWpm, finalAccuracy);
    }
    
    calculateRating(wpm, accuracy) {
        let score = 0;
        
        // WPM评分 (0-50分)
        if (wpm >= 80) score += 50;
        else if (wpm >= 60) score += 40;
        else if (wpm >= 40) score += 30;
        else if (wpm >= 20) score += 20;
        else score += 10;
        
        // 准确率评分 (0-50分)
        if (accuracy >= 98) score += 50;
        else if (accuracy >= 95) score += 40;
        else if (accuracy >= 90) score += 30;
        else if (accuracy >= 80) score += 20;
        else score += 10;
        
        // 评级
        if (score >= 90) return 'A+';
        else if (score >= 80) return 'A';
        else if (score >= 70) return 'B+';
        else if (score >= 60) return 'B';
        else if (score >= 50) return 'C+';
        else if (score >= 40) return 'C';
        else return 'D';
    }
    
    checkAchievements(wpm, accuracy) {
        const achievements = [];
        
        if (wpm >= 100) achievements.push('🚀 超音速打字手!');
        else if (wpm >= 80) achievements.push('⚡ 闪电打字手!');
        else if (wpm >= 60) achievements.push('🔥 快速打字手!');
        
        if (accuracy === 100) achievements.push('🎯 完美准确率!');
        else if (accuracy >= 98) achievements.push('💎 钻石级准确率!');
        
        if (this.errors === 0) achievements.push('✨ 零错误完成!');
        
        achievements.forEach((achievement, index) => {
            setTimeout(() => this.showAchievement(achievement), index * 1000);
        });
    }
    
    showAchievement(message) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-trophy"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.animation = 'slideInRight 0.5s ease-out reverse';
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }
    
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = 10;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-effect';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.animationDelay = (i * 0.1) + 's';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }
    
    resetStats() {
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.correctChars = 0;
        this.totalChars = 0;
        this.errors = 0;
        this.wpm = 0;
        this.accuracy = 100;
        this.remainingTime = this.timeLimit;
        
        this.elements.wpm.textContent = '0';
        this.elements.accuracy.textContent = '100%';
        this.elements.timer.textContent = this.timeLimit;
        this.elements.progress.textContent = '0%';
    }
    
    showGameInterface() {
        this.elements.settingsPanel.style.display = 'none';
        this.elements.resultsPanel.style.display = 'none';
        this.elements.gameInterface.style.display = 'block';
    }
    
    showSettings() {
        this.elements.gameInterface.style.display = 'none';
        this.elements.resultsPanel.style.display = 'none';
        this.elements.settingsPanel.style.display = 'block';
        this.gameState = 'menu';
        this.stopTimer();
    }
    
    showResults(wpm, accuracy, time, rating) {
        this.elements.finalWpm.textContent = wpm;
        this.elements.finalAccuracy.textContent = accuracy + '%';
        this.elements.finalTime.textContent = time + 's';
        this.elements.finalRating.textContent = rating;
        
        this.elements.gameInterface.style.display = 'none';
        this.elements.settingsPanel.style.display = 'none';
        this.elements.resultsPanel.style.display = 'block';
    }
    
    playAgain() {
        this.startGame();
    }
    
    newGame() {
        this.showSettings();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new TypingGame();
    
    // 添加额外的视觉效果
    createFloatingParticles();
    
    // 添加键盘音效（可选）
    addKeyboardSounds();
});

// 创建浮动粒子效果
function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.1)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 10 + 's';
        
        particleContainer.appendChild(particle);
    }
}

// 添加键盘音效
function addKeyboardSounds() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playKeySound(frequency = 800, duration = 100) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.target.id === 'textInput') {
            playKeySound(Math.random() * 200 + 600, 50);
        }
    });
}

// 添加主题切换动画
function animateThemeChange() {
    document.body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}