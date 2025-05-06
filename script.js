document.addEventListener('DOMContentLoaded', async () => { // Gjør om til async for å bruke await

    // --- 1. Data (hentes nå fra Google Apps Script) ---
    let BikeCatalog = { // Initialiser som et tomt objekt eller med default
        evoOriginal: []
    };
    // VIKTIG: Erstatt med din faktiske Google Apps Script Web App URL
    const bikeCatalogURL = 'https://script.google.com/macros/s/AKfycbwkrMM8FnzP3D8ts-w-WlvHLyGagH30gxwFVpWF8rmIrdBlB8fcfG0ukldLpHRdEmyx/exec';

    // --- DOM Referanser (før initialisering som kan trenge data) ---
    const advisorContainer = document.getElementById('bike-advisor-container');
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
    const loadingIndicator = document.getElementById('loading-indicator'); // Brukes for anbefalinger
    const contactEvoSection = document.getElementById('contact-evo-section');

    const initialLoadingMessageContainer = document.createElement('div'); // Container for lastemelding
    initialLoadingMessageContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; padding: 40px 20px; min-height: 150px; text-align: center; border: 1px solid #e9ecef; border-radius: 8px; background-color: #f8f9fa; margin-bottom: 30px;';
    const initialSpinner = document.createElement('div');
    initialSpinner.className = 'spinner'; // Bruk eksisterende spinner-klasse
    const initialLoadingText = document.createElement('p');
    initialLoadingText.className = 'loading-text'; // Bruk eksisterende loading-text-klasse
    initialLoadingText.textContent = 'Laster sykkeldata, vennligst vent...';
    initialLoadingText.style.marginLeft = '15px';
    initialLoadingMessageContainer.appendChild(initialSpinner);
    initialLoadingMessageContainer.appendChild(initialLoadingText);


    // Funksjon for å hente sykkeldata
    async function fetchBikeCatalog() {
        if (questionsSection && advisorContainer) { // Sørg for at questionsSection finnes før vi prøver å sette inn før den
             advisorContainer.insertBefore(initialLoadingMessageContainer, questionsSection);
             questionsSection.classList.add('hidden'); // Skjul spørsmål mens data lastes
        } else if (advisorContainer) { // Fallback hvis questionsSection ikke er klar
            advisorContainer.appendChild(initialLoadingMessageContainer);
        }


        try {
            const response = await fetch(bikeCatalogURL);
            if (!response.ok) {
                const errorData = await response.text(); // Prøv å få mer info ved feil
                throw new Error(`HTTP error! status: ${response.status} - Kunne ikke hente sykkelkatalog. Respons: ${errorData}`);
            }
            const data = await response.json();

            // Sjekk om dataen fra Apps Script inneholder en feilmelding (som vi definerte i Apps Script)
            if (data.error) {
                throw new Error(`Feil fra Google Apps Script: ${data.message}`);
            }

            BikeCatalog.evoOriginal = data.map(bike => {
                // Sikre at alle nødvendige felt har fornuftige defaults hvis de mangler fra sheet
                // (Apps Scriptet bør håndtere det meste av dette, men en ekstra sjekk her er bra)
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
            return true;
        } catch (error) {
            console.error("Feil ved henting av sykkelkatalog:", error);
            initialLoadingMessageContainer.innerHTML = `<div class="error-message" style="width:100%;">
                Beklager, det oppstod en feil under lasting av sykkeldata. Prøv å laste siden på nytt. <br><small>${error.message}</small>
            </div>`;
            // Ikke fjern initialLoadingMessageContainer her, den viser nå feilmeldingen
            if(questionsSection) questionsSection.classList.add('hidden'); // Hold spørsmål skjult
            return false;
        } finally {
            // Fjern kun hvis det ikke ble vist en feilmelding i den
            if (initialLoadingMessageContainer.querySelector && !initialLoadingMessageContainer.querySelector('.error-message')) {
                initialLoadingMessageContainer.remove();
            }
            if(questionsSection && BikeCatalog.evoOriginal.length > 0) questionsSection.classList.remove('hidden'); // Vis spørsmål igjen hvis lasting var vellykket
        }
    }

    // --- State ---
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;

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
    // ... (getStepDefinition, getLabelById, updateProgress, calculateCurrentVisibleStep, calculateTotalVisibleSteps forblir de samme)
    function getStepDefinition(stepNum) {
        let visibleStepIndex = 0;
        for (const stepDef of steps) {
            const isConditional = typeof stepDef.condition === 'function';
            if (!isConditional || stepDef.condition()) {
                visibleStepIndex++;
                if (visibleStepIndex === stepNum) { return stepDef; }
            }
        }
        return null;
     }
     function getLabelById(optionsArray, id) {
        if (!optionsArray || !id) return `[mangler data]`;
        const option = optionsArray.find(opt => opt.id === id);
        return option ? option.label : `[${id}]`;
     }
     function updateProgress() {
        const currentVisibleStep = calculateCurrentVisibleStep();
        const totalVisibleSteps = calculateTotalVisibleSteps(); // Sørg for at totalSteps er satt
        const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0;
        if (progressBar) progressBar.style.width = `${Math.min(100, progressPercentage)}%`;
        if (progressText) progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`;
     }
     function calculateCurrentVisibleStep() {
        let visibleStepCount = 0; let logicalStepIndex = 0;
        while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) {
            const stepDef = steps[logicalStepIndex];
            if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; }
            logicalStepIndex++;
        }
        const totalVisible = calculateTotalVisibleSteps();
        if (currentStep > steps.length && totalVisible > 0) { return totalVisible; } // Justert logikk
        return Math.min(Math.max(1, visibleStepCount), totalVisible > 0 ? totalVisible : 1); // Unngå 0 i nevner
     }
     function calculateTotalVisibleSteps() {
          let totalVisible = 0;
          steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } });
          return totalVisible;
     }

    // --- Rendering Funksjoner ---
    // ... (renderSentence, renderOptions, renderRecommendations forblir de samme)
     function renderSentence(targetElement) {
         const createSpan = (selectionValue, stepId, placeholderText) => {
              const stepDef = steps.find(s => s.id === stepId);
              if (!stepDef) return `<span class="placeholder">[${stepId}?]</span>`;
              const isActive = !stepDef.condition || stepDef.condition();
              if (selectionValue && isActive) { return `<span class="selected-value">${getLabelById(stepDef.options, selectionValue)}</span>`; }
              else if (isActive) { return `<span class="placeholder">${placeholderText}</span>`; }
              return '';
          };
          let sentenceParts = [];
          const purposeSpan = createSpan(selections.purpose, 'purpose', 'bruksområde'); if (purposeSpan) sentenceParts.push(`Jeg ser etter en sykkel for ${purposeSpan}.`);
          const distanceSpan = createSpan(selections.distance, 'distance', 'reiseavstand'); if (distanceSpan) sentenceParts.push(`Den bør passe til ${distanceSpan} per tur.`);
          const cargoSpan = createSpan(selections.cargo, 'cargo', 'lastemengde'); if (cargoSpan) sentenceParts.push(`Jeg trenger å fraakte ${cargoSpan}.`);
          const cargoLocationSpan = createSpan(selections.cargoLocation, 'cargoLocation', 'lastetype');
          const cargoLocStepDef = steps.find(s => s.id === 'cargoLocation'); const cargoLocIsActive = cargoLocStepDef && (!cargoLocStepDef.condition || cargoLocStepDef.condition());
          if (cargoLocIsActive && selections.cargoLocation) { sentenceParts.push(`Jeg ser for meg en ${cargoLocationSpan} sykkel.`); }
          const frameTypeSpan = createSpan(selections.frameType, 'frameType', 'rammetype'); if (frameTypeSpan) sentenceParts.push(`Jeg foretrekker en ramme med ${frameTypeSpan}.`);
          if (targetElement) targetElement.innerHTML = `<p>${sentenceParts.join(' ').replace(/\s{2,}/g, ' ')}</p>`;
     }
     function renderOptions() {
         const currentVisibleStepNum = calculateCurrentVisibleStep();
         if (currentStep > steps.length) { if (!showRecommendationsView) { generateAndShowRecommendations(); } return; }
         const stepDef = getStepDefinition(currentVisibleStepNum);
         if (!stepDef) { if (!showRecommendationsView) { generateAndShowRecommendations(); } return; }
         if (stepTitle) stepTitle.textContent = stepDef.title; 
         if (stepOptions) stepOptions.innerHTML = '';
         else return; // Avbryt hvis stepOptions ikke finnes

         stepDef.options.forEach(option => { 
             const button = document.createElement('button'); 
             button.classList.add('option-button'); 
             if(option.className) { button.classList.add(option.className); } 
             button.dataset.value = option.id; 
             if (option.className === 'cargo-type') { 
                 button.innerHTML = `${option.image ? `<img src="${option.image}" alt="${option.label}">` : ''}<div><div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}</div>`; 
             } else { 
                 button.innerHTML = `<div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}`; 
             } 
             if (selections[stepDef.id] === option.id) { button.classList.add('selected'); } 
             button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id)); 
             stepOptions.appendChild(button); 
         });
         updateProgress();
     }
     let relaxedSearchPerformed = false; // Sørg for at denne er definert globalt i scriptet
     function renderRecommendations() {
        if (!recommendationsOutput) return; // Sjekk om elementet finnes
        recommendationsOutput.innerHTML = '';
        if (recommendations.length === 0 && !relaxedSearchPerformed) {
             recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box">
                <h3>Ingen perfekt match funnet</h3>
                <p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100% blant våre anbefalte modeller akkurat nå.</p>
                <h4>Hva nå?</h4>
                <ul>
                    <li>Prøv å gå tilbake og justere ett eller flere av valgene dine.</li>
                    <li>Vi hjelper deg gjerne personlig! <a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-contact-link">Kontakt oss</a> for full oversikt og veiledning, eller ring oss på <a href="tel:+47EVOSNUMMERHER" id="track-no-results-call-link">EVOS TLF-NUMMER</a>.</li>
                </ul>
            </div>`; // HUSK Å ERSTATTE PLASSHOLDERE FOR TLF/URL
             return;
         } else if (recommendations.length === 0 && relaxedSearchPerformed) {
              recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box">
                <h3>Fant ingen modeller</h3>
                <p>Selv med justerte søkekriterier fant vi ingen passende modeller.</p>
                <h4>Vi hjelper deg!</h4>
                <p><a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-relaxed-contact-link">Kontakt oss</a> gjerne for personlig veiledning, eller ring oss direkte på <a href="tel:+47EVOSNUMMERHER" id="track-no-results-relaxed-call-link">EVOS TLF-NUMMER</a>.</p>
            </div>`; // HUSK Å ERSTATTE PLASSHOLDERE FOR TLF/URL
             return;
         }

         if (relaxedSearchPerformed) {
            const notice = document.createElement('p'); notice.textContent = "Ingen sykler passet 100% til alle dine valg, så her er de nærmeste alternativene:"; notice.style.cssText = 'font-size: 0.9em; font-style: italic; margin-bottom: 15px; color: #6c757d; text-align: left;'; recommendationsOutput.appendChild(notice);
         }

         recommendations.forEach((bike, index) => {
             const card = document.createElement('div'); card.classList.add('recommendation-card');
             let badgeText = ''; if (index === 0) badgeText = 'TOPPVALG'; else if (index === 1) badgeText = 'GOD MATCH'; else if (index === 2) badgeText = 'ALTERNATIV';
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


    // --- updateView, Logikk for Anbefalinger, Event Handlers, Sporingsfunksjonalitet ---
    // ... (Disse funksjonene forblir de samme som i forrige fullstendige script du fikk,
    //      generateAndShowRecommendations vil bruke BikeCatalog.evoOriginal som nå er fylt asynkront)
     function updateView() {
        totalSteps = calculateTotalVisibleSteps(); // Sørg for at totalSteps er oppdatert
        if (showRecommendationsView) {
            if(questionsSection) questionsSection.classList.add('hidden');
            if(recommendationsSection) recommendationsSection.classList.remove('hidden');
            if (contactEvoSection) {
                if (recommendations.length > 0) {
                    contactEvoSection.classList.remove('hidden');
                } else {
                    contactEvoSection.classList.add('hidden');
                }
            }
        } else {
            if(questionsSection) questionsSection.classList.remove('hidden');
            if(recommendationsSection) recommendationsSection.classList.add('hidden');
            if (contactEvoSection) contactEvoSection.classList.add('hidden');
            if(loadingIndicator) loadingIndicator.classList.add('hidden'); // Lasteindikator for anbefalinger
            if(recommendationsOutput) recommendationsOutput.classList.add('hidden');
            renderSentence(sentenceBuilder);
            renderOptions();
            const currentVisible = calculateCurrentVisibleStep();
            if(backButton) backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1);
        }
        updateProgress();
     }

    function generateAndShowRecommendations() {
        // console.log("Starter generering av anbefalinger med valg:", JSON.parse(JSON.stringify(selections)));
        relaxedSearchPerformed = false;

        showRecommendationsView = true;
        if(questionsSection) questionsSection.classList.add('hidden');
        if(recommendationsSection) {
            recommendationsSection.classList.remove('hidden');
            recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if(recommendationsOutput) recommendationsOutput.classList.add('hidden'); 
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        if(loadingIndicator) loadingIndicator.classList.remove('hidden'); // Lasteindikator for anbefalinger
        
        renderSentence(summarySentenceFinal);

        setTimeout(() => {
            // console.log("Utfører filtrering og sortering...");
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
            if (potentialMatches.length === 0) {
                potentialMatches = filterBikes(true); relaxedSearchPerformed = true;
            }
             if (potentialMatches.length === 0 && selections.purpose) { 
                 potentialMatches = filterBikes(false, false, true); relaxedSearchPerformed = true; 
             }

             potentialMatches.sort((a, b) => {
                 const inferChildNeed = selections.purpose === 'transport' || selections.purpose === 'family' || selections.cargo === 'massiv' || selections.cargo === 'store';
                 const meetsChildReq = (bike, inferNeed) => { if (!inferNeed) return true; return bike.maxChildren !== null && bike.maxChildren > 0; };
                 const a_meets_child = meetsChildReq(a, inferChildNeed); const b_meets_child = meetsChildReq(b, inferChildNeed);
                 if (a_meets_child !== b_meets_child) { return a_meets_child ? -1 : 1; }
                 const a_children = a.maxChildren ?? -1; const b_children = b.maxChildren ?? -1;
                 if (a_children !== b_children && inferChildNeed) { return b_children - a_children; }
                 if (selections.cargo === 'massiv' || selections.cargo === 'store') { const order = { 'small': 1, 'medium': 2, 'large': 3, 'massive': 4 }; const capA = order[a.cargo_capacity] || 0; const capB = order[b.cargo_capacity] || 0; if (capA !== capB) { return capB - capA; } }
                 return 0;
             });

            recommendations = potentialMatches.slice(0, 3);
            console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (ID: ${b.id}, Kids: ${b.maxChildren ?? 'N/A'})`));

            if(loadingIndicator) loadingIndicator.classList.add('hidden');
            renderRecommendations();
            if(recommendationsOutput) recommendationsOutput.classList.remove('hidden');
            if (contactEvoSection) { 
                if (recommendations.length > 0) {
                    contactEvoSection.classList.remove('hidden');
                } else {
                    contactEvoSection.classList.add('hidden');
                }
            }
        }, 500);
    }

    function handleOptionSelect(stepId, value) {
        selections[stepId] = value; 
        trackAdvisorEvent('option_selected', {
            step_id: stepId,
            selected_value: value,
            step_number: calculateCurrentVisibleStep() 
        });

        if (stepId === 'purpose' && value !== 'transport') { selections.cargoLocation = null; }
        currentStep++; let next = steps[currentStep - 1];
        while(next && next.condition && !next.condition()) { if (selections[next.id] !== undefined) selections[next.id] = null; currentStep++; next = steps[currentStep - 1]; }
        totalSteps = calculateTotalVisibleSteps();
        if (currentStep > steps.length) { 
            trackAdvisorEvent('quiz_completed', selections);
            generateAndShowRecommendations(); 
        } else { 
            updateView(); 
        }
     }
     function handleBack() {
         if (showRecommendationsView) {
             showRecommendationsView = false; let lastVisIdx = -1;
             for (let i = 0; i < steps.length; i++) { const s = steps[i]; if (!s.condition || s.condition()) { lastVisIdx = i; } }
             currentStep = lastVisIdx + 1; 
             trackAdvisorEvent('navigation_back_from_results', { to_step: currentStep });
             updateView();
         } else if (currentStep > 1) {
             const fromStep = calculateCurrentVisibleStep();
             currentStep--; let prev = steps[currentStep - 1];
             while (currentStep > 1 && prev && prev.condition && !prev.condition()) { currentStep--; prev = steps[currentStep -1]; }
             trackAdvisorEvent('navigation_back', { from_step_visible: fromStep, to_step_visible: calculateCurrentVisibleStep() });
             updateView();
         }
     }
     function resetAdvisor() {
        trackAdvisorEvent('advisor_reset', { from_step: showRecommendationsView ? 'results' : calculateCurrentVisibleStep() });
        currentStep = 1;
        selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
        recommendations = []; showRecommendationsView = false; totalSteps = calculateTotalVisibleSteps();
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        updateView();
     }

    function trackAdvisorEvent(eventName, eventParameters) {
        console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {});
        // Her implementeres Meta Pixel / GA4 kall
    }

    document.body.addEventListener('click', function(event) {
        const target = event.target;
        let tracked = false;

        const detailsLink = target.closest('[data-track-event^="view_bike_details"]');
        if (detailsLink) {
            const bikeId = detailsLink.dataset.bikeId;
            const bikeName = detailsLink.dataset.bikeName;
            const elementType = detailsLink.dataset.trackEvent === 'view_bike_details_image' ? 'image' : 'button';
            trackAdvisorEvent('view_bike_details', {
                bike_id: bikeId,
                bike_name: bikeName,
                clicked_element: elementType,
                current_selections: { ...selections }
            });
            tracked = true;
        }

        const trackableStaticElement = target.closest('[id^="track-"]');
        if (trackableStaticElement && !tracked) {
            const elementId = trackableStaticElement.id;
            let eventName = 'unknown_static_click';
            let params = { element_id: elementId };

            if (elementId === 'track-contact-email-button') {
                eventName = 'contact_button_click'; params.contact_method = 'email_button_main';
            } else if (elementId === 'track-call-button') {
                eventName = 'call_button_click'; params.contact_method = 'phone_button_main'; params.phone_number = trackableStaticElement.href;
            } else if (elementId === 'track-footer-contact-email-link') {
                eventName = 'footer_contact_link_click'; params.contact_method = 'email_link_footer';
            } else if (elementId === 'track-footer-call-link') {
                eventName = 'footer_call_link_click'; params.contact_method = 'phone_link_footer'; params.phone_number = trackableStaticElement.href;
            } else if (elementId.startsWith('track-no-results')) {
                eventName = 'no_results_interaction';
                params.interaction_type = elementId.includes('contact') ? 'contact_link_click' : 'call_link_click';
                params.search_context = elementId.includes('relaxed') ? 'relaxed_search' : 'strict_search';
                params.contact_method = elementId.includes('call') ? 'phone' : 'contact_page_or_email';
            }
            trackAdvisorEvent(eventName, params);
        }
    });


    // --- Initialisering av Rådgiveren ---
    async function initializeAdvisor() {
        const catalogLoaded = await fetchBikeCatalog();

        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) { // Sjekk også at vi faktisk fikk sykler
            totalSteps = calculateTotalVisibleSteps();
            
            if(backButton) backButton.addEventListener('click', handleBack);
            if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
            if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
            if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
            
            trackAdvisorEvent('advisor_ui_ready'); // Endret eventnavn
            updateView();
        } else if (catalogLoaded && BikeCatalog.evoOriginal.length === 0) {
            // Håndter tilfelle der katalogen lastes, men er tom
            initialLoadingMessageContainer.innerHTML = `<div class="error-message" style="width:100%;">
                Beklager, sykkelkatalogen er tom for øyeblikket. Prøv igjen senere.
            </div>`;
            if(questionsSection) questionsSection.classList.add('hidden');
        }
        // Hvis catalogLoaded er false, er feilmelding allerede vist av fetchBikeCatalog
    }

    initializeAdvisor();

}); // Slutt på DOMContentLoaded
