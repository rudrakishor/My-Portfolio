// --- Global DOM References ---
const tablinks = document.querySelectorAll(".tab-links");
const tabcontents = document.querySelectorAll(".tab-contents");
const accordionHeaders = document.querySelectorAll(".accordion-header");
const msg = document.getElementById("msg");
const form = document.querySelector(".contact-right form");
const yearSpan = document.getElementById("current-year");
const sidemenu = document.querySelector("nav ul");

// --- References for mobile menu icons (added from HTML) ---
const openMenuIcon = document.getElementById("openMenuIcon");
const closeMenuIcon = document.getElementById("closeMenuIcon");

// --- Client-side storage for sent emails ---
let sentEmails = JSON.parse(localStorage.getItem('sentEmails')) || [];

// --- About Section Tabs ---
function opentab(tabname, event) {
    tablinks.forEach(tablink => {
        tablink.classList.remove("active-link");
    });
    tabcontents.forEach(tabcontent => {
        tabcontent.classList.remove("active-tab");
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active-link");
    }
    const selectedTab = document.getElementById(tabname);
    if (selectedTab) {
        selectedTab.classList.add("active-tab");
    }
}

// --- Skills Section Accordion ---
if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const currentlyActiveHeader = document.querySelector(".accordion-header.active");
            if (currentlyActiveHeader && currentlyActiveHeader !== header) {
                currentlyActiveHeader.classList.remove("active");
                currentlyActiveHeader.nextElementSibling.style.maxHeight = 0;
            }
            header.classList.toggle("active");
            const accordionContent = header.nextElementSibling;
            if (accordionContent) {
                if (header.classList.contains("active")) {
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                } else {
                    accordionContent.style.maxHeight = 0;
                }
            }
        });
    });
}

// --- Contact Form Logic ---
// Ensure these are defined before the form.addEventListener if they are used within it
const contactEmailInput = document.getElementById("contactEmail"); // This was defined globally earlier, re-confirming here
const emailWarning = document.getElementById("emailWarning"); // This was defined globally earlier, re-confirming here

if (form) {
    function showWarning(message) {
        if (emailWarning) {
            emailWarning.textContent = message;
            emailWarning.classList.add('show');
        }
    }
    function hideWarning() {
        if (emailWarning) {
            emailWarning.textContent = '';
            emailWarning.classList.remove('show');
        }
    }
    if (contactEmailInput) {
        contactEmailInput.addEventListener('input', function() {
            const email = this.value.trim().toLowerCase();
            if (email) {
                if (sentEmails.includes(email)) {
                    showWarning('This email has already sent a message!');
                } else {
                    hideWarning();
                }
            } else {
                hideWarning();
            }
        });
    }
    form.addEventListener('submit', e => {
        e.preventDefault();
        const currentEmail = contactEmailInput ? contactEmailInput.value.trim().toLowerCase() : '';
        fetch(form.action, {
            method: "POST",
            body: new FormData(e.target),
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                if (msg) msg.innerHTML = "Message sent successfully!";
                if (!sentEmails.includes(currentEmail) && currentEmail !== '') {
                    sentEmails.push(currentEmail);
                    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
                }
                setTimeout(() => {
                    if (msg) msg.innerHTML = "";
                    form.reset();
                    hideWarning();
                }, 5000);
            } else {
                response.json().then(data => {
                    if (msg) {
                        if (Object.hasOwnProperty.call(data, 'errors')) {
                            msg.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            msg.innerHTML = "Oops! There was a problem submitting your form.";
                        }
                    }
                }).catch(() => {
                    if (msg) msg.innerHTML = "Oops! There was a problem submitting your form.";
                });
            }
        }).catch(error => {
            if (msg) msg.innerHTML = "Oops! There was a network error.";
        });
    });
}

// --- Footer/Copyright Section ---
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}

// --- Mobile Side Menu Functions ---
function openmenu() {
    if (sidemenu) {
        sidemenu.classList.add("active");
        if (openMenuIcon) openMenuIcon.style.display = 'none'; // Hide hamburger icon
        if (closeMenuIcon) closeMenuIcon.style.display = 'block'; // Show close icon
    }
}
function closemenu() {
    if (sidemenu) {
        sidemenu.classList.remove("active");
        if (openMenuIcon) openMenuIcon.style.display = 'block'; // Show hamburger icon
        if (closeMenuIcon) closeMenuIcon.style.display = 'none'; // Hide close icon
    }
}

// --- Initial setup on page load ---
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the close icon is hidden when the page first loads
    if (closeMenuIcon) closeMenuIcon.style.display = 'none';
    // Ensure the open icon (hamburger) is visible by default on mobile, if menu is closed
    if (openMenuIcon) openMenuIcon.style.display = 'block';
});
