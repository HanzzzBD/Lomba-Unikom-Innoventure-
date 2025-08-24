// Marquee Helper Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Marquee Helper loaded');
    
    // Check if marquee elements exist
    const marqueeTracks = document.querySelectorAll('.keunggulan-track');
    console.log('Found marquee tracks:', marqueeTracks.length);
    
    marqueeTracks.forEach((track, index) => {
        const isReverse = track.classList.contains('reverse');
        const speed = track.className.match(/speed-(\d+)/);
        const speedValue = speed ? speed[1] : 'default';
        
        console.log(`Track ${index + 1}:`, {
            element: track,
            isReverse: isReverse,
            speed: speedValue,
            animationName: getComputedStyle(track).animationName,
            animationDuration: getComputedStyle(track).animationDuration
        });
        
        // Force animation restart if needed
        track.style.animation = 'none';
        track.offsetHeight; // Trigger reflow
        track.style.animation = null;
    });
    
    // Add click handler to test animations
    marqueeTracks.forEach((track, index) => {
        track.addEventListener('click', function() {
            console.log(`Clicked track ${index + 1}`);
            this.style.animationPlayState = this.style.animationPlayState === 'paused' ? 'running' : 'paused';
        });
    });
});

// Function to restart all marquee animations
function restartMarqueeAnimations() {
    const tracks = document.querySelectorAll('.keunggulan-track');
    tracks.forEach(track => {
        track.style.animation = 'none';
        track.offsetHeight; // Trigger reflow
        track.style.animation = null;
    });
    console.log('Marquee animations restarted');
}

// Function to pause all marquee animations
function pauseMarqueeAnimations() {
    const tracks = document.querySelectorAll('.keunggulan-track');
    tracks.forEach(track => {
        track.style.animationPlayState = 'paused';
    });
    console.log('Marquee animations paused');
}

// Function to resume all marquee animations
function resumeMarqueeAnimations() {
    const tracks = document.querySelectorAll('.keunggulan-track');
    tracks.forEach(track => {
        track.style.animationPlayState = 'running';
    });
    console.log('Marquee animations resumed');
}

// Make functions globally available
window.restartMarqueeAnimations = restartMarqueeAnimations;
window.pauseMarqueeAnimations = pauseMarqueeAnimations;
window.resumeMarqueeAnimations = resumeMarqueeAnimations;
