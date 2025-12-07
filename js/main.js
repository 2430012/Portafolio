// ==================== Activity Card Click Handler ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeActivityCards();
    addScrollAnimations();
    createParticleEffect();
});

/**
 * Initialize click handlers for activity cards
 */
function initializeActivityCards() {
    const activityCards = document.querySelectorAll('.activity-card');

    activityCards.forEach(card => {
        card.addEventListener('click', handleCardClick);
        card.addEventListener('mouseenter', handleCardHover);
    });
}

/**
 * Handle card click events
 * @param {Event} event - Click event
 */
function handleCardClick(event) {
    const card = event.currentTarget;
    const activityId = card.dataset.activity;
    const activityLink = card.dataset.link;
    const img = card.querySelector('.card-image');
    const altText = img.alt;

    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);

    // Log the click
    console.log(`Clicked on activity: ${activityId}`);
    console.log(`Navigating to: ${activityLink}`);

    // Show notification
    showNotification(`Navegando a: ${altText}`);

    // Navigate to activity page after a short delay
    if (activityLink) {
        setTimeout(() => {
            window.location.href = activityLink;
        }, 500);
    }
}

/**
 * Handle card hover events with ripple effect
 * @param {Event} event - Mouse enter event
 */
function handleCardHover(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(99, 102, 241, 0.3);
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 10;
    `;

    card.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Add scroll-based animations
 */
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all unit sections
    const sections = document.querySelectorAll('.unit-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

/**
 * Create floating particle effect in background
 */
function createParticleEffect() {
    const background = document.querySelector('.background-animation');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            left: ${startX}%;
            top: ${startY}%;
            animation: particleFloat ${duration}s infinite ease-in-out;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;

        background.appendChild(particle);
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 */
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out, slideOutRight 0.3s ease-in 2.7s;
        opacity: 0;
        transform: translateX(100%);
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Add smooth scrolling to anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== CSS Animations (injected dynamically) ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
    
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
        }
        25% {
            transform: translate(100px, -100px);
            opacity: 0.6;
        }
        50% {
            transform: translate(200px, 50px);
            opacity: 0.4;
        }
        75% {
            transform: translate(-50px, 150px);
            opacity: 0.5;
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
