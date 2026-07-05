// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll for Navigation Links
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

// Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements
const animatedElements = document.querySelectorAll('.glass, .section-title, .skill-category, .project-card, .certification-card, .service-card');
animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Animated Statistics Counters
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// GitHub API Integration
const fetchGitHubStats = async () => {
    const username = 'jayantmehta712';
    const githubStats = document.getElementById('githubStats');
    
    try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposResponse.json();
        
        // Calculate total stars
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        
        // Update stats with animation
        animateValue('repoCount', 0, userData.public_repos, 1000);
        animateValue('starCount', 0, totalStars, 1000);
        animateValue('followerCount', 0, userData.followers, 1000);
        
        // Estimate commits (GitHub API doesn't provide total commits directly)
        // This is a rough estimate based on repository activity
        const estimatedCommits = reposData.length * 15; // Average 15 commits per repo
        animateValue('commitCount', 0, estimatedCommits, 1000);
        
        // Update contribution graph image source
        const contributionGraph = document.getElementById('contributionGraph');
        if (contributionGraph) {
            contributionGraph.src = `https://ghchart.rshah.org/${username}`;
        }
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Set default values if API fails
        document.getElementById('repoCount').textContent = '9';
        document.getElementById('commitCount').textContent = '135';
        document.getElementById('starCount').textContent = '0';
        document.getElementById('followerCount').textContent = '0';
    }
};

// Helper function to animate numbers
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Call GitHub stats function
fetchGitHubStats();

// Contact Form Handling - Now using Google Form iframe
// No JavaScript form handling needed as Google Form handles submissions directly

// Download Resume Handler
const downloadResumeBtn = document.getElementById('downloadResume');

downloadResumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const resumePath = 'https://jayant-portfolio-six.vercel.app/jayant-mehta-resume.pdf';
    
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'jayant-mehta-resume.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = html.getAttribute('data-theme') === 'dark' 
            ? 'rgba(10, 10, 15, 0.95)' 
            : 'rgba(248, 250, 252, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = html.getAttribute('data-theme') === 'dark' 
            ? 'rgba(10, 10, 15, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typing Effect for Hero Title (Optional Enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance Optimization: Lazy load images (if any images are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Accessibility: Handle keyboard navigation for theme toggle
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggle.click();
    }
});

// Accessibility: Handle escape key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Console welcome message
console.log('%c Welcome to Jayant Mehta\'s Portfolio! ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 10px; font-size: 16px; border-radius: 5px;');
