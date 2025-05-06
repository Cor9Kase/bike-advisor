document.addEventListener('DOMContentLoaded', async () => { // Gjør om til async for å bruke await

    // --- 1. Data (hentes nå fra Google Apps Script) ---
    let BikeCatalog = { // Initialiser som et tomt objekt eller med default
        evoOriginal: []
    };
    // VIKTIG: Erstatt med din faktiske Google Apps Script Web App URL
    const bikeCatalogURL = 'https://script.google.com/macros/s/AKfycbyvNS_87zqRGqlwDi0nu14XblFBSH1BH4y5BbP_pKkbZJOxbXXfc-kukcT_Z8Mj9Ngu/exec';

    // --- DOM Referanser (før initialisering som kan trenge data) ---
    const advisorContainer = document.getElementById('bike-advisor-container');
    const advisorContent = document.getElementById('advisor-content'); // Referanse til innholds-div
    const questionsSection = document.getElementById('questions-section');
    const recommendationsSection = document.getElementById('recommendations-section');
    const initialLoader = document.getElementById('initial-loader'); // Referanse til den nye loaderen i HTML
    const initialLoaderText = document.getElementById('bike-loading-text-element'); // Referanse til teksten inni loaderen
    const bikeImageElement = initialLoader ? initialLoader.querySelector('.bike-loader-png') : null; // Referanse til PNG-bildet inni loaderen
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
    const loadingIndicator = document.getElementById('loading-indicator'); // Spinner for anbefalinger
    const contactEvoSection = document.getElementById('contact-evo-section');


    // Funksjon for å hente sykkeldata
    async function fetchBikeCatalog() {
        // Vis loader og skjul spørsmål
        if (initialLoader) initialLoader.classList.remove('hidden');
        if (questionsSection) questionsSection.classList.add('hidden');
        // Sørg for at wheelie-klassen er fjernet ved start (selv om den nå styres av CSS-animasjon)
        if (bikeImageElement) bikeImageElement.classList.remove('doing-a-wheelie'); // For sikkerhets skyld

        // Timer for Wheelie-effekt (fra tidligere, kan beholdes for moro skyld)
        // let wheelieTimer = null;
        // const wheelieDelay = 4000; // 4 sekunder før wheelie
        // wheelieTimer = setTimeout(() => {
        //     if (bikeImageElement && initialLoader && !initialLoader.classList.contains('hidden')) {
        //         console.log("Loading took a while, doing a wheelie!");
        //         bikeImageElement.classList.add('doing-a-wheelie');
        //     }
        // }, wheelieDelay);

        try {
            const response = await fetch(bikeCatalogURL);
            // clearTimeout(wheelieTimer); // Fjern hvis wheelie er permanent i CSS

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - Kunne ikke hente sykkelkatalog. Respons: ${errorData}`);
            }
            const data = await response.json();

            if (data.error) { // Sjekk for feilmelding fra Apps Script
                throw new Error(`Feil fra Google Apps Script: ${data.message}`);
            }

            // Behandle og valider hentet data
            BikeCatalog.evoOriginal = data.map(bike => {
                return {
                    id: String(bike.id || `unknown-id-${Math.random().toString(36).substr(2, 9)}`),
                    name: String(bike.name || "Ukjent sykkelnavn"),
                    purpose: Array.isArray(bike.purpose) ? bike.purpose : [],
                    description: String(bike.description || "Ingen beskrivelse tilgjengelig."),
                    features: Array.isArray(bike.features) ? bike.features : [],
                    price: String(bike.price || "Pris ikke tilgjengelig"),
                    image: String(bike.image || ""),
                    productUrl: String(bike.productUrl || "#"),
                    frame_types: Array.isArray(bike.frame_types) ? bike.frame_types : [],
                    speed_kmh: parseInt(bike.speed_kmh, 10) || 25,
                    cargo_capacity: String(bike.cargo_capacity || "unknown").toLowerCase(),
                    cargo_location: String(bike.cargo_location || "unknown").toLowerCase(),
                    distance_km: (Array.isArray(bike.distance_km) && bike.distance_km.length === 2) ? bike.distance_km.map(d => parseInt(d, 10) || 0) : [0,0],
                    maxChildren: parseInt(bike.maxChildren, 10) || 0,
                    preOrdered: typeof bike.preOrdered === 'boolean' ? bike.preOrdered : false
                };
            });
            console.log("Sykkelkatalog lastet fra Google Sheet:", BikeCatalog.evoOriginal.length, "sykler funnet.");
            return true; // Suksess
        } catch (error) {
            // clearTimeout(wheelieTimer); // Fjern hvis wheelie er permanent i CSS
            console.error("Feil ved henting av sykkelkatalog:", error);
            // Vis feilmelding i loader-diven
            if (initialLoader) {
                initialLoader.innerHTML = `<div class="error-message" style="width:100%;">
                    Beklager, det oppstod en feil under lasting av sykkeldata. Prøv å laste siden på nytt. <br><small>${error.message}</small>
                </div>`;
                initialLoader.classList.remove('hidden'); // Sørg for at feilmeldingen er synlig
            }
            if(questionsSection) questionsSection.classList.add('hidden'); // Hold spørsmål skjult ved feil
            return false; // Feil
        } finally {
            // clearTimeout(wheelieTimer); // Fjern hvis wheelie er permanent i CSS
            // if (bikeImageElement) bikeImageElement.classList.remove('doing-a-wheelie'); // Fjern hvis wheelie er permanent i CSS

            // Skjul loader KUN hvis det IKKE ble vist en feilmelding inni den
             if (initialLoader && !initialLoader.querySelector('.error-message')) {
                 initialLoader.classList.add('hidden');
             }
            // Vis spørsmål igjen hvis lasting var vellykket OG det finnes sykler
            if(questionsSection && BikeCatalog.evoOriginal.length > 0) {
                 questionsSection.classList.remove('hidden');
            }
        }
    }

    // --- State ---
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;
    let relaxedSearchPerformed = false; // Definert globalt

    // --- Steps definisjon ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];
    let totalSteps; // Initialiseres i initializeAdvisor

    // --- Hjelpefunksjoner ---
    function getStepDefinition(stepNum) { /* ... */ }
    function getLabelById(optionsArray, id) { /* ... */ }
    function updateProgress() { /* ... */ }
    function calculateCurrentVisibleStep() { /* ... */ }
    function calculateTotalVisibleSteps() { /* ... */ }
    // (Innholdet i hjelpefunksjonene er uendret)
    function getStepDefinition(stepNum) { let visibleStepIndex = 0; for (const stepDef of steps) { const isConditional = typeof stepDef.condition === 'function'; if (!isConditional || stepDef.condition()) { visibleStepIndex++; if (visibleStepIndex === stepNum) { return stepDef; } } } return null; } function getLabelById(optionsArray, id) { if (!optionsArray || !id) return `[mangler data]`; const option = optionsArray.find(opt => opt.id === id); return option ? option.label : `[${id}]`; } function updateProgress() { const currentVisibleStep = calculateCurrentVisibleStep(); const totalVisibleSteps = calculateTotalVisibleSteps(); const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0; if (progressBar) progressBar.style.width = `${Math.min(100, progressPercentage)}%`; if (progressText) progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`; } function calculateCurrentVisibleStep() { let visibleStepCount = 0; let logicalStepIndex = 0; while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) { const stepDef = steps[logicalStepIndex]; if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; } logicalStepIndex++; } const totalVisible = calculateTotalVisibleSteps(); if (currentStep > steps.length && totalVisible > 0) { return totalVisible; } return Math.min(Math.max(1, visibleStepCount), totalVisible > 0 ? totalVisible : 1); } function calculateTotalVisibleSteps() { let totalVisible = 0; steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } }); return totalVisible; }


    // --- Rendering Funksjoner ---
     function renderSentence(targetElement) { /* ... */ }
     function renderOptions() { /* ... */ }
     // ----- START: OPPDATERT renderRecommendations -----
     function renderRecommendations() {
        if (!recommendationsOutput) return;
        recommendationsOutput.innerHTML = ''; // Tøm tidligere

        // Meldinger for INGEN resultater i det hele tatt (beholdes)
        if (recommendations.length === 0 && !relaxedSearchPerformed) {
             recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box">
                <h3>Ingen perfekt match funnet</h3>
                <p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100% blant våre anbefalte modeller akkurat nå.</p>
                <h4>Hva nå?</h4>
                <ul>
                    <li>Prøv å gå tilbake og justere ett eller flere av valgene dine.</li>
                    <li>Vi hjelper deg gjerne personlig! <a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-contact-link">Kontakt oss</a> for full oversikt og veiledning, eller ring oss på <a href="tel:+4723905555" id="track-no-results-call-link">23 90 55 55</a>.</li>
                </ul>
            </div>`;
             return;
         } else if (recommendations.length === 0 && relaxedSearchPerformed) {
              recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box">
                <h3>Fant ingen modeller</h3>
                <p>Selv med justerte søkekriterier fant vi ingen passende modeller.</p>
                <h4>Vi hjelper deg!</h4>
                <p><a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-relaxed-contact-link">Kontakt oss</a> gjerne for personlig veiledning, eller ring oss direkte på <a href="tel:+4723905555" id="track-no-results-relaxed-call-link">23 90 55 55</a>.</p>
            </div>`;
             return;
         }

         // Fjernet <p>-notisen om at søket var avslappet

         // Loop gjennom anbefalingene og lag kort
         recommendations.forEach((bike, index) => {
             const card = document.createElement('div'); card.classList.add('recommendation-card');

             // Justert Badge-logikk
             let badgeText = '';
             if (relaxedSearchPerformed) {
                 // Badges når søket var "relaxed"
                 if (index === 0) badgeText = 'NÆRMESTE VALG';
                 else if (index === 1) badgeText = 'GODT ALTERNATIV';
                 else if (index === 2) badgeText = 'ALTERNATIV';
             } else {
                 // Badges når søket var et perfekt (strengt) treff
                 if (index === 0) badgeText = 'TOPPVALG';
                 else if (index === 1) badgeText = 'GOD MATCH';
                 else if (index === 2) badgeText = 'ALTERNATIV';
             }

             // Resten av kort-genereringen er uendret
             let childInfoHTML = ''; if (bike.maxChildren && bike.maxChildren > 0) { const t = bike.maxChildren === 1 ? "ett barn" : `${bike.maxChildren} barn`; childInfoHTML = `<p class="child-capacity-info"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1.1em; height: 1.1em; flex-shrink: 0;"><path fill-rule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clip-rule="evenodd" /></svg> Passer for opptil ${t}.</p>`; }
             let featuresHTML = ''; if(bike.features && bike.features.length > 0) { featuresHTML = `<div class="recommendation-features"><h4><svg class="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Nøkkelegenskaper:</h4><ul>${bike.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`; }

             const imageLink = document.createElement('a');
             imageLink.href = bike.productUrl || '#';
             imageLink.target = '_blank';
             imageLink.title = `Se detaljer for ${bike.name}`;
             imageLink.dataset.trackEvent = 'view_bike_details_image';
             imageLink.dataset.bikeId = bike.id;
             imageLink.dataset.bikeName = bike.name;
             imageLink.innerHTML = `<img src="${bike.image || 'https://via.placeholder.com/300x180.png?text=Bilde+mangler'}" alt="${bike.name}" class="recommendation-image">`;

             const imageContainer = document.createElement('div');
             imageContainer.classList.add('recommendation-image-container');
             imageContainer.appendChild(imageLink);

             const detailsButton = `<a href="${bike.productUrl || '#'}"
                                       target="_blank"
                                       class="button button-primary"
                                       data-track-event="view_bike_details_button"
                                       data-bike-id="${bike.id}"
                                       data-bike-name="${bike.name}">Se detaljer</a>`;

             card.innerHTML = `
                 ${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}
                 ${imageContainer.outerHTML}
                 <div class="recommendation-content">
                     <h3>${bike.name}</h3>
                     ${childInfoHTML}
                     <p class="description">${bike.description || 'Ingen beskrivelse tilgjengelig.'}</p>
                     ${featuresHTML}
                     <div class="recommendation-footer">
                         <div class="recommendation-price">${bike.price ? `<span class="price-label">Fra</span><span class="price-value">${bike.price}</span>` : ''}</div>
                         <div class="recommendation-buttons">${detailsButton}</div>
                     </div>
                 </div>`;
             recommendationsOutput.appendChild(card);
         });
     }
     // ----- SLUTT: OPPDATERT renderRecommendations -----


    // --- updateView Funksjon ---
    function updateView() {
        totalSteps = calculateTotalVisibleSteps();
        if (showRecommendationsView) {
            if(questionsSection) questionsSection.classList.add('hidden');
            if(recommendationsSection) recommendationsSection.classList.remove('hidden');
            if (contactEvoSection) {
                if (recommendations.length > 0) { contactEvoSection.classList.remove('hidden'); }
                else { contactEvoSection.classList.add('hidden'); }
            }
        } else {
            if (BikeCatalog.evoOriginal && BikeCatalog.evoOriginal.length > 0) {
                if(questionsSection) questionsSection.classList.remove('hidden');
            } else { if(questionsSection) questionsSection.classList.add('hidden'); }
            if(recommendationsSection) recommendationsSection.classList.add('hidden');
            if (contactEvoSection) contactEvoSection.classList.add('hidden');
            if(loadingIndicator) loadingIndicator.classList.add('hidden');
            if(recommendationsOutput) recommendationsOutput.classList.add('hidden');
            renderSentence(sentenceBuilder);
            renderOptions();
            const currentVisible = calculateCurrentVisibleStep();
            if(backButton) backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1);
        }
        updateProgress();
     }


    // --- Logikk for Anbefalinger ---
     function generateAndShowRecommendations() {
        relaxedSearchPerformed = false; // Reset flagget før hvert søk
        showRecommendationsView = true;
        if(questionsSection) questionsSection.classList.add('hidden');
        if(recommendationsSection) {
            recommendationsSection.classList.remove('hidden');
            recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if(recommendationsOutput) recommendationsOutput.classList.add('hidden');
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        if(loadingIndicator) loadingIndicator.classList.remove('hidden');
        renderSentence(summarySentenceFinal);

        setTimeout(() => { // Timeout for å vise spinner
            const filterBikes = (relaxFrameType = false, relaxDistance = false, purposeOnly = false) => {
                let bikesToFilter = [...BikeCatalog.evoOriginal];
                if (selections.purpose && !purposeOnly) { bikesToFilter = bikesToFilter.filter(bike => bike.purpose && bike.purpose.includes(selections.purpose)); }
                else if (purposeOnly && selections.purpose) { return bikesToFilter.filter(bike => bike.purpose && bike.purpose.includes(selections.purpose)); }
                else if (purposeOnly && !selections.purpose) { return bikesToFilter; }
                if (!purposeOnly) {
                    if (selections.distance && !relaxDistance) { let min = 0; if (selections.distance === 'medium') min = 20; else if (selections.distance === 'lang') min = 50; bikesToFilter = bikesToFilter.filter(bike => bike.distance_km && bike.distance_km[1] >= min); }
                    if (selections.cargo) { let cap = []; if (selections.cargo === 'små') cap = ['small', 'medium', 'large', 'massive']; else if (selections.cargo === 'store') cap = ['medium', 'large', 'massive']; else if (selections.cargo === 'massiv') cap = ['large', 'massive']; bikesToFilter = bikesToFilter.filter(bike => bike.cargo_capacity && cap.includes(bike.cargo_capacity)); }
                    if (selections.frameType && !relaxFrameType) { let frames = []; if (selections.frameType === 'dypGjennomgang') frames = ['low-step', 'cargo', 'cargo-longtail']; else if (selections.frameType === 'lavtTopprør') frames = ['mid-step']; else if (selections.frameType === 'høytTopprør') frames = ['high-step']; bikesToFilter = bikesToFilter.filter(bike => bike.frame_types && bike.frame_types.some(type => frames.includes(type))); }
                    const cargoLocStep = steps.find(s => s.id === 'cargoLocation'); const cargoLocAsked = !cargoLocStep || !cargoLocStep.condition || cargoLocStep.condition();
                    if (cargoLocAsked && selections.purpose === 'transport' && selections.cargoLocation) { const loc = selections.cargoLocation === 'frontlaster' ? 'front' : 'rear'; bikesToFilter = bikesToFilter.filter(bike => bike.cargo_location === loc); }
                }
                return bikesToFilter;
            };
            let potentialMatches = filterBikes();
            if (potentialMatches.length === 0) { potentialMatches = filterBikes(true); relaxedSearchPerformed = true; } // Prøv avslappet ramme
            if (potentialMatches.length === 0 && selections.purpose) { potentialMatches = filterBikes(false, false, true); relaxedSearchPerformed = true; } // Prøv kun formål

             potentialMatches.sort((a, b) => { // Sortering
                 const inferChildNeed = selections.purpose === 'transport' || selections.purpose === 'family' || selections.cargo === 'massiv' || selections.cargo === 'store';
                 const meetsChildReq = (bike, inferNeed) => { if (!inferNeed) return true; return bike.maxChildren !== null && bike.maxChildren > 0; };
                 const a_meets_child = meetsChildReq(a, inferChildNeed); const b_meets_child = meetsChildReq(b, inferChildNeed);
                 if (a_meets_child !== b_meets_child) { return a_meets_child ? -1 : 1; }
                 const a_children = a.maxChildren ?? -1; const b_children = b.maxChildren ?? -1;
                 if (a_children !== b_children && inferChildNeed) { return b_children - a_children; }
                 if (selections.cargo === 'massiv' || selections.cargo === 'store') { const order = { 'small': 1, 'medium': 2, 'large': 3, 'massive': 4 }; const capA = order[a.cargo_capacity] || 0; const capB = order[b.cargo_capacity] || 0; if (capA !== capB) { return capB - capA; } }
                 return 0;
             });

            recommendations = potentialMatches.slice(0, 3); // Ta de topp 3
            console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (Relaxed: ${relaxedSearchPerformed})`));

            if(loadingIndicator) loadingIndicator.classList.add('hidden');
            renderRecommendations(); // Kall rendering med de siste resultatene og flagget
            if(recommendationsOutput) recommendationsOutput.classList.remove('hidden');
            if (contactEvoSection) {
                if (recommendations.length > 0) { contactEvoSection.classList.remove('hidden'); }
                else { contactEvoSection.classList.add('hidden'); }
            }
        }, 300);
    }

    // --- Event Handlers ---
    function handleOptionSelect(stepId, value) { /* ... */ }
    function handleBack() { /* ... */ }
    function resetAdvisor() { /* ... */ }
    // (Innholdet i event handlers er uendret)
    function handleOptionSelect(stepId, value) { selections[stepId] = value; trackAdvisorEvent('option_selected', { step_id: stepId, selected_value: value, step_number: calculateCurrentVisibleStep() }); if (stepId === 'purpose' && value !== 'transport') { selections.cargoLocation = null; } currentStep++; let next = steps[currentStep - 1]; while(next && next.condition && !next.condition()) { if (selections[next.id] !== undefined) selections[next.id] = null; currentStep++; next = steps[currentStep - 1]; } totalSteps = calculateTotalVisibleSteps(); if (currentStep > steps.length) { trackAdvisorEvent('quiz_completed', selections); generateAndShowRecommendations(); } else { updateView(); } } function handleBack() { if (showRecommendationsView) { showRecommendationsView = false; let lastVisIdx = -1; for (let i = 0; i < steps.length; i++) { const s = steps[i]; if (!s.condition || s.condition()) { lastVisIdx = i; } } currentStep = lastVisIdx + 1; trackAdvisorEvent('navigation_back_from_results', { to_step: currentStep }); updateView(); } else if (currentStep > 1) { const fromStep = calculateCurrentVisibleStep(); currentStep--; let prev = steps[currentStep - 1]; while (currentStep > 1 && prev && prev.condition && !prev.condition()) { currentStep--; prev = steps[currentStep -1]; } trackAdvisorEvent('navigation_back', { from_step_visible: fromStep, to_step_visible: calculateCurrentVisibleStep() }); updateView(); } } function resetAdvisor() { trackAdvisorEvent('advisor_reset', { from_step: showRecommendationsView ? 'results' : calculateCurrentVisibleStep() }); currentStep = 1; selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null }; recommendations = []; showRecommendationsView = false; totalSteps = calculateTotalVisibleSteps(); if (contactEvoSection) contactEvoSection.classList.add('hidden'); updateView(); }


    // --- START: Sporingsfunksjonalitet ---
    function trackAdvisorEvent(eventName, eventParameters) {
        console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {});
        // Implementer sporing her
    }

    document.body.addEventListener('click', function(event) {
        // ... (sporingslogikk for klikk forblir den samme) ...
        const target = event.target; let tracked = false; const detailsLink = target.closest('[data-track-event^="view_bike_details"]'); if (detailsLink) { const bikeId = detailsLink.dataset.bikeId; const bikeName = detailsLink.dataset.bikeName; const elementType = detailsLink.dataset.trackEvent === 'view_bike_details_image' ? 'image' : 'button'; trackAdvisorEvent('view_bike_details', { bike_id: bikeId, bike_name: bikeName, clicked_element: elementType, current_selections: { ...selections } }); tracked = true; } const trackableStaticElement = target.closest('[id^="track-"]'); if (trackableStaticElement && !tracked) { const elementId = trackableStaticElement.id; let eventName = 'unknown_static_click'; let params = { element_id: elementId }; if (elementId === 'track-contact-email-button') { eventName = 'contact_button_click'; params.contact_method = 'email_button_main'; } else if (elementId === 'track-call-button') { eventName = 'call_button_click'; params.contact_method = 'phone_button_main'; params.phone_number = trackableStaticElement.href; } else if (elementId === 'track-footer-contact-email-link') { eventName = 'footer_contact_link_click'; params.contact_method = 'email_link_footer'; } else if (elementId === 'track-footer-call-link') { eventName = 'footer_call_link_click'; params.contact_method = 'phone_link_footer'; params.phone_number = trackableStaticElement.href; } else if (elementId.startsWith('track-no-results')) { eventName = 'no_results_interaction'; params.interaction_type = elementId.includes('contact') ? 'contact_link_click' : 'call_link_click'; params.search_context = elementId.includes('relaxed') ? 'relaxed_search' : 'strict_search'; params.contact_method = elementId.includes('call') ? 'phone' : 'contact_page_or_email'; } trackAdvisorEvent(eventName, params); }
    });
    // --- SLUTT: Sporingsfunksjonalitet ---

    // --- Initialisering av Rådgiveren ---
    async function initializeAdvisor() {
        const catalogLoaded = await fetchBikeCatalog();

        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) {
            totalSteps = calculateTotalVisibleSteps();

            if(backButton) backButton.addEventListener('click', handleBack);
            if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
            if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
            if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

            trackAdvisorEvent('advisor_ui_ready');
            updateView(); // Kall for å vise første trinn
        } else if (catalogLoaded && BikeCatalog.evoOriginal.length === 0) {
             if (initialLoader) { // Vis melding om tom katalog
                initialLoader.innerHTML = `<div class="error-message" style="width:100%;">Beklager, sykkelkatalogen er tom for øyeblikket. Prøv igjen senere.</div>`;
                initialLoader.classList.remove('hidden');
             }
            if(questionsSection) questionsSection.classList.add('hidden');
        }
        // Hvis catalogLoaded er false, er feilmelding allerede vist
    }

    // Kall initialiseringsfunksjonen
    initializeAdvisor();

}); // Slutt på DOMContentLoaded
