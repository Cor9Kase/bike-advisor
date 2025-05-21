document.addEventListener('DOMContentLoaded', async () => {

    // --- Konstanter ---
    // VIKTIG: Erstatt med din faktiske, publiserte Google Apps Script Web App URL
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwzdlesSiih3X8apQTgY-5LSashwfMXJ4MlVhx2KxBWQGX9GsSa4ptqVp9V8AMeo4ma/exec'; // ERSTATT DENNE HVIS DU HAR EN NY ETTER DEPLOYMENT

    // --- State Variabler ---
    let BikeCatalog = { evoOriginal: [] };
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;
    let relaxedSearchPerformed = false;
    let totalSteps;

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
    const contactEvoSection = document.getElementById('contact-evo-section'); // Antar denne finnes
    const newsletterSection = document.getElementById('newsletter-section');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterNameInput = document.getElementById('newsletter-name');
    const newsletterEmailInput = document.getElementById('newsletter-email');
    const newsletterConsentCheckbox = document.getElementById('newsletter-consent');
    const newsletterMessage = document.getElementById('newsletter-message');

    // --- Steps Definisjon (fra din opprinnelige fil) ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];

    // --- Hjelpefunksjoner (fra din opprinnelige fil) ---
    function getStepDefinition(stepNum) { let visibleStepIndex = 0; for (const stepDef of steps) { const isConditional = typeof stepDef.condition === 'function'; if (!isConditional || stepDef.condition()) { visibleStepIndex++; if (visibleStepIndex === stepNum) { return stepDef; } } } return null; }
    function getLabelById(optionsArray, id) { if (!optionsArray || !id) return `[mangler data]`; const option = optionsArray.find(opt => opt.id === id); return option ? option.label : `[${id}]`; }
    function updateProgress() { const currentVisibleStep = calculateCurrentVisibleStep(); const totalVisibleSteps = calculateTotalVisibleSteps(); const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0; if (progressBar) progressBar.style.width = `${Math.min(100, progressPercentage)}%`; if (progressText) progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`; }
    function calculateCurrentVisibleStep() { let visibleStepCount = 0; let logicalStepIndex = 0; while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) { const stepDef = steps[logicalStepIndex]; if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; } logicalStepIndex++; } const totalVisible = calculateTotalVisibleSteps(); if (currentStep > steps.length && totalVisible > 0) { return totalVisible; } return Math.min(Math.max(1, visibleStepCount), totalVisible > 0 ? totalVisible : 1); }
    function calculateTotalVisibleSteps() { let totalVisible = 0; steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } }); return totalVisible; }

    // --- Hent Sykkeldata (fra din opprinnelige fil) ---
    async function fetchBikeCatalog() {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('DIN_PUBLISERTE')) {
            console.error("GAS_WEB_APP_URL er ikke satt. Kan ikke hente sykkeldata.");
            if (initialLoaderText) initialLoaderText.textContent = 'Konfigurasjonsfeil. Kan ikke laste sykkeldata.';
            if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
            if (initialLoader) initialLoader.classList.remove('hidden');
            if (questionsSection) questionsSection.classList.add('hidden');
            return false;
        }
        if (initialLoader) initialLoader.classList.remove('hidden');
        if (questionsSection) questionsSection.classList.add('hidden');
        try {
            const response = await fetch(GAS_WEB_APP_URL, { method: 'GET', mode: 'cors' });
            if (!response.ok) {
                let errorDetails = `HTTP error! status: ${response.status}`;
                try { const errorText = await response.text(); errorDetails += `, ${errorText}`; } catch (e) { /* Ignorer */ }
                throw new Error(errorDetails);
            }
            const data = await response.json();
            if (data.error) { throw new Error(`Feil fra Google Apps Script (doGet): ${data.message}`); }
            BikeCatalog.evoOriginal = data;
            return true;
        } catch (error) {
            console.error("Feil ved henting av sykkelkatalog via Apps Script:", error);
            if (initialLoaderText) initialLoaderText.textContent = 'Kunne ikke laste sykkeldata. Prøv igjen senere.';
            if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
            if (initialLoader) initialLoader.classList.remove('hidden');
            if (questionsSection) questionsSection.classList.add('hidden');
            return false;
        } finally {
            if (initialLoader && BikeCatalog.evoOriginal.length > 0 && (!initialLoaderText || !initialLoaderText.textContent.startsWith('Kunne ikke laste'))) {
                initialLoader.classList.add('hidden');
            }
            if (questionsSection && BikeCatalog.evoOriginal.length > 0) {
                questionsSection.classList.remove('hidden');
            }
        }
    }

    // --- Rendering Funksjoner (fra din opprinnelige fil, forkortet for relevans) ---
    function renderOptions() { /* ... (som før) ... */ }
    function renderSentence(targetElement) { /* ... (som før) ... */ }
    function renderRecommendations() { /* ... (som før) ... */ }

    // --- Oppdater Visning (fra din opprinnelige fil) ---
    function updateView() { /* ... (som før) ... */ }

    // --- Generer Anbefalinger (fra din opprinnelige fil) ---
    function generateAndShowRecommendations() { /* ... (som før) ... */ }

    // --- Event Handlers (fra din opprinnelige fil) ---
    function handleOptionSelect(stepId, value) { /* ... (som før) ... */ }
    function handleBack() { /* ... (som før) ... */ }
    function resetAdvisor() { /* ... (som før, husk å tømme newsletterNameInput.value også) ... */
        trackAdvisorEvent('advisor_reset', { from_step: showRecommendationsView ? 'results' : calculateCurrentVisibleStep() });
        currentStep = 1;
        selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
        recommendations = [];
        showRecommendationsView = false;
        relaxedSearchPerformed = false;
        totalSteps = calculateTotalVisibleSteps();
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        if (newsletterSection) newsletterSection.classList.add('hidden');
        if (newsletterMessage) newsletterMessage.textContent = '';
        if (newsletterEmailInput) newsletterEmailInput.value = '';
        if (newsletterNameInput) newsletterNameInput.value = ''; // Tøm navnefeltet
        if (newsletterConsentCheckbox) newsletterConsentCheckbox.checked = false;
        updateView();
    }


    // --- Sporingsfunksjon (fra din opprinnelige fil) ---
    function trackAdvisorEvent(eventName, eventParameters) { console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {}); }
    // ... (resten av sporingsfunksjonen din) ...

    // --- Nyhetsbrev innsending med FormData ---
    async function sendNewsletterDataWithFormData(navn, email, recommendedBikes = []) {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('DIN_PUBLISERTE')) {
            console.error("GAS_WEB_APP_URL er ikke korrekt satt for nyhetsbrev.");
            throw new Error("Konfigurasjonsfeil for innsending (GAS URL mangler).");
        }

        const tags = Array.isArray(recommendedBikes) ?
            recommendedBikes.map(b => b.name || b.id || 'UkjentSykkel').filter(Boolean) : [];

        const formData = new FormData();
        formData.append('navn', navn);
        formData.append('email_address', email);
        formData.append('tags', tags.join(',')); // Send tags som en kommaseparert streng
        formData.append('action', 'saveNewsletter'); // Legg til en action for backend

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: "POST",
                mode: 'cors', // Viktig for å kunne lese responsen med doOptions på plass
                // IKKE sett Content-Type manuelt når du bruker FormData, nettleseren gjør det.
                body: formData
            });

            // Siden vi bruker mode: 'cors' og forventer at doOptions/doPost er korrekt satt opp,
            // kan vi prøve å parse svaret som JSON.
            const result = await response.json();

            if (!response.ok || !result.success) {
                console.error("Feil fra Apps Script (FormData):", result.message || `HTTP-feil: ${response.status}`);
                throw new Error(result.message || `Feil ved innsending: ${response.status}`);
            }
            console.log("Nyhetsbrevdata sendt (FormData) via GAS vellykket:", result);
            return result;
        } catch (error) {
            console.error('Feil under kall til Apps Script for nyhetsbrevpåmelding (FormData):', error);
            // Hvis feilen er pga. at response.json() feiler (f.eks. hvis svaret ikke er JSON),
            // kan det tyde på at CORS fortsatt ikke er 100% riktig satt opp for POST-svar,
            // eller at Apps Script returnerte noe uventet.
            if (error instanceof SyntaxError) { // Kan skje hvis responsen ikke er gyldig JSON
                 console.error("Svar fra server var ikke gyldig JSON. Sjekk Apps Script `doPost` og CORS-innstillinger for POST-svar.");
                 throw new Error("Ugyldig svar fra server. Innsending kan ha feilet.");
            }
            throw error; // Kast den opprinnelige feilen videre
        }
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!newsletterNameInput || !newsletterEmailInput || !newsletterConsentCheckbox || !newsletterMessage) return;

            const navn = newsletterNameInput.value.trim();
            const email = newsletterEmailInput.value.trim();

            if (!navn) {
                newsletterMessage.textContent = "Vennligst skriv inn navnet ditt.";
                newsletterMessage.style.color = "#b71c1c";
                return;
            }
            if (!newsletterConsentCheckbox.checked) {
                newsletterMessage.textContent = "Du må godta vilkårene for å motta e-post.";
                newsletterMessage.style.color = "#b71c1c";
                return;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                newsletterMessage.textContent = "Vennligst skriv inn en gyldig e-postadresse.";
                newsletterMessage.style.color = "#b71c1c";
                return;
            }

            newsletterMessage.textContent = "Sender...";
            newsletterMessage.style.color = "#495057";
            try {
                await sendNewsletterDataWithFormData(navn, email, recommendations);
                newsletterMessage.textContent = "Takk! Sykkelforslaget er på vei til din e-post.";
                newsletterMessage.style.color = "#198754";
                newsletterNameInput.value = "";
                newsletterEmailInput.value = "";
                newsletterConsentCheckbox.checked = false;
                trackAdvisorEvent('newsletter_signup_success', { navn: navn, email: email, bike_recommendations: recommendations.map(b => b.name) });
            } catch (err) {
                console.error("Innsending av nyhetsbrev feilet (FormData):", err);
                newsletterMessage.textContent = err.message || "Noe gikk galt. Kunne ikke registrere e-posten. Prøv igjen.";
                newsletterMessage.style.color = "#b71c1c";
                trackAdvisorEvent('newsletter_signup_failed', { navn: navn, email: email, error: err.message || String(err) });
            }
        });
    }

    // --- Initialisering ---
    async function initializeAdvisor() {
        const catalogLoaded = await fetchBikeCatalog();
        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) {
            totalSteps = calculateTotalVisibleSteps();
            if (backButton) backButton.addEventListener('click', handleBack);
            if (resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
            if (resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
            if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
            trackAdvisorEvent('advisor_ui_ready');
            updateView(); // Kall updateView her
        } else if (catalogLoaded && BikeCatalog.evoOriginal.length === 0) {
            if (initialLoaderText) initialLoaderText.textContent = 'Sykkelkatalogen er tom for øyeblikket. Prøv igjen senere.';
            if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
            if (initialLoader) initialLoader.classList.remove('hidden');
            if (questionsSection) questionsSection.classList.add('hidden');
        } else {
            if (questionsSection) questionsSection.classList.add('hidden');
        }
        // renderOptions og renderSentence kalles nå fra updateView, som kalles når data er lastet.
    }

    initializeAdvisor();
});
