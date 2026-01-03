let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const track = document.querySelector('.carousel-track');

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

const projects = [
    {
        title: "MOOOVE!",
        description: "A turn-based game in C++.",
        video: "project1.mp4",
        explanation: "Built with OOP principles.",
        screenshots: ["s1.jpg", "s2.jpg", "s3.jpg"],
        additionalText: "Future: add multiplayer."
    },
    {
        title: "Project 2",
        description: "Description here.",
        video: "project2.mp4",
        explanation: "Technical details.",
        screenshots: ["s1.jpg", "s2.jpg"],
        additionalText: "More info."
    }
];

function showProjectDetail(i) {
    const p = projects[i];
    const detail = document.getElementById('project-detail');
    const main = document.querySelector('.main-content');
    const content = document.querySelector('.project-detail-content');

    let shots = '';
    p.screenshots.forEach(s => shots += `<img src="${s}">`);

    content.innerHTML = `
        <h2>${p.title}</h2>
        <h3>Description</h3>
        <p>${p.description}</p>
        <h3>Demo</h3>
        <div class="project-video"><video controls><source src="${p.video}"></video></div>
        <h3>Explanation</h3>
        <p>${p.explanation}</p>
        <h3>Screenshots</h3>
        <div class="project-screenshots">${shots}</div>
        <h3>More</h3>
        <p>${p.additionalText}</p>
    `;

    main.classList.add('hidden');
    detail.classList.add('active');
    window.scrollTo(0, 0);
}

function hideProjectDetail() {
    document.getElementById('project-detail').classList.remove('active');
    document.querySelector('.main-content').classList.remove('hidden');
}

function openResume() {
    window.open('resume.pdf', '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all nav links are visible and properly set up
    const nav = document.querySelector('nav');
    if (nav) {
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            // Reset any styles that might hide links
            link.style.display = '';
            link.style.visibility = '';
            link.style.opacity = '';
            
            // Ensure artworks link is always visible
            if (link.getAttribute('href') === 'artworks.html') {
                link.style.display = '';
                link.style.visibility = 'visible';
                link.style.opacity = '1';
            }
        });
    }

    // Handle smooth scrolling for anchor links only
    document.querySelectorAll('nav a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Only handle anchor links, not external links or onclick handlers
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({behavior: 'smooth'});
                }
            }
            // Ensure artworks link remains visible after navigation
            setTimeout(() => {
                const artworksLink = document.querySelector('nav a[href="artworks.html"]');
                if (artworksLink) {
                    artworksLink.style.display = '';
                    artworksLink.style.visibility = 'visible';
                    artworksLink.style.opacity = '1';
                }
                // Also ensure parent li is visible
                const artworksLi = artworksLink ? artworksLink.parentElement : null;
                if (artworksLi) {
                    artworksLi.style.display = '';
                    artworksLi.style.visibility = 'visible';
                    artworksLi.style.opacity = '1';
                }
            }, 100);
        });
    });
});