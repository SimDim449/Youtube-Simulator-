
// App state
let currentPage = 'main';
let clickedNumbers = 0;
let editingClicks = 0;
let imageEditingClicks = 0;
let createdVideos = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadStoicQuote();
    setupEventListeners();
    generateNumbers();
    renderVideos();
});

// Load stoic quote from API
async function loadStoicQuote() {
    try {
        const response = await fetch('https://stoic.tekloon.net/stoic-quote');
        const data = await response.json();
        document.getElementById('stoic-quote').textContent = data.quote || data.text || 'The best time to plant a tree was 20 years ago. The second best time is now.';
    } catch (error) {
        console.log('Using fallback quote');
        document.getElementById('stoic-quote').textContent = 'The best time to plant a tree was 20 years ago. The second best time is now.';
    }
}

// Setup all event listeners
function setupEventListeners() {
    document.getElementById('record-btn').addEventListener('click', () => showPage('game'));
    document.getElementById('start-editing').addEventListener('click', startVideoEditing);
    document.getElementById('edit-image-btn').addEventListener('click', () => showPage('edit-image'));
    document.getElementById('start-image-editing').addEventListener('click', startImageEditing);
    document.getElementById('save-upload-btn').addEventListener('click', saveAndUpload);
    document.getElementById('final-upload-btn').addEventListener('click', finalUpload);
}

// Show specific page
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelector('.container').style.display = page === 'main' ? 'block' : 'none';
    
    // Show target page
    if (page !== 'main') {
        document.getElementById(`${page}-page`).classList.remove('hidden');
    }
    
    currentPage = page;
}

// Generate number buttons for the game
function generateNumbers() {
    const container = document.getElementById('numbers-container');
    container.innerHTML = '';
    
    const numbers = Array.from({length: 20}, (_, i) => i + 1);
    // Shuffle numbers
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    numbers.forEach(num => {
        const button = document.createElement('button');
        button.className = 'number-button';
        button.textContent = num;
        button.addEventListener('click', () => clickNumber(button, num));
        container.appendChild(button);
    });
}

// Handle number button clicks
function clickNumber(button, number) {
    if (button.classList.contains('clicked')) return;
    
    const expectedNumber = clickedNumbers + 1;
    
    // Check if clicked number is correct (sequential)
    if (number !== expectedNumber) {
        // Wrong number clicked - show error
        button.classList.add('error');
        showErrorMessage(`You need to press ${expectedNumber} next!`);
        
        // Remove error styling after 1 second
        setTimeout(() => {
            button.classList.remove('error');
        }, 1000);
        return;
    }
    
    // Correct number clicked
    clickedNumbers++;
    button.classList.add('clicked');
    
    // Update progress
    const progress = (clickedNumbers / 20) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
    
    // Check if all numbers clicked
    if (clickedNumbers === 20) {
        setTimeout(() => {
            showEditVideoModal();
        }, 500);
    }
}

// Show error message
function showErrorMessage(message) {
    // Remove existing error message if any
    const existingError = document.getElementById('error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert after the game title
    const gameContainer = document.querySelector('.game-container');
    const title = gameContainer.querySelector('h2');
    title.insertAdjacentElement('afterend', errorDiv);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show edit video modal
function showEditVideoModal() {
    if (confirm('Congratulations! All numbers clicked. Ready to edit your video?')) {
        showPage('edit-video');
    }
}

// Start video editing process
function startVideoEditing() {
    const canvas = document.getElementById('video-canvas');
    const indicator = document.getElementById('click-indicator');
    const effectsDisplay = document.getElementById('effects-display');
    
    document.getElementById('start-editing').style.display = 'none';
    indicator.classList.remove('hidden');
    
    // Add click listener to canvas
    canvas.addEventListener('click', handleVideoEditClick);
}

// Handle video editing clicks
function handleVideoEditClick(event) {
    // Prevent clicks if already at 100%
    if (editingClicks >= 20) {
        return;
    }
    
    editingClicks++;
    
    const canvas = document.getElementById('video-canvas');
    const effectsDisplay = document.getElementById('effects-display');
    
    // Create click indicator at click position
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    showClickEffect(x, y, canvas);
    
    // Update video editing progress
    const progress = (editingClicks / 20) * 100;
    document.getElementById('video-progress-fill').style.width = `${progress}%`;
    document.getElementById('video-progress-text').textContent = `${Math.round(progress)}%`;
    
    // Add random effect
    setTimeout(() => {
        addVideoEffect(effectsDisplay);
    }, 200);
    
    // Check if editing is complete (20 clicks)
    if (editingClicks >= 20) {
        setTimeout(() => {
            canvas.removeEventListener('click', handleVideoEditClick);
            document.getElementById('click-indicator').classList.add('hidden');
            document.getElementById('edit-image-btn').classList.remove('hidden');
        }, 1000);
    }
}

// Show click effect animation
function showClickEffect(x, y, container) {
    const clickFx = document.createElement('div');
    clickFx.style.position = 'absolute';
    clickFx.style.left = x + 'px';
    clickFx.style.top = y + 'px';
    clickFx.style.width = '20px';
    clickFx.style.height = '20px';
    clickFx.style.background = '#ff6b6b';
    clickFx.style.borderRadius = '50%';
    clickFx.style.transform = 'translate(-50%, -50%)';
    clickFx.style.animation = 'pulse 0.3s ease-out';
    clickFx.style.pointerEvents = 'none';
    
    container.appendChild(clickFx);
    
    setTimeout(() => {
        clickFx.remove();
    }, 300);
}

// Add video effects
function addVideoEffect(container) {
    const effects = [
        { text: 'Transition Added!', class: 'transition' },
        { text: 'Cool Filter Applied!', class: 'filter' },
        { text: 'Animation Created!', class: 'animation' },
        { text: 'Sound Effect Added!', class: 'sound' },
        { text: 'Color Correction!', class: 'filter' },
        { text: 'Smooth Transition!', class: 'transition' },
        { text: 'Dynamic Animation!', class: 'animation' },
        { text: 'Audio Enhancement!', class: 'sound' }
    ];
    
    const effect = effects[Math.floor(Math.random() * effects.length)];
    const effectEl = document.createElement('div');
    effectEl.className = `effect ${effect.class}`;
    effectEl.textContent = effect.text;
    effectEl.style.left = Math.random() * 70 + 15 + '%';
    effectEl.style.top = Math.random() * 60 + 20 + '%';
    
    container.appendChild(effectEl);
    
    // Remove effect after animation
    setTimeout(() => {
        effectEl.remove();
    }, 2000);
}

// Start image editing
function startImageEditing() {
    const canvas = document.getElementById('image-canvas');
    const imageEffects = document.getElementById('image-effects');
    
    document.getElementById('start-image-editing').style.display = 'none';
    
    // Add click listener
    canvas.addEventListener('click', handleImageEditClick);
}

// Handle image editing clicks
function handleImageEditClick(event) {
    // Prevent clicks if already at 100%
    if (imageEditingClicks >= 20) {
        return;
    }
    
    imageEditingClicks++;
    
    const canvas = document.getElementById('image-canvas');
    const imageEffects = document.getElementById('image-effects');
    
    // Show click effect
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    showClickEffect(x, y, canvas);
    
    // Update image editing progress
    const progress = (imageEditingClicks / 20) * 100;
    document.getElementById('image-progress-fill').style.width = `${progress}%`;
    document.getElementById('image-progress-text').textContent = `${Math.round(progress)}%`;
    
    // Add image effect
    setTimeout(() => {
        addImageEffect(imageEffects);
    }, 200);
    
    // Check if image editing is complete (20 clicks)
    if (imageEditingClicks >= 20) {
        setTimeout(() => {
            canvas.removeEventListener('click', handleImageEditClick);
            document.getElementById('save-upload-btn').classList.remove('hidden');
        }, 1000);
    }
}

// Add image effects
function addImageEffect(container) {
    const effects = [
        'Thumbnail Enhanced!',
        'Color Balanced!',
        'Brightness Adjusted!',
        'Contrast Improved!',
        'Saturation Boosted!'
    ];
    
    const effect = effects[Math.floor(Math.random() * effects.length)];
    const effectEl = document.createElement('div');
    effectEl.className = 'image-effect';
    effectEl.textContent = effect;
    effectEl.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
    effectEl.style.left = Math.random() * 70 + 15 + '%';
    effectEl.style.top = Math.random() * 60 + 20 + '%';
    
    container.appendChild(effectEl);
    
    setTimeout(() => {
        effectEl.remove();
    }, 1500);
}

// Save and upload - now goes to title page
function saveAndUpload() {
    showPage('video-title');
}

// Final upload with custom title
function finalUpload() {
    const titleInput = document.getElementById('video-title-input');
    const title = titleInput.value.trim();
    
    if (!title) {
        alert('Please enter a title for your video!');
        return;
    }
    
    // Simulate upload process
    document.getElementById('final-upload-btn').textContent = 'Uploading...';
    document.getElementById('final-upload-btn').disabled = true;
    
    setTimeout(() => {
        createNewVideo(title);
        resetApp();
        showPage('main');
    }, 2000);
}

// Create a new video with custom title
function createNewVideo(customTitle) {
    const video = {
        id: Date.now(),
        title: customTitle || `Amazing Video #${createdVideos.length + 1}`,
        thumbnail: generateThumbnail(),
        views: Math.floor(Math.random() * 50000) + 1000,
        subscribers: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 2000) + 100,
        createdAt: new Date().toLocaleDateString()
    };
    
    createdVideos.push(video);
    renderVideos();
}

// Generate a random thumbnail color/pattern
function generateThumbnail() {
    const colors = [
        'linear-gradient(45deg, #ff6b6b, #ee5a24)',
        'linear-gradient(45deg, #4ecdc4, #44a08d)',
        'linear-gradient(45deg, #667eea, #764ba2)',
        'linear-gradient(45deg, #f093fb, #f5576c)',
        'linear-gradient(45deg, #ffecd2, #fcb69f)',
        'linear-gradient(45deg, #a8e6cf, #88d8a3)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Render all created videos
function renderVideos() {
    const videosSection = document.querySelector('.videos-section');
    
    // Remove existing video displays
    const existingVideos = videosSection.querySelector('.videos-list');
    if (existingVideos) {
        existingVideos.remove();
    }
    
    if (createdVideos.length === 0) return;
    
    // Create videos list container
    const videosContainer = document.createElement('div');
    videosContainer.className = 'videos-list';
    
    createdVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        videoCard.innerHTML = `
            <div class="video-thumbnail" style="background: ${video.thumbnail}">
                <div class="play-icon">▶</div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <div class="video-stats">
                    <span class="stat">👁 ${video.views.toLocaleString()} views</span>
                    <span class="stat">👥 +${video.subscribers} subscribers</span>
                    <span class="stat">👍 ${video.likes.toLocaleString()} likes</span>
                </div>
                <div class="video-date">Created: ${video.createdAt}</div>
            </div>
        `;
        
        videosContainer.appendChild(videoCard);
    });
    
    // Insert after the record button
    const recordBtn = document.getElementById('record-btn');
    recordBtn.insertAdjacentElement('afterend', videosContainer);
}

// Reset app to start over
function resetApp() {
    clickedNumbers = 0;
    editingClicks = 0;
    imageEditingClicks = 0;
    
    // Reset progress bars
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('progress-text').textContent = '0%';
    document.getElementById('video-progress-fill').style.width = '0%';
    document.getElementById('video-progress-text').textContent = '0%';
    document.getElementById('image-progress-fill').style.width = '0%';
    document.getElementById('image-progress-text').textContent = '0%';
    
    // Reset buttons and displays
    document.getElementById('start-editing').style.display = 'block';
    document.getElementById('edit-image-btn').classList.add('hidden');
    document.getElementById('start-image-editing').style.display = 'block';
    document.getElementById('save-upload-btn').classList.add('hidden');
    document.getElementById('save-upload-btn').textContent = 'Save Image and Upload Video';
    document.getElementById('save-upload-btn').disabled = false;
    
    // Reset title input
    document.getElementById('video-title-input').value = '';
    document.getElementById('final-upload-btn').textContent = 'Upload Video';
    document.getElementById('final-upload-btn').disabled = false;
    
    // Clear effects
    document.getElementById('effects-display').innerHTML = '';
    document.getElementById('image-effects').innerHTML = '';
    
    // Regenerate numbers
    generateNumbers();
    
    // Load new quote
    loadStoicQuote();
}
