document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data (Fra React-eksempelet, justert litt) ---
    // VIKTIG: Bytt ut placeholder-URLer med ekte bilde-URLer!
    // VIKTIG: Bruk KUN Evo-sykler her. Dette er Riese & Müller / Tern eksempler.
    const BikeCatalog = {
        // OBS: Dette MÅ erstattes med Evo's sykler og deres egenskaper!
        // Eksempel på struktur for Evo:
         evoOriginal: [ // Eller kall det 'allBikes'
             {
                id: 'evo-flex',
                name: "Evo Flex",
                purpose: ['city', 'commute', 'compact'], // Bruksområder
                distance_km: [0, 40], // Min/maks typisk rekkevidde eller egnethet
                speed_kmh: 25, // 25 for pedelec, 45 for S-pedelec
                cargo_capacity: 'small', // 'none', 'small', 'medium', 'large'
                frame_types: ['low-step', 'mid-step'], // Tilgjengelige rammer
                cargo_location: null, // 'front', 'rear' (for lastesykler)
                description: "En kompakt og fleksibel bysykkel, perfekt for kortere turer og enkel oppbevaring.",
                features: ["Kompakt design", "Lett ramme", "Integrert batteri", "Enkel å manøvrere"],
                price: "24990 kr", // Eksempelpris
                image: "https://via.placeholder.com/300x180.png?text=Evo+Flex", // Bytt ut!
                productUrl: "#" // Bytt ut!
             },
             {
                id: 'evo-explore',
                name: "Evo Explore",
                purpose: ['trekking', 'commute', 'leisure'],
                distance_km: [20, 80],
                speed_kmh: 25,
                cargo_capacity: 'medium',
                frame_types: ['high-step', 'mid-step'],
                cargo_location: null,
                description: "Allsidig tursykkel som takler både asfalt og grusveier. God komfort for lengre turer.",
                features: ["Kraftig motor", "Stort batteri", "Komfortabel sittestilling", "Bagasjebærer"],
                price: "34990 kr",
                image: "https://via.placeholder.com/300x180.png?text=Evo+Explore", // Bytt ut!
                productUrl: "#" // Bytt ut!
             },
              {
                id: 'evo-cargo-king',
                name: "Evo Cargo King",
                purpose: ['transport', 'family', 'business'],
                distance_km: [10, 60],
                speed_kmh: 25,
                cargo_capacity: 'large', // Eller 'massive'
                frame_types: ['cargo'], // Egen type?
                cargo_location: 'front', // Eller 'rear' for longtail
                description: "Robust lastesykkel designet for å frakte tung last, barn eller varer.",
                features: ["Stor lastekapasitet", "Stabil ramme", "Kraftig motor for last", "Valgfritt tilbehør"],
                price: "49990 kr",
                image: "https://via.placeholder.com/300x180.png?text=Evo+Cargo+King", // Bytt ut!
                productUrl: "#" // Bytt ut!
             },
             // ... Legg til ALLE relevante EVO-sykler her med så mye data som mulig
        ],
        // Struktur fra React-eksempelet beholdes for inspirasjon, men vi bruker 'evoOriginal' som kilde
        byPurpose: {
            // Disse kan potensielt genereres fra 'evoOriginal' eller defineres manuelt hvis logikken krever det
            pendling: ['evo-explore', 'evo-flex'], // Referer til sykkel IDer
            bybruk: ['evo-flex'],
            terreng: [], // Legg til Evo terrengsykkel-IDer
            transport: ['evo-cargo-king'],
            allsidig: ['evo-explore'] // Eller en spesifikk modell?
        },
        // ... andre kategorier som byDistance, byFrame etc. kan også lages
        // men det er kanskje enklere å filtrere direkte på egenskapene i 'evoOriginal'
    };


    // --- 2. State Variabler ---
    let currentStep = 1;
    let totalSteps = 6; // Antall trinn totalt (juster etter dine spørsmål)
    let selections = {
        purpose: null, // 'pendling', 'bybruk', 'terreng', 'transport', 'allsidig'
        distance: null, // 'kort', 'medium', 'lang'
        bikeType: null, // 'standard', 'highSpeed'
        cargo: null, // 'små', 'store', 'massiv'
        frameType: null, // 'dypGjennomgang', 'lavtTopprør', 'høytTopprør'
        cargoLocation: null // 'frontlaster', 'langhale' (kun for 'transport')
    };
    let recommendations = [];
    let showRecommendationsView = false;


    // --- 3. DOM Referanser ---
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


    // --- 4. Definisjoner for Trinn og Alternativer ---
    const steps = [
        { // Trinn 1
            id: 'purpose',
            title: 'Hva skal sykkelen primært brukes til?',
            options: [
                { id: 'pendling', label: 'Turer eller pendling til jobb' },
                { id: 'bybruk', label: 'Være ute i byen / Koseturer' },
                { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' },
                { id: 'transport', label: 'Transportere mye (varer/barn)' },
                { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } // Endret fra 'Spar plass'
            ]
        },
        { // Trinn 2
            id: 'distance',
            title: 'Hvilken reiseavstand planlegger du regelmessig (per tur)?',
            options: [
                { id: 'kort', label: 'Kortere avstander (opptil 20 km)' },
                { id: 'medium', label: 'Mellomdistanse (20-50 km)' },
                { id: 'lang', label: 'Lange avstander (50+ km)' }
            ]
        },
        { // Trinn 3
            id: 'bikeType',
            title: 'Hvilken type el-sykkel ønsker du?',
            options: [
                { id: 'standard', label: 'Standard elsykkel (opptil 25 km/t)' },
                { id: 'highSpeed', label: 'S-Pedelec / Speed Bike (opptil 45 km/t)' } // Krever registrering etc.
            ]
        },
        { // Trinn 4
            id: 'cargo',
            title: 'Hvor mye trenger du vanligvis å frakte?',
            options: [
                { id: 'små', label: 'Litt handling eller en liten veske' },
                { id: 'store', label: 'Ukentlig handling eller større bagasje' },
                { id: 'massiv', label: 'Barn, kjæledyr eller store/tunge varer' }
            ]
        },
        { // Trinn 5
            id: 'frameType',
            title: 'Hvilken rammetype foretrekker du?',
            options: [
                { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' },
                { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' },
                { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' }
            ]
        },
        { // Trinn 6 (Vises kun hvis purpose='transport')
            id: 'cargoLocation',
            title: 'Hvilken type lastesykkel ser du for deg?',
            options: [
                // VIKTIG: Bytt ut placeholder bilder
                { id: 'frontlaster', label: 'Frontlaster', image: 'https://via.placeholder.com/80x60.png?text=Front', description: 'Lasteboks foran', className: 'cargo-type' },
                { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://via.placeholder.com/80x60.png?text=Rear', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' }
            ],
            condition: () => selections.purpose === 'transport' // Betingelse for å vise trinnet
        }
        // Legg til flere trinn her om nødvendig
    ];
    totalSteps = steps.filter(step => !step.condition || step.condition()).length; // Juster totalt antall trinn basert på initielle forhold


    // --- 5. Hjelpefunksjoner ---
    function getStepDefinition(stepNum) {
        let visibleStepIndex = 0;
        for (const stepDef of steps) {
            // Sjekk om trinnet er betinget og om betingelsen er oppfylt
            const isConditional = typeof stepDef.condition === 'function';
            if (!isConditional || stepDef.condition()) {
                visibleStepIndex++;
                if (visibleStepIndex === stepNum) {
                    return stepDef;
                }
            }
        }
        return null; // Fant ikke trinnet
    }

    function getLabelById(optionsArray, id) {
        const option = optionsArray.find(opt => opt.id === id);
        return option ? option.label : `[${id}]`; // Returner ID hvis label ikke finnes
    }

    function updateProgress() {
        const currentVisibleStep = calculateCurrentVisibleStep();
        const totalVisibleSteps = calculateTotalVisibleSteps();

        const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`;
    }

     function calculateCurrentVisibleStep() {
        let visibleStepCount = 0;
        for (let i = 0; i < currentStep; i++) {
            const stepDef = steps[i];
             if (!stepDef.condition || stepDef.condition()) {
                 visibleStepCount++;
             }
        }
        return visibleStepCount;
    }

    function calculateTotalVisibleSteps() {
         let totalVisible = 0;
         steps.forEach(step => {
             if (!step.condition || step.condition()) {
                 totalVisible++;
             }
         });
         return totalVisible;
    }


    // --- 6. Rendering Funksjoner ---

    // Oppdaterer setningsbyggeren
    function renderSentence(targetElement) {
        const purposeLabel = selections.purpose ? `<span class="selected-value">${getLabelById(steps[0].options, selections.purpose)}</span>` : `<span class="placeholder">bruksområde</span>`;
        const distanceLabel = selections.distance ? `<span class="selected-value">${getLabelById(steps[1].options, selections.distance)}</span>` : `<span class="placeholder">reiseavstand</span>`;
        const bikeTypeLabel = selections.bikeType ? `<span class="selected-value">${getLabelById(steps[2].options, selections.bikeType)}</span>` : `<span class="placeholder">sykkeltype</span>`;
        const cargoLabel = selections.cargo ? ` Jeg transporterer ofte <span class="selected-value">${getLabelById(steps[3].options, selections.cargo)}</span>` : '';
        const frameTypeLabel = selections.frameType ? ` Foretrekker en ramme med <span class="selected-value">${getLabelById(steps[4].options, selections.frameType)}</span>` : '';
        const cargoLocationLabel = selections.cargoLocation && selections.purpose === 'transport' ? ` med <span class="selected-value">${getLabelById(steps[5].options, selections.cargoLocation)}</span>` : '';

        targetElement.innerHTML = `
            <p>Med min sykkel ønsker jeg først og fremst ${purposeLabel}
            og planlegger regelmessige reiser på ${distanceLabel}.
            Jeg ønsker ${bikeTypeLabel}.
            ${cargoLabel}${cargoLocationLabel}${frameTypeLabel}.</p>
        `;
    }

    // Viser alternativene for det gjeldende trinnet
    function renderOptions() {
        const stepDef = getStepDefinition(currentStep);
        if (!stepDef) {
            console.error("Kunne ikke finne definisjon for trinn:", currentStep);
            // Kanskje vise feilmelding eller gå til resultater?
             generateAndShowRecommendations();
            return;
        }

        stepTitle.textContent = stepDef.title;
        stepOptions.innerHTML = ''; // Tøm forrige innhold

        stepDef.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            if(option.className) { // For spesielle klasser som 'cargo-type'
                 button.classList.add(option.className);
            }
            button.dataset.value = option.id; // Lagre ID-en

            let buttonContent = ``;
             if(option.image){
                 buttonContent += `<img src="${option.image}" alt="${option.label}">`;
             }
             buttonContent += `<div>${option.label}</div>`; // Selve teksten

             if (option.description) {
                buttonContent += `<div class="description">${option.description}</div>`;
            }

            button.innerHTML = buttonContent;


            if (selections[stepDef.id] === option.id) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id));
            stepOptions.appendChild(button);
        });

        // Oppdater fremdrift
        updateProgress();
    }

    // Viser anbefalingene
     function renderRecommendations() {
        recommendationsOutput.innerHTML = ''; // Tøm gamle

        if (recommendations.length === 0) {
            recommendationsOutput.innerHTML = '<p>Beklager, vi fant ingen Evo-sykler som matchet alle dine valg. Prøv å justere valgene dine, eller kontakt oss for veiledning.</p>';
            return;
        }

        recommendations.forEach((bike, index) => {
            const card = document.createElement('div');
            card.classList.add('recommendation-card');

            let badgeText = '';
            if(index === 0) badgeText = 'TOPP VALG';
            else if (index === 1) badgeText = 'ANBEFALT';
            else if (index === 2) badgeText = 'GODT ALTERNATIV';

            let featuresHTML = '';
            if(bike.features && bike.features.length > 0) {
                featuresHTML = `
                 <div class="recommendation-features">
                     <h4>
                       <svg class="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                       Nøkkelegenskaper:
                     </h4>
                     <ul>
                         ${bike.features.map(feature => `<li>${feature}</li>`).join('')}
                     </ul>
                 </div>`;
            }


            card.innerHTML = `
                ${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}
                <div class="recommendation-image-container">
                    <img src="${bike.image || 'https://via.placeholder.com/300x180.png?text=Bilde+mangler'}" alt="${bike.name}" class="recommendation-image">
                </div>
                <div class="recommendation-content">
                    <h3>${bike.name}</h3>
                    <p class="description">${bike.description || 'Ingen beskrivelse tilgjengelig.'}</p>
                    ${featuresHTML}
                    <div class="recommendation-footer">
                        <div class="recommendation-price">
                             ${bike.price ? `<span class="price-label">Fra</span><span class="price-value">${bike.price}</span>` : ''}
                        </div>
                        <div class="recommendation-buttons">
                             <a href="${bike.productUrl || '#'}" target="_blank" class="button button-secondary">Se detaljer</a>
                            <!-- <button class="button button-primary">Konfigurer</button> -->
                        </div>
                    </div>
                </div>
            `;
            recommendationsOutput.appendChild(card);
        });
    }

    // Styrer hvilken "view" som vises (spørsmål eller resultater)
    function updateView() {
        if (showRecommendationsView) {
            questionsSection.classList.add('hidden');
            recommendationsSection.classList.remove('hidden');
            renderSentence(summarySentenceFinal); // Vis endelig setning
            renderRecommendations();
            advisorContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll til toppen av containeren
        } else {
            questionsSection.classList.remove('hidden');
            recommendationsSection.classList.add('hidden');
            renderSentence(sentenceBuilder); // Vis setning under bygging
            renderOptions();
            // Vis/skjul tilbakeknapp
            backButton.classList.toggle('hidden', currentStep === 1);
        }
    }

    // --- 7. Logikk for Anbefalinger ---
    function generateAndShowRecommendations() {
         console.log("Genererer anbefalinger basert på:", selections); // Debugging

         // *** Start avansert filtrering/scoring (Eksempel) ***
         const scoredBikes = BikeCatalog.evoOriginal.map(bike => {
             let score = 0;
             let matchReasons = []; // For debugging/forklaring

             // 1. Formål (Viktigste?) - Gi høy score for primærtreff, lavere for sekundærtreff
             if (bike.purpose.includes(selections.purpose)) {
                 score += 10;
                 matchReasons.push(`Passer formål (${selections.purpose})`);
                 if(bike.purpose[0] === selections.purpose) { // Hvis det er listet som #1 formål
                    score += 5;
                    matchReasons.push("Primært formål");
                 }
             } else {
                 score -= 20; // Straff hvis formålet ikke matcher i det hele tatt?
                 matchReasons.push(`Passer IKKE formål (${selections.purpose})`);
             }

             // 2. Distanse - Sjekk om brukerens valg er innenfor sykkelens range
             const distanceMap = { kort: 20, medium: 50, lang: 100 }; // Max km for kategori
             const userMaxDistance = distanceMap[selections.distance] || 50;
             if (bike.distance_km && bike.distance_km[1] >= userMaxDistance * 0.8) { // Sykkelens maks rekkevidde er minst 80% av brukerens ønske
                 score += 5;
                 matchReasons.push(`Passende rekkevidde (>=${Math.round(userMaxDistance * 0.8)}km)`);
                 if(bike.distance_km[1] >= userMaxDistance) score += 3; // Bonus for full match
             } else if (bike.distance_km) {
                  matchReasons.push(`Rekkevidde (${bike.distance_km[1]}km) kanskje for kort for ${selections.distance} (${userMaxDistance}km)`);
                  score -= 5; // Liten straff hvis for kort
             }

             // 3. Hastighet
             const desiredSpeed = selections.bikeType === 'highSpeed' ? 45 : 25;
             if (bike.speed_kmh === desiredSpeed) {
                 score += 8;
                 matchReasons.push(`Riktig hastighet (${desiredSpeed}km/t)`);
             } else if (desiredSpeed === 45 && bike.speed_kmh === 25) {
                  score -= 15; // Stor straff hvis man vil ha speed, men sykkelen ikke er det
                 matchReasons.push(`FEIL hastighet (ønsket ${desiredSpeed}km/t)`);
             } else if (desiredSpeed === 25 && bike.speed_kmh === 45) {
                 // Mindre viktig, men kan være en faktor? Kanskje nøytral.
                 matchReasons.push(`Overkvalifisert hastighet (er ${bike.speed_kmh}km/t)`);
             }


             // 4. Lastekapasitet
             const cargoMap = { små: 1, store: 2, massiv: 3 };
             const bikeCargoLevel = bike.cargo_capacity ? (cargoMap[bike.cargo_capacity] || 0) : 0;
             const userCargoLevel = selections.cargo ? (cargoMap[selections.cargo] || 0) : 0;

             if (bikeCargoLevel >= userCargoLevel) {
                 score += 6;
                 matchReasons.push(`Tilstrekkelig lastekapasitet (${bike.cargo_capacity} >= ${selections.cargo})`);
                 if(bikeCargoLevel === userCargoLevel && userCargoLevel > 0) score += 2; // Bonus for nøyaktig match
             } else if(userCargoLevel > 0) {
                 score -= 8; // Straff hvis man trenger mer kapasitet enn sykkelen har
                 matchReasons.push(`For liten lastekapasitet (${bike.cargo_capacity} < ${selections.cargo})`);
             }

             // 5. Rammetype - Gi poeng hvis *en av* sykkelens rammer matcher ønsket
             if (bike.frame_types && bike.frame_types.length > 0 && selections.frameType) {
                 const frameMap = { dypGjennomgang: 'low-step', lavtTopprør: 'mid-step', høytTopprør: 'high-step' };
                 const desiredFrameInternal = frameMap[selections.frameType];
                 if (bike.frame_types.includes(desiredFrameInternal)) {
                     score += 7;
                     matchReasons.push(`Ønsket rammetype (${selections.frameType}) tilgjengelig`);
                 } else {
                      // Liten straff hvis ønsket type ikke finnes for denne modellen
                      score -= 3;
                     matchReasons.push(`Ønsket rammetype (${selections.frameType}) IKKE tilgjengelig`);
                 }
             }


             // 6. Lastetype (Kun for transport) - Match hvis bruker valgte transport OG lastetype
             if (selections.purpose === 'transport' && selections.cargoLocation && bike.purpose.includes('transport')) {
                 const cargoLocationMap = { frontlaster: 'front', langhale: 'rear' };
                 const desiredLocationInternal = cargoLocationMap[selections.cargoLocation];
                 if (bike.cargo_location === desiredLocationInternal) {
                     score += 10; // Viktig match for lastesykler
                     matchReasons.push(`Riktig lastetype (${selections.cargoLocation})`);
                 } else {
                     score -= 10; // Viktig feilmatch for lastesykler
                      matchReasons.push(`FEIL lastetype (ønsket ${selections.cargoLocation})`);
                 }
             }

             console.log(`Sykkel: ${bike.name}, Score: ${score}, Grunner: ${matchReasons.join(', ')}`); // Debugging
             return { ...bike, score, matchReasons };

         }).filter(bike => bike.score > 0); // Filtrer ut sykler med negativ score (passer dårlig)


         // Sorter etter høyest score
         scoredBikes.sort((a, b) => b.score - a.score);

        // Ta de topp 3 (eller færre hvis det ikke er nok treff)
        recommendations = scoredBikes.slice(0, 3);
         console.log("Endelige anbefalinger:", recommendations); // Debugging

         // *** Slutt avansert filtrering/scoring ***

        showRecommendationsView = true;
        updateView();
    }


    // --- 8. Event Handlers ---
    function handleOptionSelect(stepId, value) {
        // Fjern 'selected' fra andre knapper i samme trinn
        const buttons = stepOptions.querySelectorAll('.option-button');
        buttons.forEach(btn => btn.classList.remove('selected'));

        // Legg til 'selected' på den klikkede knappen
        const selectedButton = stepOptions.querySelector(`.option-button[data-value="${value}"]`);
        if(selectedButton) selectedButton.classList.add('selected');


        // Oppdater state
        selections[stepId] = value;
        console.log("Valg oppdatert:", selections);


        // Gå til neste trinn eller vis resultater
         const currentVisibleStep = calculateCurrentVisibleStep();
         const totalVisibleSteps = calculateTotalVisibleSteps();

        if (currentVisibleStep < totalVisibleSteps) {
            currentStep++; // Øk den *logiske* steg-telleren
            updateView();
        } else {
            generateAndShowRecommendations();
        }
    }

    function handleBack() {
         if (currentStep > 1) {
            // Finn det *faktiske* forrige synlige trinnet
            let previousStepIndex = -1;
            let visibleCount = 0;
            for(let i = 0; i < steps.length; i++){
                const stepDef = steps[i];
                 if (!stepDef.condition || stepDef.condition()){
                     visibleCount++;
                     if(visibleCount === calculateCurrentVisibleStep() -1) {
                         previousStepIndex = i;
                         break;
                     }
                 }
            }

             if(previousStepIndex !== -1){
                 currentStep = previousStepIndex + 1; // Sett currentStep til indeksen + 1

                 // Nullstill valget for det trinnet vi går *tilbake til*? Valgfritt.
                 // const stepDef = getStepDefinition(currentStep);
                 // if(stepDef) selections[stepDef.id] = null;

                 showRecommendationsView = false; // Sørg for at vi viser spørsmål
                 updateView();
             } else {
                 console.log("Fant ikke forrige synlige trinn");
                 resetAdvisor(); // Fallback hvis noe går galt
             }

        }
    }

    function resetAdvisor() {
        currentStep = 1;
        selections = {
            purpose: null, distance: null, bikeType: null, cargo: null, frameType: null, cargoLocation: null
        };
        recommendations = [];
        showRecommendationsView = false;
        updateView(); // Kall denne for å rendre første trinn på nytt
    }


    // --- 9. Initialisering ---
    backButton.addEventListener('click', handleBack);
    resetButtonStep.addEventListener('click', resetAdvisor);
    resetButtonFinal.addEventListener('click', resetAdvisor);
    currentYearSpan.textContent = new Date().getFullYear();

    updateView(); // Vis det første trinnet når siden lastes

});
