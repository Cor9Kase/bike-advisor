document.addEventListener('DOMContentLoaded', async () => { // Gjør om til async for å bruke await

    // --- 1. Data (hentes nå fra Google Apps Script) ---
    let BikeCatalog = { // Initialiser som et tomt objekt eller med default
        evoOriginal: []
    };
    // VIKTIG: Erstatt med din faktiske Google Apps Script Web App URL
    const bikeCatalogURL = 'https://script.google.com/macros/s/AKfycbyvNS_87zqRGqlwDi0nu14XblFBSH1BH4y5BbP_pKkbZJOxbXXfc-kukcT_Z8Mj9Ngu/exec';
    // ADVARSEL: API-nøkkelen bør ikke ligge åpent i klientsidekode i produksjon. Bruk en proxy-server.
    const mailchimpConfig = { apiKey: '52a4887211a02a289eb15b327553ccaa-us11', serverPrefix: 'us11', listId: '4a3e4d2c58' };
    // Eksempel på hvordan det kan se ut (IKKE BRUK DISSE VERDIENE):
    // const mailchimpConfig = { apiKey: '52a4887211a02a289eb15b327553ccaa-us11', serverPrefix: 'us11', listId: '4a3e4d2c58' };


    // --- DOM Referanser ---
    const advisorContainer = document.getElementById('bike-advisor-container');
    const advisorContent = document.getElementById('advisor-content');
    const questionsSection = document.getElementById('questions-section');
    const recommendationsSection = document.getElementById('recommendations-section');
    const initialLoader = document.getElementById('initial-loader');
    const initialLoaderText = document.getElementById('bike-loading-text-element');
    const bikeImageElement = initialLoader ? initialLoader.querySelector('.bike-loader-png') : null;
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
    
    // Mailchimp DOM referanser
    const newsletterSection = document.getElementById('newsletter-section');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmailInput = document.getElementById('newsletter-email');
    const newsletterConsentCheckbox = document.getElementById('newsletter-consent');
    const newsletterMessage = document.getElementById('newsletter-message');


    // Funksjon for å hente sykkeldata
    async function fetchBikeCatalog() {
        if (initialLoader) initialLoader.classList.remove('hidden');
        if (questionsSection) questionsSection.classList.add('hidden');
        try {
            const response = await fetch(bikeCatalogURL);
            if (!response.ok) { 
                const errorText = `HTTP error! status: ${response.status}, ${await response.text()}`;
                console.error("Fetch error details:", errorText);
                throw new Error(errorText); // Kast feil for å bli fanget av catch-blokken
            }
            const data = await response.json();
            if (data.error) { // Håndterer feil returnert fra Google Apps Script
                throw new Error(`Feil fra Google Apps Script: ${data.message}`);
            }
            
            // Datatransformasjon for å sikre korrekte formater
            BikeCatalog.evoOriginal = data.map(bike => {
                // Sikrer at features er et array
                if (bike.features && typeof bike.features === 'string') {
                    try {
                        const parsedFeatures = JSON.parse(bike.features); // Prøv å parse hvis det er en JSON-array-streng
                        bike.features = Array.isArray(parsedFeatures) ? parsedFeatures : (parsedFeatures ? [String(parsedFeatures)] : []);
                    } catch (e) {
                        // Hvis parsing feiler, splitt på komma
                        bike.features = bike.features.split(',').map(f => f.trim()).filter(f => f);
                    }
                } else if (!Array.isArray(bike.features)) {
                    bike.features = bike.features ? [String(bike.features)] : []; // Konverter enkeltverdi til array
                }

                // Sikrer at purpose er et array
                if (bike.purpose && typeof bike.purpose === 'string') {
                    bike.purpose = bike.purpose.split(',').map(p => p.trim()).filter(p => p);
                } else if (!Array.isArray(bike.purpose)) {
                    bike.purpose = bike.purpose ? [String(bike.purpose)] : [];
                }

                // Sikrer at frame_types er et array
                if (bike.frame_types && typeof bike.frame_types === 'string') {
                    bike.frame_types = bike.frame_types.split(',').map(ft => ft.trim()).filter(ft => ft);
                } else if (!Array.isArray(bike.frame_types)) {
                    bike.frame_types = bike.frame_types ? [String(bike.frame_types)] : [];
                }

                // Konverter distance_km til et array av tall [min, max]
                if (bike.distance_km && typeof bike.distance_km === 'string') {
                    const parts = bike.distance_km.replace('+', '-Infinity').split('-').map(p => parseInt(p.trim(), 10));
                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                        bike.distance_km = parts;
                    } else if (parts.length === 1 && !isNaN(parts[0])) { // For "50+" type verdier (nå håndtert av replace)
                        bike.distance_km = [parts[0], Infinity];
                    } else {
                        bike.distance_km = [0,0]; // Default eller feilverdi
                    }
                } else if (!Array.isArray(bike.distance_km) || bike.distance_km.length !== 2) {
                     bike.distance_km = [0,0]; // Default hvis formatet er feil
                }
                return bike;
            });
            console.log("Sykkelkatalog lastet fra Google Sheet:", BikeCatalog.evoOriginal.length, "sykler funnet.");
            return true; // Indikerer suksess
        } catch (error) {
            console.error("Feil ved henting av sykkelkatalog:", error);
            if (initialLoaderText) initialLoaderText.textContent = 'Kunne ikke laste sykkeldata. Prøv igjen senere.';
            if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none'; // Skjul bilde ved feil
            if (initialLoader) initialLoader.classList.remove('hidden'); // Sørg for at feilmeldingen vises
            if(questionsSection) questionsSection.classList.add('hidden');
            return false; // Indikerer feil
        } finally {
             // Skjul loaderen kun hvis det ikke er en feilmelding og lasting var vellykket
             if (initialLoader && BikeCatalog.evoOriginal.length > 0 && (!initialLoaderText || !initialLoaderText.textContent.startsWith('Kunne ikke laste'))) {
                initialLoader.classList.add('hidden');
             }
             // Vis spørsmålsseksjonen hvis katalogen er lastet og har innhold
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
    let relaxedSearchPerformed = false; // For å spore om et "avslappet" søk er utført

    // --- Steps definisjon ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' } // Dette trinnet vises kun hvis 'transport' er valgt for 'purpose'
    ];
    let totalSteps; // Totalt antall synlige trinn

    // --- Hjelpefunksjoner ---
    function getStepDefinition(stepNum) { let visibleStepIndex = 0; for (const stepDef of steps) { const isConditional = typeof stepDef.condition === 'function'; if (!isConditional || stepDef.condition()) { visibleStepIndex++; if (visibleStepIndex === stepNum) { return stepDef; } } } return null; }
    function getLabelById(optionsArray, id) { if (!optionsArray || !id) return `[mangler data]`; const option = optionsArray.find(opt => opt.id === id); return option ? option.label : `[${id}]`; }
    function updateProgress() { const currentVisibleStep = calculateCurrentVisibleStep(); const totalVisibleSteps = calculateTotalVisibleSteps(); const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0; if (progressBar) progressBar.style.width = `${Math.min(100, progressPercentage)}%`; if (progressText) progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`; }
    function calculateCurrentVisibleStep() { let visibleStepCount = 0; let logicalStepIndex = 0; while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) { const stepDef = steps[logicalStepIndex]; if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; } logicalStepIndex++; } const totalVisible = calculateTotalVisibleSteps(); if (currentStep > steps.length && totalVisible > 0) { return totalVisible; } return Math.min(Math.max(1, visibleStepCount), totalVisible > 0 ? totalVisible : 1); }
    function calculateTotalVisibleSteps() { let totalVisible = 0; steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } }); return totalVisible; }

    // --- Rendering Funksjoner ---
     function renderOptions() {
         const currentVisibleStepNum = calculateCurrentVisibleStep();
         if (currentStep > steps.length) { // Hvis vi er forbi siste logiske trinn
             if (!showRecommendationsView) { generateAndShowRecommendations(); }
             return;
         }
         const stepDef = getStepDefinition(currentVisibleStepNum);
         if (!stepDef) { // Fallback hvis ingen stepDef funnet
             if (!showRecommendationsView) { generateAndShowRecommendations(); }
             return;
         }
         if (stepTitle) stepTitle.textContent = stepDef.title;
         if (stepOptions) {
             stepOptions.innerHTML = ''; // Tøm tidligere valg
             stepDef.options.forEach((option) => {
                 const button = document.createElement('button');
                 button.classList.add('option-button');
                 if(option.className) { button.classList.add(option.className); }
                 button.dataset.value = option.id;
                 // Håndterer bildevisning for cargo-type knapper
                 if (option.className === 'cargo-type') {
                    button.innerHTML = `
                        ${option.image ? `<img src="${option.image}" alt="${option.label}" onerror="this.style.display='none'; this.nextSibling.style.marginTop='0';">` : ''}
                        <div>
                            <div>${option.label}</div>
                            ${option.description ? `<div class="description">${option.description}</div>` : ''}
                        </div>`;
                 } else {
                    button.innerHTML = `
                        <div>${option.label}</div>
                        ${option.description ? `<div class="description">${option.description}</div>` : ''}`;
                 }
                 if (selections[stepDef.id] === option.id) { button.classList.add('selected'); }
                 button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id));
                 stepOptions.appendChild(button);
             });
         }
         updateProgress();
     }
    function renderSentence(targetElement) { const createSpan = (selectionValue, stepId, placeholderText) => { const stepDef = steps.find(s => s.id === stepId); if (!stepDef) return `<span class="placeholder">[${stepId}?]</span>`; const isActive = !stepDef.condition || stepDef.condition(); if (selectionValue && isActive) { return `<span class="selected-value">${getLabelById(stepDef.options, selectionValue)}</span>`; } else if (isActive) { return `<span class="placeholder">${placeholderText}</span>`; } return ''; }; let sentenceParts = []; const purposeSpan = createSpan(selections.purpose, 'purpose', 'bruksområde'); if (purposeSpan) sentenceParts.push(`Jeg ser etter en sykkel for ${purposeSpan}.`); const distanceSpan = createSpan(selections.distance, 'distance', 'reiseavstand'); if (distanceSpan) sentenceParts.push(`Den bør passe til ${distanceSpan} per tur.`); const cargoSpan = createSpan(selections.cargo, 'cargo', 'lastemengde'); if (cargoSpan) sentenceParts.push(`Jeg trenger å frakte ${cargoSpan}.`); const cargoLocationSpan = createSpan(selections.cargoLocation, 'cargoLocation', 'lastetype'); const cargoLocStepDef = steps.find(s => s.id === 'cargoLocation'); const cargoLocIsActive = cargoLocStepDef && (!cargoLocStepDef.condition || cargoLocStepDef.condition()); if (cargoLocIsActive && selections.cargoLocation) { sentenceParts.push(`Jeg ser for meg en ${cargoLocationSpan} sykkel.`); } const frameTypeSpan = createSpan(selections.frameType, 'frameType', 'rammetype'); if (frameTypeSpan) sentenceParts.push(`Jeg foretrekker en ramme med ${frameTypeSpan}.`); if (targetElement) targetElement.innerHTML = `<p>${sentenceParts.join(' ').replace(/\s{2,}/g, ' ')}</p>`; }
    function renderRecommendations() { if (!recommendationsOutput) return; recommendationsOutput.innerHTML = ''; if (recommendations.length === 0 && !relaxedSearchPerformed) { recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box"><h3>Ingen perfekt match funnet</h3><p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100% blant våre anbefalte modeller akkurat nå.</p><h4>Hva nå?</h4><ul><li>Prøv å gå tilbake og justere ett eller flere av valgene dine.</li><li>Vi hjelper deg gjerne personlig! <a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-contact-link">Kontakt oss</a> for full oversikt og veiledning, eller ring oss på <a href="tel:+4723905555" id="track-no-results-call-link">23 90 55 55</a>.</li></ul></div>`; return; } else if (recommendations.length === 0 && relaxedSearchPerformed) { recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box"><h3>Fant ingen modeller</h3><p>Selv med justerte søkekriterier fant vi ingen passende modeller.</p><h4>Vi hjelper deg!</h4><p><a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-relaxed-contact-link">Kontakt oss</a> gjerne for personlig veiledning, eller ring oss direkte på <a href="tel:+4723905555" id="track-no-results-relaxed-call-link">23 90 55 55</a>.</p></div>`; return; } recommendations.forEach((bike, index) => { const card = document.createElement('div'); card.classList.add('recommendation-card'); let badgeText = ''; if (relaxedSearchPerformed) { if (index === 0) badgeText = 'NÆRMESTE VALG'; else if (index === 1) badgeText = 'GODT ALTERNATIV'; else if (index === 2) badgeText = 'ALTERNATIV'; } else { if (index === 0) badgeText = 'TOPPVALG'; else if (index === 1) badgeText = 'GOD MATCH'; else if (index === 2) badgeText = 'ALTERNATIV'; } let childInfoHTML = ''; if (bike.maxChildren && bike.maxChildren > 0) { const t = bike.maxChildren === 1 ? "ett barn" : `${bike.maxChildren} barn`; childInfoHTML = `<p class="child-capacity-info"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1.1em; height: 1.1em; flex-shrink: 0;"><path fill-rule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clip-rule="evenodd" /></svg> Passer for opptil ${t}.</p>`; } let featuresHTML = ''; if(bike.features && Array.isArray(bike.features) && bike.features.length > 0) { featuresHTML = `<div class="recommendation-features"><h4><svg class="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Nøkkelegenskaper:</h4><ul>${bike.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`; } const imageLink = document.createElement('a'); imageLink.href = bike.productUrl || '#'; imageLink.target = '_blank'; imageLink.title = `Se detaljer for ${bike.name}`; imageLink.dataset.trackEvent = 'view_bike_details_image'; imageLink.dataset.bikeId = bike.id; imageLink.dataset.bikeName = bike.name; imageLink.innerHTML = `<img src="${bike.image || 'https://placehold.co/300x180/e9ecef/343a40?text=Bilde+mangler'}" alt="${bike.name || 'Sykkelbilde'}" class="recommendation-image" onerror="this.onerror=null;this.src='https://placehold.co/300x180/e9ecef/343a40?text=Bilde+feilet';">`; const imageContainer = document.createElement('div'); imageContainer.classList.add('recommendation-image-container'); imageContainer.appendChild(imageLink); const detailsButton = `<a href="${bike.productUrl || '#'}" target="_blank" class="button button-primary" data-track-event="view_bike_details_button" data-bike-id="${bike.id}" data-bike-name="${bike.name}">Se detaljer</a>`; card.innerHTML = `${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}${imageContainer.outerHTML}<div class="recommendation-content"><h3>${bike.name || 'Sykkelnavn mangler'}</h3>${childInfoHTML}<p class="description">${bike.description || 'Ingen beskrivelse tilgjengelig.'}</p>${featuresHTML}<div class="recommendation-footer"><div class="recommendation-price">${bike.price ? `<span class="price-label">Fra</span><span class="price-value">${bike.price}</span>` : ''}</div><div class="recommendation-buttons">${detailsButton}</div></div></div>`; recommendationsOutput.appendChild(card); }); }


    // --- updateView Funksjon ---
     function updateView() {
         totalSteps = calculateTotalVisibleSteps(); // Beregn totalt antall synlige trinn
         if (showRecommendationsView) {
             if(questionsSection) questionsSection.classList.add('hidden');
             if(recommendationsSection) recommendationsSection.classList.remove('hidden');
             if (contactEvoSection) { // Vis/skjul kontaktseksjon basert på om det finnes anbefalinger
                 if (recommendations.length > 0) { contactEvoSection.classList.remove('hidden'); }
                 else { contactEvoSection.classList.add('hidden'); }
             }
             if (newsletterSection) { // Vis/skjul nyhetsbrevseksjon
                if (recommendations.length > 0) {
                    newsletterSection.classList.remove('hidden');
                } else {
                    newsletterSection.classList.add('hidden');
                }
             }

         } else { // Hvis vi er i spørsmålsmodus
             if (BikeCatalog.evoOriginal && BikeCatalog.evoOriginal.length > 0) { // Vis spørsmål kun hvis katalog er lastet
                 if(questionsSection) questionsSection.classList.remove('hidden');
             } else {
                 if(questionsSection) questionsSection.classList.add('hidden'); // Skjul hvis katalog ikke er klar
             }
             if(recommendationsSection) recommendationsSection.classList.add('hidden');
             if (contactEvoSection) contactEvoSection.classList.add('hidden');
             if (newsletterSection) newsletterSection.classList.add('hidden');
             if(loadingIndicator) loadingIndicator.classList.add('hidden');
             if(recommendationsOutput) recommendationsOutput.classList.add('hidden');
             renderSentence(sentenceBuilder);
             renderOptions();
             const currentVisible = calculateCurrentVisibleStep();
             if(backButton) backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1); // Vis/skjul tilbakeknapp
         }
         updateProgress(); // Oppdater progressbar uansett
      }


    // --- Logikk for Anbefalinger ---
    function generateAndShowRecommendations() {
        relaxedSearchPerformed = false; // Nullstill for hvert nye søk
        showRecommendationsView = true;
        if(questionsSection) questionsSection.classList.add('hidden');
        if(recommendationsSection) {
            recommendationsSection.classList.remove('hidden');
            recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if(recommendationsOutput) recommendationsOutput.classList.add('hidden'); // Skjul gamle resultater
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        if (newsletterSection) newsletterSection.classList.add('hidden');
        if(loadingIndicator) loadingIndicator.classList.remove('hidden'); // Vis spinner
        renderSentence(summarySentenceFinal); // Oppdater oppsummeringssetningen

        setTimeout(() => { // Simulerer litt lastetid, kan fjernes
            const filterBikes = (relaxFrameType = false, relaxDistance = false, purposeOnly = false) => {
                let bikesToFilter = [...BikeCatalog.evoOriginal];

                // Filtrer på formål (purpose)
                if (selections.purpose && !purposeOnly) {
                    bikesToFilter = bikesToFilter.filter(bike => bike.purpose && Array.isArray(bike.purpose) && bike.purpose.includes(selections.purpose));
                } else if (purposeOnly && selections.purpose) { // Kun formål (for avslappet søk)
                    return bikesToFilter.filter(bike => bike.purpose && Array.isArray(bike.purpose) && bike.purpose.includes(selections.purpose));
                } else if (purposeOnly && !selections.purpose) { // Hvis ingen formål er valgt i purposeOnly-modus
                    return bikesToFilter;
                }

                if (!purposeOnly) { // Andre filtre kun hvis ikke purposeOnly
                    // Filtrer på distanse
                    if (selections.distance && !relaxDistance) {
                        let minRange = 0;
                        if (selections.distance === 'medium') minRange = 20;
                        else if (selections.distance === 'lang') minRange = 50;
                        bikesToFilter = bikesToFilter.filter(bike => bike.distance_km && Array.isArray(bike.distance_km) && bike.distance_km[1] >= minRange);
                    }
                    // Filtrer på lastekapasitet
                    if (selections.cargo) {
                        let cargoLevels = [];
                        if (selections.cargo === 'små') cargoLevels = ['small', 'medium', 'large', 'massive'];
                        else if (selections.cargo === 'store') cargoLevels = ['medium', 'large', 'massive'];
                        else if (selections.cargo === 'massiv') cargoLevels = ['large', 'massive'];
                        bikesToFilter = bikesToFilter.filter(bike => bike.cargo_capacity && cargoLevels.includes(bike.cargo_capacity));
                    }
                    // Filtrer på rammetype
                    if (selections.frameType && !relaxFrameType) {
                        let frameTypesToMatch = [];
                        if (selections.frameType === 'dypGjennomgang') frameTypesToMatch = ['low-step', 'cargo', 'cargo-longtail']; // Antar at lastesykler ofte har lavt innsteg
                        else if (selections.frameType === 'lavtTopprør') frameTypesToMatch = ['mid-step'];
                        else if (selections.frameType === 'høytTopprør') frameTypesToMatch = ['high-step'];
                        bikesToFilter = bikesToFilter.filter(bike => bike.frame_types && Array.isArray(bike.frame_types) && bike.frame_types.some(type => frameTypesToMatch.includes(type)));
                    }
                    // Filtrer på lasteplassering (hvis relevant)
                    const cargoLocationStep = steps.find(s => s.id === 'cargoLocation');
                    const cargoLocationAsked = !cargoLocationStep || !cargoLocationStep.condition || cargoLocationStep.condition();
                    if (cargoLocationAsked && selections.purpose === 'transport' && selections.cargoLocation) {
                        const locationToMatch = selections.cargoLocation === 'frontlaster' ? 'front' : 'rear';
                        bikesToFilter = bikesToFilter.filter(bike => bike.cargo_location === locationToMatch);
                    }
                }
                return bikesToFilter;
            };

            let potentialMatches = filterBikes(); // Første forsøk (strengt)

            if (potentialMatches.length === 0) { // Hvis ingen treff, prøv å slakke på rammetype
                potentialMatches = filterBikes(true, false); // Slakk på rammetype
                if (potentialMatches.length > 0) relaxedSearchPerformed = true;
            }
            if (potentialMatches.length === 0) { // Hvis fortsatt ingen treff, prøv kun på formål
                potentialMatches = filterBikes(false, false, true); // Kun formål
                 if (potentialMatches.length > 0) relaxedSearchPerformed = true;
            }
            // Sortering (kan utvides)
            potentialMatches.sort((a, b) => {
                // Prioriter sykler som matcher behov for barnetransport hvis relevant
                const inferChildNeed = selections.purpose === 'transport' || selections.cargo === 'massiv' || selections.cargo === 'store';
                const a_meets_child = (a.maxChildren && a.maxChildren > 0);
                const b_meets_child = (b.maxChildren && b.maxChildren > 0);

                if (inferChildNeed) {
                    if (a_meets_child && !b_meets_child) return -1;
                    if (!a_meets_child && b_meets_child) return 1;
                    if (a_meets_child && b_meets_child) { // Begge kan ha barn, sorter på antall
                        return (b.maxChildren || 0) - (a.maxChildren || 0);
                    }
                }
                // Enkel prissortering som fallback (lavest først) - kan fjernes/endres
                return (parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || Infinity) - (parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || Infinity);
            });

            recommendations = potentialMatches.slice(0, 3); // Ta de 3 beste
            console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (Relaxed: ${relaxedSearchPerformed})`));

            if(loadingIndicator) loadingIndicator.classList.add('hidden'); // Skjul spinner
            renderRecommendations(); // Vis anbefalingene
            if(recommendationsOutput) recommendationsOutput.classList.remove('hidden'); // Vis resultatcontainer
            
            // Oppdater synlighet for kontakt og nyhetsbrev basert på om det er resultater
            if (contactEvoSection) {
                if (recommendations.length > 0) { contactEvoSection.classList.remove('hidden'); }
                else { contactEvoSection.classList.add('hidden'); }
            }
            if (newsletterSection) {
                if (recommendations.length > 0) { newsletterSection.classList.remove('hidden'); }
                else { newsletterSection.classList.add('hidden'); }
            }
        }, 300); // Slutt på setTimeout
    }


    // --- Event Handlers ---
    function handleOptionSelect(stepId, value) { selections[stepId] = value; trackAdvisorEvent('option_selected', { step_id: stepId, selected_value: value, step_number: calculateCurrentVisibleStep() }); if (stepId === 'purpose' && value !== 'transport') { selections.cargoLocation = null; } currentStep++; let next = steps[currentStep - 1]; while(next && next.condition && !next.condition()) { if (selections[next.id] !== undefined) selections[next.id] = null; currentStep++; next = steps[currentStep - 1]; } totalSteps = calculateTotalVisibleSteps(); if (currentStep > steps.length) { trackAdvisorEvent('quiz_completed', selections); generateAndShowRecommendations(); } else { updateView(); } }
    function handleBack() { if (showRecommendationsView) { showRecommendationsView = false; let lastVisIdx = -1; for (let i = 0; i < steps.length; i++) { const s = steps[i]; if (!s.condition || s.condition()) { lastVisIdx = i; } } currentStep = lastVisIdx + 1; trackAdvisorEvent('navigation_back_from_results', { to_step: currentStep }); updateView(); } else if (currentStep > 1) { const fromStep = calculateCurrentVisibleStep(); currentStep--; let prev = steps[currentStep - 1]; while (currentStep > 1 && prev && prev.condition && !prev.condition()) { currentStep--; prev = steps[currentStep -1]; } trackAdvisorEvent('navigation_back', { from_step_visible: fromStep, to_step_visible: calculateCurrentVisibleStep() }); updateView(); } }
    function resetAdvisor() { trackAdvisorEvent('advisor_reset', { from_step: showRecommendationsView ? 'results' : calculateCurrentVisibleStep() }); currentStep = 1; selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null }; recommendations = []; showRecommendationsView = false; relaxedSearchPerformed = false; totalSteps = calculateTotalVisibleSteps(); if (contactEvoSection) contactEvoSection.classList.add('hidden'); if (newsletterSection) newsletterSection.classList.add('hidden'); if (newsletterMessage) newsletterMessage.textContent = ''; if (newsletterEmailInput) newsletterEmailInput.value = ''; if (newsletterConsentCheckbox) newsletterConsentCheckbox.checked = false; updateView(); }

    // --- Sporingsfunksjonalitet ---
    function trackAdvisorEvent(eventName, eventParameters) {
        console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {});
        // Eksempel på GTM dataLayer.push (kommentert ut)
        // window.dataLayer = window.dataLayer || [];
        // window.dataLayer.push({
        //     'event': `advisor_${eventName}`, // Prefiks for å skille fra andre hendelser
        //     ...eventParameters // Spre eventuelle ekstra parametere
        // });
    }

    // Event listener for klikk på sporings-elementer
    document.body.addEventListener('click', function(event) {
        const target = event.target;
        let tracked = false; // For å unngå dobbel sporing hvis elementer er nestet

        // Sporing for "Se detaljer" (bilde eller knapp)
        const detailsLink = target.closest('[data-track-event^="view_bike_details"]');
        if (detailsLink) {
            const bikeId = detailsLink.dataset.bikeId;
            const bikeName = detailsLink.dataset.bikeName;
            const elementType = detailsLink.dataset.trackEvent === 'view_bike_details_image' ? 'image' : 'button';
            trackAdvisorEvent('view_bike_details', {
                bike_id: bikeId,
                bike_name: bikeName,
                clicked_element: elementType,
                current_selections: { ...selections } // Inkluder valgene som førte til anbefalingen
            });
            tracked = true;
        }

        // Sporing for andre statiske klikkbare elementer
        const trackableStaticElement = target.closest('[id^="track-"]');
        if (trackableStaticElement && !tracked) {
            const elementId = trackableStaticElement.id;
            let eventName = 'unknown_static_click';
            let params = { element_id: elementId };

            if (elementId === 'track-contact-email-button') { eventName = 'contact_button_click'; params.contact_method = 'email_button_main'; }
            else if (elementId === 'track-call-button') { eventName = 'call_button_click'; params.contact_method = 'phone_button_main'; params.phone_number = trackableStaticElement.href; }
            else if (elementId === 'track-footer-contact-email-link') { eventName = 'footer_contact_link_click'; params.contact_method = 'email_link_footer'; }
            else if (elementId === 'track-footer-call-link') { eventName = 'footer_call_link_click'; params.contact_method = 'phone_link_footer'; params.phone_number = trackableStaticElement.href; }
            else if (elementId.startsWith('track-no-results')) {
                eventName = 'no_results_interaction';
                params.interaction_type = elementId.includes('contact') ? 'contact_link_click' : 'call_link_click';
                params.search_context = elementId.includes('relaxed') ? 'relaxed_search' : 'strict_search';
                params.contact_method = elementId.includes('call') ? 'phone' : 'contact_page_or_email';
            }
            trackAdvisorEvent(eventName, params);
        }
    });

    // --- Mailchimp påmeldingslogikk ---
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Forhindre standard skjemainnsending
            if (!newsletterEmailInput || !newsletterConsentCheckbox || !newsletterMessage) return;

            const email = newsletterEmailInput.value.trim();
            
            if (!newsletterConsentCheckbox.checked) { // Sjekk samtykke
                newsletterMessage.textContent = "Du må godta vilkårene for å motta e-post.";
                newsletterMessage.style.color = "#b71c1c"; // Rød feilmeldingfarge
                return;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Enkel e-postvalidering
                newsletterMessage.textContent = "Vennligst skriv inn en gyldig e-postadresse.";
                newsletterMessage.style.color = "#b71c1c";
                return;
            }
            
            newsletterMessage.textContent = "Sender...";
            newsletterMessage.style.color = "#495057"; // Standard meldingfarge

            try {
                await subscribeToMailchimp(email, recommendations);
                newsletterMessage.textContent = "Takk! Sykkelforslaget er på vei til din e-post.";
                newsletterMessage.style.color = "#198754"; // Grønn suksessfarge
                newsletterEmailInput.value = ""; // Tøm e-postfeltet
                newsletterConsentCheckbox.checked = false; // Nullstill avkrysningsboksen
                trackAdvisorEvent('newsletter_signup_success', { email: email, bike_recommendations: recommendations.map(b => b.name) });
            } catch (err) {
                console.error("Mailchimp subscribe failed:", err);
                newsletterMessage.textContent = "Noe gikk galt. Kunne ikke registrere e-posten. Prøv igjen.";
                newsletterMessage.style.color = "#b71c1c";
                trackAdvisorEvent('newsletter_signup_failed', { email: email, error: err.message || String(err) });
            }
        });
    }

    async function subscribeToMailchimp(email, recommendedBikes = []) {
        if (!mailchimpConfig.apiKey || mailchimpConfig.apiKey === 'DIN_MAILCHIMP_API_NØKKEL' ||
            !mailchimpConfig.serverPrefix || mailchimpConfig.serverPrefix === 'DIN_SERVER_PREFIX' ||
            !mailchimpConfig.listId || mailchimpConfig.listId === 'DIN_LISTE_ID') {
            console.error("Mailchimp konfigurasjon mangler eller er ikke satt.");
            throw new Error("Mailchimp er ikke konfigurert riktig.");
        }

        const tags = Array.isArray(recommendedBikes) ? 
                     recommendedBikes.map(b => b.name || b.model || b.title || b.bikeName).filter(Boolean) : [];
        
        const bodyData = {
            email_address: email,
            status: "subscribed", // For double opt-in, konfigurer dette i Mailchimp-listen.
                                  // Alternativt: "pending" for å tvinge dobbel opt-in via API.
        };
        if (tags.length > 0) { bodyData.tags = tags; }

        // ADVARSEL: Direkte API-kall med API-nøkkel på klientsiden er usikkert.
        // Bruk en server-side proxy i produksjon.
        // `https://cors-anywhere.herokuapp.com/` er en midlertidig løsning for testing.
        const mailchimpApiUrl = `https://${mailchimpConfig.serverPrefix}.api.mailchimp.com/3.0/lists/${mailchimpConfig.listId}/members/`;
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${mailchimpApiUrl}`; // Fjern cors-anywhere for produksjon med egen proxy

        console.log("Sending to Mailchimp via proxy:", JSON.stringify(bodyData));
        console.log("Mailchimp URL (via proxy):", proxyUrl);

        const response = await fetch(proxyUrl, { // Bytt til din proxy-URL i produksjon
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest", // Kreves av cors-anywhere
                "Authorization": `apikey ${mailchimpConfig.apiKey}` // For direkte kall / cors-anywhere. Proxyen håndterer dette ellers.
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ title: `Mailchimp API HTTP-feil: ${response.status}` }));
            console.error("Mailchimp API Error:", errorData);
            throw new Error(errorData.title || `Mailchimp API feil: ${response.status}`);
        }
        return await response.json();
    }


    // --- Initialisering av Rådgiveren ---
    async function initializeAdvisor() {
        const catalogLoaded = await fetchBikeCatalog(); // Hent sykkeldata

        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) { // Hvis lasting var vellykket og det finnes data
            totalSteps = calculateTotalVisibleSteps();
            // Sett opp event listeners for knapper
            if(backButton) backButton.addEventListener('click', handleBack);
            if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
            if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
            if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear(); // Sett årstall i footer
            trackAdvisorEvent('advisor_ui_ready');
            updateView(); // Vis første trinn
        } else if (catalogLoaded && BikeCatalog.evoOriginal.length === 0) { // Hvis lasting var vellykket, men ingen data
             if (initialLoaderText) initialLoaderText.textContent = 'Sykkelkatalogen er tom for øyeblikket. Prøv igjen senere.';
             if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
             if (initialLoader) initialLoader.classList.remove('hidden'); // Vis meldingen
             if(questionsSection) questionsSection.classList.add('hidden');
        } else { // Hvis lasting feilet (feilmelding håndteres i fetchBikeCatalog)
            if(questionsSection) questionsSection.classList.add('hidden');
        }
    }

    // Start rådgiveren
    initializeAdvisor();

}); // Slutt på DOMContentLoaded
