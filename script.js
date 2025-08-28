document.addEventListener('DOMContentLoaded', async () => {
    if (window.self !== window.top) {
        document.body.classList.add('embedded');
    }

    // --- Konstanter ---
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyR0g64uVkcZ8DNwIjDWyBLWODO_Szt8sPPJjHlyvlXqkJNSPHGMLsW7ifpKmVs1aNh/exec';
    
    // --- State Variabler ---
    let BikeCatalog = { evoOriginal: [] };
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;
    let relaxedSearchPerformed = false;
    let totalSteps;
    let newsletterModalShownThisSession = false;

    // --- DOM Referanser ---
    const initialLoader = document.getElementById('initial-loader');
    const initialLoaderText = document.getElementById('bike-loading-text-element');
    const bikeImageElement = initialLoader ? initialLoader.querySelector('.bike-loader-png') : null;
    const questionsSection = document.getElementById('questions-section');
    const recommendationsSection = document.getElementById('recommendations-section');
    const sentenceBuilder = document.getElementById('sentence-builder');
    const summarySentenceFinal = document.getElementById('summary-sentence-final');
    const stepTitle = document.getElementById('step-title');
    const stepOptions = document.getElementById('step-options');
    const backButton = document.getElementById('back-button');
    const resetButtonStep = document.getElementById('reset-button-step');
    const resetButtonFinal = document.getElementById('reset-button-final');
    const recommendationsOutput = document.getElementById('recommendations-output');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const currentYearSpan = document.getElementById('current-year');
    const loadingIndicator = document.getElementById('loading-indicator');
    const contactEvoSection = document.getElementById('contact-evo-section');

    // Modal DOM Referanser
    const newsletterPopupModal = document.getElementById('newsletter-popup-modal');
    const closeNewsletterModalBtn = document.getElementById('close-newsletter-modal');
    const modalNewsletterForm = document.getElementById('modal-newsletter-form');
    const modalNewsletterNameInput = document.getElementById('modal-newsletter-name');
    const modalNewsletterEmailInput = document.getElementById('modal-newsletter-email');
    const modalNewsletterPhoneInput = document.getElementById('modal-newsletter-phone');
    const modalNewsletterConsentCheckbox = document.getElementById('modal-newsletter-consent');
    const modalNewsletterMessage = document.getElementById('modal-newsletter-message');
    const modalNewsletterFormWrapper = document.getElementById('modal-newsletter-form-wrapper');
    const modalNewsletterThankyouWrapper = document.getElementById('modal-newsletter-thankyou-wrapper');
    const openNewsletterPopupBtn = document.getElementById('open-newsletter-popup-btn');

    // --- Steps Definisjon ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'høytTopprør', label: 'Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];

    // --- Sporingsfunksjon ---
    function trackAdvisorEvent(eventName, eventParameters) {
        console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {});
    }

    // --- Nyhetsbrev innsending ---
    async function sendNewsletterDataWithFormData(navn, email, phone, recommendedBikes = []) {
        const formData = new FormData();
        formData.append('navn', navn);
        formData.append('email_address', email);
        if (phone) formData.append('phone', phone);

        const tagsForSheet = Array.isArray(recommendedBikes)
            ? recommendedBikes.map(b => b.name || b.id || 'UkjentSykkel').filter(Boolean)
            : [];
        tagsForSheet.push('bike advisor');
        formData.append('tags_for_logging', tagsForSheet.join(','));

        await fetch(GAS_WEB_APP_URL, { method: "POST", mode: 'no-cors', body: formData });
        return { success: true };
    }

    async function submitNewsletterForm(e) {
        e.preventDefault();
        const navn = modalNewsletterNameInput.value.trim();
        const email = modalNewsletterEmailInput.value.trim();
        const phone = modalNewsletterPhoneInput ? modalNewsletterPhoneInput.value.trim() : '';

        if (!navn || !email) {
            modalNewsletterMessage.textContent = "Fyll inn navn og gyldig e-post.";
            modalNewsletterMessage.style.color = "#b71c1c";
            return;
        }

        modalNewsletterMessage.textContent = "Sender...";
        const submitButton = modalNewsletterForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            await sendNewsletterDataWithFormData(navn, email, phone, recommendations);

            modalNewsletterFormWrapper.classList.add('hidden');
            modalNewsletterThankyouWrapper.innerHTML = `<h2>Takk, ${navn}!</h2><p>Du får straks anbefalingene dine tilsendt på ${email}.</p>`;
            modalNewsletterThankyouWrapper.classList.remove('hidden');

            trackAdvisorEvent('newsletter_signup_success', { navn, email, phone });

            // --- postMessage til parent ---
            window.parent.postMessage({
                type: 'newsletter_signup_success',
                navn, email, phone
            }, '*');

        } catch (err) {
            modalNewsletterMessage.textContent = "Noe gikk galt. Prøv igjen.";
            modalNewsletterMessage.style.color = "#b71c1c";

            trackAdvisorEvent('newsletter_signup_failed', { navn, email, phone, error: err.message });

            // --- postMessage error ---
            window.parent.postMessage({
                type: 'newsletter_signup_failed',
                navn, email, phone,
                error: err.message
            }, '*');
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    }

    if (modalNewsletterForm) modalNewsletterForm.addEventListener("submit", submitNewsletterForm);

    // --- Initialisering ---
    async function initializeAdvisor() {
        const catalogLoaded = await fetchBikeCatalog();
        totalSteps = calculateTotalVisibleSteps();
        if (backButton) backButton.addEventListener('click', handleBack);
        if (resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
        if (resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
        if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) {
            trackAdvisorEvent('advisor_ui_ready');
        }
        updateView();
    }

    initializeAdvisor();
});
