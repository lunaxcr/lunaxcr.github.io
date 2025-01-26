// Canvas setup and initialization
const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Cache canvas dimensions
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Star animation configuration
const stars = [];
const numStars = 200;
const mouseRepulsionRadius = 100;
let mouseX = null;
let mouseY = null;

// Mobile menu dropdown functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Toggle dropdown menu on hamburger click
    hamburgerBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        const currentDisplay = window.getComputedStyle(dropdownMenu).display;
        dropdownMenu.style.display = currentDisplay === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown') && dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        }
    });
});

// Initialize stars with random positions and velocities
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 2 + 1,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
    });
}

// Mouse movement tracking
window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Reset mouse position when cursor leaves window
window.addEventListener("mouseleave", () => {
    mouseX = null;
    mouseY = null;
});

// Disable right-click context menu on the entire document
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Update canvas size and reposition stars on window resize
window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    stars.forEach((star) => {
        star.x = Math.random() * canvasWidth;
        star.y = Math.random() * canvasHeight;
    });
});

// Throttle function to limit the rate of bounce animation triggering
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Function to detect mobile devices
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

if (!isMobileDevice()) {
    // Blurred circle effect
    const blurCircle = document.createElement('div');
    blurCircle.style.position = 'absolute';
    blurCircle.style.width = '100px';
    blurCircle.style.height = '100px';
    blurCircle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    blurCircle.style.borderRadius = '50%';
    blurCircle.style.pointerEvents = 'none';
    blurCircle.style.filter = 'blur(100px)';
    document.body.appendChild(blurCircle);

    // Update position of blurred circle
    window.addEventListener('mousemove', (event) => {
        blurCircle.style.left = `${event.clientX - 50}px`;
        blurCircle.style.top = `${event.clientY - 50}px`;
    });
}

// Main animation loop for stars
function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    stars.forEach((star) => {
        // Update star positions
        star.x += star.velocityX;
        star.y += star.velocityY;

        // Wrap stars around screen edges
        if (star.x < 0) star.x = canvasWidth;
        if (star.x > canvasWidth) star.x = 0;
        if (star.y < 0) star.y = canvasHeight;
        if (star.y > canvasHeight) star.y = 0;

        // Mouse repulsion effect
        if (mouseX !== null && mouseY !== null) {
            const dx = star.x - mouseX;
            const dy = star.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRepulsionRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouseRepulsionRadius - distance) / mouseRepulsionRadius;
                star.x += Math.cos(angle) * force * 5;
                star.y += Math.sin(angle) * force * 5;
            }
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate();