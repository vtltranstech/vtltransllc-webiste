document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        
        // Toggle hamburger animation
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Handle dropdown on mobile (simple click toggle)
    if (window.innerWidth <= 768) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                if(e.target.tagName.toLowerCase() === 'a' && e.target.nextElementSibling && e.target.nextElementSibling.classList.contains('dropdown-menu')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu.classList.contains('open')) {
                    menuToggle.click();
                }

                // Scroll to target, subtracting header height
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Google Sheets Integration
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxNfPqHiMhjTunlOHM9PeDv_xSDZYU3bibukIjOqgQrCgXBpC1eF-j5nlbXhMX1jI8S0w/exec';

    // 1. Request a Quote Form Submission
    const quoteForm = document.getElementById('quote-form');
    const quoteSubmitBtn = document.getElementById('submit-btn-quote');
    const quoteSuccessMsg = document.getElementById('quote-success');

    if (quoteForm) {
        quoteForm.addEventListener('submit', e => {
            e.preventDefault();

            const name = quoteForm.querySelector('[name="name"]').value.trim();
            const email = quoteForm.querySelector('[name="email"]').value.trim();
            const phone = quoteForm.querySelector('[name="phone"]').value.trim();
            const service = quoteForm.querySelector('[name="service"]').value;
            const origin = quoteForm.querySelector('[name="origin"]').value.trim();
            const destination = quoteForm.querySelector('[name="destination"]').value.trim();
            const userMsg = quoteForm.querySelector('[name="message"]').value.trim();

            // Construct compiled message for Google Sheet column compatibility
            const compiledMessage = `Phone: ${phone}
Service: ${service}
Origin: ${origin}
Destination: ${destination}
Details: ${userMsg}`;

            // Create clean form data payload to align with Sheet headers
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('inquiry_type', 'quote');
            formData.append('phone', phone);
            formData.append('message', compiledMessage);

            const originalBtnText = quoteSubmitBtn.innerText;
            quoteSubmitBtn.innerText = 'Sending...';
            quoteSubmitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
                .then(response => {
                    quoteForm.style.display = 'none';
                    quoteSuccessMsg.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert("There was an error submitting the form. Please try again.");
                    quoteSubmitBtn.innerText = originalBtnText;
                    quoteSubmitBtn.disabled = false;
                });
        });
    }

    // 2. Careers / Driver Application Form Submission
    const careersForm = document.getElementById('careers-form');
    const careersSubmitBtn = document.getElementById('submit-btn-careers');
    const careersSuccessMsg = document.getElementById('careers-success');

    if (careersForm) {
        careersForm.addEventListener('submit', e => {
            e.preventDefault();

            const name = careersForm.querySelector('[name="name"]').value.trim();
            const email = careersForm.querySelector('[name="email"]').value.trim();
            const phone = careersForm.querySelector('[name="phone"]').value.trim();
            const experience = careersForm.querySelector('[name="experience"]').value.trim();
            const cdl = careersForm.querySelector('[name="cdl"]').value;
            const cleanRecord = careersForm.querySelector('[name="clean_record"]').value;
            const userMsg = careersForm.querySelector('[name="message"]').value.trim();

            // Construct compiled message for Google Sheet column compatibility
            const compiledMessage = `Phone: ${phone}
Experience: ${experience} years
CDL Class: ${cdl}
Clean Record: ${cleanRecord}
History/Message: ${userMsg}`;

            // Create clean form data payload to align with Sheet headers
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('inquiry_type', 'driver_application');
            formData.append('phone', phone);
            formData.append('message', compiledMessage);

            const originalBtnText = careersSubmitBtn.innerText;
            careersSubmitBtn.innerText = 'Sending...';
            careersSubmitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
                .then(response => {
                    careersForm.style.display = 'none';
                    careersSuccessMsg.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert("There was an error submitting the form. Please try again.");
                    careersSubmitBtn.innerText = originalBtnText;
                    careersSubmitBtn.disabled = false;
                });
        });
    }
});
