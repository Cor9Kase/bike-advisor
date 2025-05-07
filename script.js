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
    const stepTitle = document.getElementById('step-title'); // <- Viktig referanse
    const stepOptions = document.getElementById('step-options'); // <- Viktig referanse
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

        try {
            // ... (Fetch-logikk som før) ...
            const response = await fetch(bikeCatalogURL);
             if (!response.ok) { /* ... feilhåndtering ... */ throw new Error(`HTTP error! status: ${response.status}`);}
            const data = await response.json();
            if (data.error) { /* ... feilhåndtering ... */ throw new Error(`Feil fra Google Apps Script: ${data.message}`);}
            BikeCatalog.evoOriginal = data.map(bike => { /* ... mapping ... */ return bike; }); // Forenklet for lesbarhet
            console.log("Sykkelkatalog lastet fra Google Sheet:", BikeCatalog.evoOriginal.length, "sykler funnet.");
            return true;
        } catch (error) {
            console.error("Feil ved henting av sykkelkatalog:", error);
            if (initialLoader) { /* ... vis feilmelding ... */ }
            if(questionsSection) questionsSection.classList.add('hidden');
            return false;
        } finally {
             if (initialLoader && !initialLoader.querySelector('.error-message')) { initialLoader.classList.add('hidden'); }
             if(questionsSection && BikeCatalog.evoOriginal.length > 0) { questionsSection.classList.remove('hidden'); }
        }
    }

    // --- State ---
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;
    let relaxedSearchPerformed = false;

    // --- Steps definisjon ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];
    let totalSteps;

    // --- Hjelpefunksjoner ---
    // (Uendret)
    function getStepDefinition(stepNum) { let visibleStepIndex = 0; for (const stepDef of steps) { const isConditional = typeof stepDef.condition === 'function'; if (!isConditional || stepDef.condition()) { visibleStepIndex++; if (visibleStepIndex === stepNum) { return stepDef; } } } return null; } function getLabelById(optionsArray, id) { if (!optionsArray || !id) return `[mangler data]`; const option = optionsArray.find(opt => opt.id === id); return option ? option.label : `[${id}]`; } function updateProgress() { const currentVisibleStep = calculateCurrentVisibleStep(); const totalVisibleSteps = calculateTotalVisibleSteps(); const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0; if (progressBar) progressBar.style.width = `${Math.min(100, progressPercentage)}%`; if (progressText) progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`; } function calculateCurrentVisibleStep() { let visibleStepCount = 0; let logicalStepIndex = 0; while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) { const stepDef = steps[logicalStepIndex]; if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; } logicalStepIndex++; } const totalVisible = calculateTotalVisibleSteps(); if (currentStep > steps.length && totalVisible > 0) { return totalVisible; } return Math.min(Math.max(1, visibleStepCount), totalVisible > 0 ? totalVisible : 1); } function calculateTotalVisibleSteps() { let totalVisible = 0; steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } }); return totalVisible; }

    // --- Rendering Funksjoner ---
     function renderSentence(targetElement) { /* ... (uendret) ... */ }
     // ----- START: renderOptions med ekstra logging -----
     function renderOptions() {
         console.log("--- Entering renderOptions ---"); // NY LOGG
         console.log("DOM check: stepTitle exists?", !!stepTitle, "stepOptions exists?", !!stepOptions); // NY LOGG

         const currentVisibleStepNum = calculateCurrentVisibleStep();
         console.log("Current step (logical):", currentStep, "Current step (visible):", currentVisibleStepNum); // NY LOGG

         // Sjekk om vi er ferdige FØR vi prøver å hente stepDef
         if (currentStep > steps.length) {
             console.log("renderOptions: currentStep > steps.length, trying to generate recommendations.");
             if (!showRecommendationsView) { generateAndShowRecommendations(); }
             return;
         }

         const stepDef = getStepDefinition(currentVisibleStepNum);
         console.log("renderOptions: Found step definition?", stepDef); // NY LOGG

         if (!stepDef) {
             console.error("renderOptions: Could not find step definition for visible step:", currentVisibleStepNum);
             // Fallback hvis noe er galt med step-logikken
             if (!showRecommendationsView) { generateAndShowRecommendations(); }
             return;
         }

         if (stepTitle) {
             stepTitle.textContent = stepDef.title;
             console.log("renderOptions: Set stepTitle text to:", stepDef.title); // NY LOGG
         } else {
             console.error("renderOptions: stepTitle element not found!");
         }

         if (stepOptions) {
             stepOptions.innerHTML = ''; // Tøm tidligere valg
             console.log("renderOptions: Cleared stepOptions innerHTML."); // NY LOGG
         } else {
             console.error("renderOptions: stepOptions element not found!");
             return; // Avbryt hvis container for valg ikke finnes
         }

         // Generer og legg til knapper
         stepDef.options.forEach((option, index) => {
             try {
                const button = document.createElement('button');
                button.classList.add('option-button');
                if(option.className) { button.classList.add(option.className); }
                button.dataset.value = option.id;
                // ... (innerHTML-logikk som før) ...
                 if (option.className === 'cargo-type') { button.innerHTML = `${option.image ? `<img src="${option.image}" alt="${option.label}">` : ''}<div><div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}</div>`; } else { button.innerHTML = `<div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}`; }
                if (selections[stepDef.id] === option.id) { button.classList.add('selected'); }
                button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id));
                stepOptions.appendChild(button);
                // console.log(`renderOptions: Appended button ${index + 1}: ${option.label}`); // Kan legge til for detaljert sjekk
             } catch (e) {
                 console.error("Error creating/appending option button:", option.label, e); // NY LOGG ved feil
             }
         });
         console.log("renderOptions: Finished appending buttons."); // NY LOGG
         updateProgress();
         console.log("--- Exiting renderOptions ---"); // NY LOGG
     }
     // ----- SLUTT: renderOptions med ekstra logging -----

     function renderRecommendations() { /* ... (uendret, men med justert badge-logikk fra sist) ... */ }
    // (Innholdet i renderSentence og renderRecommendations er uendret fra forrige versjon)
    function renderSentence(targetElement) { const createSpan = (selectionValue, stepId, placeholderText) => { const stepDef = steps.find(s => s.id === stepId); if (!stepDef) return `<span class="placeholder">[${stepId}?]</span>`; const isActive = !stepDef.condition || stepDef.condition(); if (selectionValue && isActive) { return `<span class="selected-value">${getLabelById(stepDef.options, selectionValue)}</span>`; } else if (isActive) { return `<span class="placeholder">${placeholderText}</span>`; } return ''; }; let sentenceParts = []; const purposeSpan = createSpan(selections.purpose, 'purpose', 'bruksområde'); if (purposeSpan) sentenceParts.push(`Jeg ser etter en sykkel for ${purposeSpan}.`); const distanceSpan = createSpan(selections.distance, 'distance', 'reiseavstand'); if (distanceSpan) sentenceParts.push(`Den bør passe til ${distanceSpan} per tur.`); const cargoSpan = createSpan(selections.cargo, 'cargo', 'lastemengde'); if (cargoSpan) sentenceParts.push(`Jeg trenger å frakte ${cargoSpan}.`); const cargoLocationSpan = createSpan(selections.cargoLocation, 'cargoLocation', 'lastetype'); const cargoLocStepDef = steps.find(s => s.id === 'cargoLocation'); const cargoLocIsActive = cargoLocStepDef && (!cargoLocStepDef.condition || cargoLocStepDef.condition()); if (cargoLocIsActive && selections.cargoLocation) { sentenceParts.push(`Jeg ser for meg en ${cargoLocationSpan} sykkel.`); } const frameTypeSpan = createSpan(selections.frameType, 'frameType', 'rammetype'); if (frameTypeSpan) sentenceParts.push(`Jeg foretrekker en ramme med ${frameTypeSpan}.`); if (targetElement) targetElement.innerHTML = `<p>${sentenceParts.join(' ').replace(/\s{2,}/g, ' ')}</p>`; } function renderRecommendations() { if (!recommendationsOutput) return; recommendationsOutput.innerHTML = ''; if (recommendations.length === 0 && !relaxedSearchPerformed) { recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box"><h3>Ingen perfekt match funnet</h3><p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100% blant våre anbefalte modeller akkurat nå.</p><h4>Hva nå?</h4><ul><li>Prøv å gå tilbake og justere ett eller flere av valgene dine.</li><li>Vi hjelper deg gjerne personlig! <a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-contact-link">Kontakt oss</a> for full oversikt og veiledning, eller ring oss på <a href="tel:+4723905555" id="track-no-results-call-link">23 90 55 55</a>.</li></ul></div>`; return; } else if (recommendations.length === 0 && relaxedSearchPerformed) { recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box"><h3>Fant ingen modeller</h3><p>Selv med justerte søkekriterier fant vi ingen passende modeller.</p><h4>Vi hjelper deg!</h4><p><a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-relaxed-contact-link">Kontakt oss</a> gjerne for personlig veiledning, eller ring oss direkte på <a href="tel:+4723905555" id="track-no-results-relaxed-call-link">23 90 55 55</a>.</p></div>`; return; } recommendations.forEach((bike, index) => { const card = document.createElement('div'); card.classList.add('recommendation-card'); let badgeText = ''; if (relaxedSearchPerformed) { if (index === 0) badgeText = 'NÆRMESTE VALG'; else if (index === 1) badgeText = 'GODT ALTERNATIV'; else if (index === 2) badgeText = 'ALTERNATIV'; } else { if (index === 0) badgeText = 'TOPPVALG'; else if (index === 1) badgeText = 'GOD MATCH'; else if (index === 2) badgeText = 'ALTERNATIV'; } let childInfoHTML = ''; if (bike.maxChildren && bike.maxChildren > 0) { const t = bike.maxChildren === 1 ? "ett barn" : `${bike.maxChildren} barn`; childInfoHTML = `<p class="child-capacity-info"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1.1em; height: 1.1em; flex-shrink: 0;"><path fill-rule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clip-rule="evenodd" /></svg> Passer for opptil ${t}.</p>`; } let featuresHTML = ''; if(bike.features && bike.features.length > 0) { featuresHTML = `<div class="recommendation-features"><h4><svg class="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Nøkkelegenskaper:</h4><ul>${bike.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`; } const imageLink = document.createElement('a'); imageLink.href = bike.productUrl || '#'; imageLink.target = '_blank'; imageLink.title = `Se detaljer for ${bike.name}`; imageLink.dataset.trackEvent = 'view_bike_details_image'; imageLink.dataset.bikeId = bike.id; imageLink.dataset.bikeName = bike.name; imageLink.innerHTML = `<img src="${bike.image || 'https://via.placeholder.com/300x180.png?text=Bilde+mangler'}" alt="${bike.name}" class="recommendation-image">`; const imageContainer = document.createElement('div'); imageContainer.classList.add('recommendation-image-container'); imageContainer.appendChild(imageLink); const detailsButton = `<a href="${bike.productUrl || '#'}" target="_blank" class="button button-primary" data-track-event="view_bike_details_button" data-bike-id="${bike.id}" data-bike-name="${bike.name}">Se detaljer</a>`; card.innerHTML = `${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}${imageContainer.outerHTML}<div class="recommendation-content"><h3>${bike.name}</h3>${childInfoHTML}<p class="description">${bike.description || 'Ingen beskrivelse tilgjengelig.'}</p>${featuresHTML}<div class="recommendation-footer"><div class="recommendation-price">${bike.price ? `<span class="price-label">Fra</span><span class="price-value">${bike.price}</span>` : ''}</div><div class="recommendation-buttons">${detailsButton}</div></div></div>`; recommendationsOutput.appendChild(card); }); }


    // --- updateView Funksjon ---
     function updateView() {
         console.log("--- Entering updateView ---"); // NY LOGG
         console.log("Current step:", currentStep, "Show recommendations view?", showRecommendationsView); // NY LOGG

         totalSteps = calculateTotalVisibleSteps();
         console.log("Total visible steps calculated:", totalSteps); // NY LOGG

         if (showRecommendationsView) {
             console.log("updateView: Showing recommendations section.");
             if(questionsSection) questionsSection.classList.add('hidden');
             if(recommendationsSection) recommendationsSection.classList.remove('hidden');
             if (contactEvoSection) {
                 if (recommendations.length > 0) { contactEvoSection.classList.remove('hidden'); }
                 else { contactEvoSection.classList.add('hidden'); }
             }
         } else {
             console.log("updateView: Showing questions section.");
             // Bare vis spørsmål hvis katalogen er lastet OG IKKE tom
             if (BikeCatalog.evoOriginal && BikeCatalog.evoOriginal.length > 0) {
                 console.log("updateView: Catalog loaded and not empty, showing questions section.");
                 if(questionsSection) questionsSection.classList.remove('hidden');
             } else {
                 console.log("updateView: Catalog not ready or empty, hiding questions section.");
                 if(questionsSection) questionsSection.classList.add('hidden'); // Hold skjult hvis katalogen er tom/ikke lastet
             }

             if(recommendationsSection) recommendationsSection.classList.add('hidden');
             if (contactEvoSection) contactEvoSection.classList.add('hidden');
             if(loadingIndicator) loadingIndicator.classList.add('hidden');
             if(recommendationsOutput) recommendationsOutput.classList.add('hidden');

             console.log("updateView: Calling renderSentence.");
             renderSentence(sentenceBuilder); // Rendrer setningen
             console.log("updateView: Calling renderOptions.");
             renderOptions(); // VIKTIG: Rendrer alternativene for gjeldende trinn
             const currentVisible = calculateCurrentVisibleStep();
             if(backButton) backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1);
         }
         console.log("updateView: Calling updateProgress.");
         updateProgress(); // Oppdaterer progressbar uansett
         console.log("--- Exiting updateView ---"); // NY LOGG
      }


    // --- Logikk for Anbefalinger ---
     function generateAndShowRecommendations() { /* ... (uendret) ... */ }
    // (Innholdet er uendret fra forrige versjon)
    function generateAndShowRecommendations() { relaxedSearchPerformed = false; showRecommendationsView = true; if(questionsSection) questionsSection.classList.add('hidden'); if(recommendationsSection) { recommendationsSection.classList.remove('hidden'); recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); } if(recommendationsOutput) recommendationsOutput.classList.add('hidden'); if (contactEvoSection) contactEvoSection.classList.add('hidden'); if(loadingIndicator) loadingIndicator.classList.remove('hidden'); renderSentence(summarySentenceFinal); setTimeout(() => { const filterBikes = (relaxFrameType = false, relaxDistance = false, purposeOnly = false) => { let bikesToFilter = [...BikeCatalog.evoOriginal]; if (selections.purpose && !purposeOnly) { bikesToFilter = bikesToFilter.filter(bike => bike.purpose && bike.purpose.includes(selections.purpose)); } else if (purposeOnly && selections.purpose) { return bikesToFilter.filter(bike => bike.purpose && bike.purpose.includes(selections.purpose)); } else if (purposeOnly && !selections.purpose) { return bikesToFilter; } if (!purposeOnly) { if (selections.distance && !relaxDistance) { let min = 0; if (selections.distance === 'medium') min = 20; else if (selections.distance === 'lang') min = 50; bikesToFilter = bikesToFilter.filter(bike => bike.distance_km && bike.distance_km[1] >= min); } if (selections.cargo) { let cap = []; if (selections.cargo === 'små') cap = ['small', 'medium', 'large', 'massive']; else if (selections.cargo === 'store') cap = ['medium', 'large', 'massive']; else if (selections.cargo === 'massiv') cap = ['large', 'massive']; bikesToFilter = bikesToFilter.filter(bike => bike.cargo_capacity && cap.includes(bike.cargo_capacity)); } if (selections.frameType && !relaxFrameType) { let frames = []; if (selections.frameType === 'dypGjennomgang') frames = ['low-step', 'cargo', 'cargo-longtail']; else if (selections.frameType === 'lavtTopprør') frames = ['mid-step']; else if (selections.frameType === 'høytTopprør') frames = ['high-step']; bikesToFilter = bikesToFilter.filter(bike => bike.frame_types && bike.frame_types.some(type => frames.includes(type))); } const cargoLocStep = steps.find(s => s.id === 'cargoLocation'); const cargoLocAsked = !cargoLocStep || !cargoLocStep.condition || cargoLocStep.condition(); if (cargoLocAsked && selections.purpose === 'transport' && selections.cargoLocation) { const loc = selections.cargoLocation === 'frontlaster' ? 'front' : 'rear'; bikesToFilter = bikesToFilter.filter(bike => bike.cargo_location === loc); } } return bikesToFilter; }; let potentialMatches = filterBikes(); if (potentialMatches.length === 0) { potentialMatches = filterBikes(true); relaxedSearchPerformed = true; } if (potentialMatches.length === 0 && selections.purpose) { potentialMatches = filterBikes(false, false, true); relaxedSearchPerformed = true; } potentialMatches.sort((a, b) => { const inferChildNeed = selections.purpose === 'transport' || selections.purpose === 'family' || selections.cargo === 'massiv' || selections.cargo === 'store'; const meetsChildReq = (bike, inferNeed) => { if (!inferNeed) return true; return bike.maxChildren !== null && bike.maxChildren > 0; }; const a_meets_child = meetsChildReq(a, inferChildNeed); const b_meets_child = meetsChildReq(b, inferChildNeed); if (a_meets_child !== b_meets_child) { return a_meets_child ? -1 : 1; } const a_children = a.maxChildren ?? -1; const b_children = b.maxChildren ?? -1; if (a_children !== b_children && inferChildNeed) { return b_children - a_children; } if (selections.cargo === 'massiv' || selections.cargo === 'store') { const order = { 'small': 1, 'medium': 2, 'large': 3, 'massive': 4 }; const capA = order[a.cargo_capacity] || 0; const capB = order[b.cargo_capacity] || 0; if (capA !== capB) { return capB - capA; } } return 0; }); recommendations = potentialMatches.slice(0, 3); console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (Relaxed: ${relaxedSearchPerformed})`)); if(loadingIndicator) loadingIndicator.classList.add('hidden'); renderRecommendations(); if(recommendationsOutput) recommendationsOutput.classList.remove('hidden'); if (contactEvoSection) { if (recommendations.length > 0) { contactEvoSection.classList.remove('hidden'); } else { contactEvoSection.classList.add('hidden'); } } }, 300); }


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
        console.log("Initializing advisor..."); // NY LOGG
        const catalogLoaded = await fetchBikeCatalog();
        console.log("Catalog loaded status:", catalogLoaded); // NY LOGG

        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) {
            console.log("Catalog loaded successfully and contains bikes. Setting up UI."); // NY LOGG
            totalSteps = calculateTotalVisibleSteps();
            console.log("Total steps calculated:", totalSteps); // NY LOGG

            // Sett opp event listeners
            if(backButton) backButton.addEventListener('click', handleBack); else console.warn("Back button not found");
            if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor); else console.warn("Reset step button not found");
            if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor); else console.warn("Reset final button not found");
            if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear(); else console.warn("Current year span not found");

            trackAdvisorEvent('advisor_ui_ready');
            console.log("Calling initial updateView..."); // NY LOGG
            updateView(); // Kall for å vise første trinn
        } else if (catalogLoaded && BikeCatalog.evoOriginal.length === 0) {
            console.warn("Catalog loaded, but it is empty."); // NY LOGG
             if (initialLoader) { // Vis melding om tom katalog
                initialLoader.innerHTML = `<div class="error-message" style="width:100%;">Beklager, sykkelkatalogen er tom for øyeblikket. Prøv igjen senere.</div>`;
                initialLoader.classList.remove('hidden');
             }
            if(questionsSection) questionsSection.classList.add('hidden');
        } else {
             console.error("Catalog loading failed. Advisor UI not initialized."); // NY LOGG
            // Feilmelding er allerede vist av fetchBikeCatalog
        }
        console.log("Initialization finished."); // NY LOGG
    }

    // Kall initialiseringsfunksjonen
    initializeAdvisor();

}); // Slutt på DOMContentLoaded
