document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data (Riese & Müller / Tern Eksempler - med Norske Kroner) ---
    // VIKTIG: Bytt ut resterende placeholder-URLer med ekte bilde-URLer og produktlenker!
    const BikeCatalog = {
        evoOriginal: [
            // Pendling
            {
                id: 'rm-charger4-gt', name: "Riese & Müller Charger4 GT", purpose: ['pendling', 'trekking'],
                description: "Et ypperlig pendlervalg med integrert 750 Wh batteri som gir lang rekkevidde og kraftig Bosch-motor for høy marsjfart. Dempegaffel og dempet setepinne sørger for komfort selv på ujevn asfalt.",
                features: ["750 Wh batteri", "Kraftig Bosch-motor", "Dempegaffel", "Dempet setepinne", "Kontinuerlig kjørelys"],
                price: "5 699 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Charger4+GT", productUrl: "#", frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: null, distance_km: [40, 120]
            },
            {
                id: 'tern-quick-haul-p9', name: "Tern Quick Haul P9", purpose: ['pendling', 'bybruk', 'allsidig', 'transport'],
                description: "En kompakt elsykkel som kombinerer bysykkelens smidighet med god lastkapasitet. Lett å manøvrere i bytrafikk og tar liten plass.",
                features: ["400 Wh batteri", "Bosch Performance Line motor", "Kompakt", "Ergonomisk sittestilling", "Robust ramme", "50 kg lastkapasitet (bak)"],
                price: "37 000 kr", // Brukerens oppdatering
                image: "https://evoelsykler.no/wp-content/uploads/2024/06/Quick-Haul-H9-gronn.jpg", // Brukerens oppdatering (Merk: URL nevner H9)
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-p9-400/?attribute_pa_farge=gronn&gad_source=1&gclid=Cj0KCQjwkZm_BhDrARIsAAEbX1FuNlRzuUBlKTbajjzWES0zb_flPmbDMd6jEmIoL5cFOZ0au9sEUOwaAnneEALw_wcB&gclsrc=aw.ds", // Brukerens oppdatering
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear', distance_km: [20, 70]
            },
            {
                id: 'rm-roadster', name: "Riese & Müller Roadster", purpose: ['pendling', 'bybruk'],
                description: "En sporty pendlesykkel med slank, tradisjonell ramme. Den er rask og lettkjørt, med en sterk Bosch Performance-motor som gir rask akselerasjon.",
                features: ["Bosch Performance-motor", "Slank ramme", "Fremoverlent kjørestilling", "Smalere dekk", "Dempegaffel"],
                price: "4 499 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Roadster", productUrl: "#", frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: null, distance_km: [30, 80]
            },
            // Bybruk
            {
                id: 'rm-swing', name: "Riese & Müller Swing", purpose: ['bybruk', 'leisure'],
                description: "En klassisk komfort-elsykkel i retrostil, rettet mot bysykling i rolig tempo. Elegant buet lav-innstegsramme, dempegaffel og dempet setepinne.",
                features: ["Lav-innstegsramme", "Dempegaffel", "Dempet setepinne", "Navgir og beltedrift", "Oppreist, avslappet sittestilling"],
                price: "4 299 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Swing", productUrl: "#", frame_types: ['low-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: null, distance_km: [30, 80]
            },
            {
                id: 'tern-nbd', name: "Tern NBD", purpose: ['bybruk', 'leisure', 'allsidig'],
                description: "Terns 'Near Busy Dad' (NBD) er en superlav innstegs elsykkel utformet for enkelhet og komfort i byen. Med ultralav ramme er det enkelt å sette føttene flatt i bakken.",
                features: ["Ultralav ramme (39 cm steg)", "Bosch Active Plus-motor", "Tykkere dekk", "Dempepinne i setet", "Brukervennlig"],
                price: "3 999 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=NBD", productUrl: "#", frame_types: ['low-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: null, distance_km: [25, 70]
            },
            {
                id: 'rm-nevo4', name: "Riese & Müller Nevo4", purpose: ['bybruk', 'pendling', 'trekking', 'allsidig'],
                description: "En kombinasjon av komfort og allsidighet i et lavt innsteg-design. Gjennomstegsramme som gjør av- og påstigning enkelt.",
                features: ["Gjennomstegsramme", "Bosch CX-motor", "625-750 Wh batteri", "Solid bagasjebrett", "Dempet forgaffel"],
                price: "4 799 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Nevo4", productUrl: "#", frame_types: ['low-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear', distance_km: [40, 110]
            },
            // Terreng
            {
                id: 'rm-delite-mountain', name: "Riese & Müller Delite Mountain", purpose: ['terreng', 'mtb'],
                description: "En fulldempet terreng-elsykkel bygget for eventyr i høy hastighet. Fox Float bakdemper og 150 mm vandring foran, som sammen med en kraftig Bosch Performance CX-motor.",
                features: ["Fox Float bakdemper", "150mm vandring", "Bosch Performance CX-motor", "High Speed-klar", "Ekstremt kapabel offroad"],
                price: "6 999 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Delite+Mountain", productUrl: "#", frame_types: ['high-step'],
                speed_kmh: 25, cargo_capacity: 'none', cargo_location: null, distance_km: [35, 90]
            },
            {
                id: 'rm-superdelite', name: "Riese & Müller Superdelite", purpose: ['terreng', 'trekking', 'pendling'],
                description: "'Super'-versjonen av Delite kommer med dobbelt batteri (1125 Wh totalt) for ekstra lang rekkevidde på raske turer. Skapt for de lengste og mest krevende turene.",
                features: ["Dobbelt batteri (1125 Wh)", "Full demping", "Rohloff elektronisk gir", "ABS-bremser (opsjon)", "DualBattery-teknologi"],
                price: "7 999 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Superdelite", productUrl: "#", frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: null, distance_km: [60, 180]
            },
            // Transport
            {
                id: 'rm-load4-60', name: "Riese & Müller Load4 60", purpose: ['transport', 'family'],
                description: "En premium lastesykkel med frontmontert lasteplan og fulldempet ramme. Takler tung last (f.eks. to barn i kasse med kalesje) uten å kompromisse på stabilitet eller kjøreglede.",
                features: ["Bosch Cargo Line-motor", "Fulldempet", "Frontmontert lasteplan", "Lavt tyngdepunkt", "Høy stabilitet"],
                price: "7 299 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Load4+60", productUrl: "#", frame_types: ['cargo'],
                speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [30, 80]
            },
            {
                id: 'tern-gsd-s10', name: "Tern GSD S10", purpose: ['transport', 'family', 'allsidig'],
                description: "Terns velkjente longtail-lastesykkel, designet for å erstatte bilen i hverdagen. Kompakt format men kan frakte opp til to barn eller store varemengder på det forlengede bakre lasteplanet.",
                features: ["Bosch Cargo-motor", "Mulighet for doble batterier", "Kompakt format", "Tilbehør for barn og hund", "Garasjevennlig størrelse"],
                price: "5 499 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=GSD+S10", productUrl: "#", frame_types: ['cargo-longtail'],
                speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'rear', distance_km: [30, 100]
            },
            {
                id: 'rm-packster-70', name: "Riese & Müller Packster 70", purpose: ['transport', 'family', 'business'],
                description: "En frontlaster spesialdesignet for familier og varelevering. Romslig transportboks foran med benker til barn og sikkerhetsbelter.",
                features: ["Bosch Performance CX-motor", "Stort lastevolum", "Familievennlig", "Tilbehør for ulike behov", "God balanse mellom pris og funksjonalitet"],
                price: "6 699 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Packster+70", productUrl: "#", frame_types: ['cargo'],
                speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [30, 80]
            },
            // Allsidig
            {
                id: 'rm-multicharger2', name: "Riese & Müller Multicharger2", purpose: ['allsidig', 'transport', 'trekking', 'family'],
                description: "Bygget for å takle flere oppgaver. En miks av terrengsykkel og longtail-lastesykkel med utvidet bagasjebrett som kan ta barneseter eller sidevesker med varer.",
                features: ["Bosch CX-motor", "Opptil 750 Wh batteri", "Family-utgave med barneseter", "Sidevesker", "Offroad-kapasitet"],
                price: "5 869 kr", // Endret format (rundet opp)
                image: "https://via.placeholder.com/300x180.png?text=Multicharger2", productUrl: "#", frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [40, 110]
            },
            {
                id: 'rm-multitinker', name: "Riese & Müller Multitinker", purpose: ['allsidig', 'bybruk', 'transport', 'family'],
                description: "En ultraversatil bysykkel med kompakte 20' hjul og lang akselavstand med integrert bagasjebrett, noe som gir lavt tyngdepunkt og stabilitet med last.",
                features: ["Kompakte 20' hjul", "Last opp til 100 kg", "To barn bakpå", "Kort for bysykling", "Fullt utstyrt"],
                price: "4 999 kr", // Endret format
                image: "https://via.placeholder.com/300x180.png?text=Multitinker", productUrl: "#", frame_types: ['low-step'],
                speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [30, 80]
            }
        ]
    };

    // --- 2. State Variabler ---
    let currentStep = 1;
    let totalSteps = 6;
    let selections = { purpose: null, distance: null, bikeType: null, cargo: null, frameType: null, cargoLocation: null };
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
    const loadingIndicator = document.getElementById('loading-indicator');

    // --- 4. Definisjoner for Trinn og Alternativer ---
    const steps = [
        { id: 'purpose', title: 'Hva skal sykkelen primært brukes til?', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Hvilken reiseavstand planlegger du regelmessig (per tur)?', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'bikeType', title: 'Hvilken type el-sykkel ønsker du?', options: [ { id: 'standard', label: 'Standard elsykkel (opptil 25 km/t)' }, { id: 'highSpeed', label: 'S-Pedelec / Speed Bike (opptil 45 km/t)' } ] },
        { id: 'cargo', title: 'Hvor mye trenger du vanligvis å frakte?', options: [ { id: 'små', label: 'Litt handling eller en liten veske' }, { id: 'store', label: 'Ukentlig handling eller større bagasje' }, { id: 'massiv', label: 'Barn, kjæledyr eller store/tunge varer' } ] },
        { id: 'frameType', title: 'Hvilken rammetype foretrekker du?', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Hvilken type lastesykkel ser du for deg?', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://via.placeholder.com/80x60.png?text=Front', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://via.placeholder.com/80x60.png?text=Rear', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];
    totalSteps = calculateTotalVisibleSteps();

    // --- 5. Hjelpefunksjoner ---
    function getStepDefinition(stepNum) {
        let visibleStepIndex = 0;
        for (const stepDef of steps) {
            const isConditional = typeof stepDef.condition === 'function';
            if (!isConditional || stepDef.condition()) {
                visibleStepIndex++;
                if (visibleStepIndex === stepNum) {
                    return stepDef;
                }
            }
        }
        return null;
    }

    function getLabelById(optionsArray, id) {
        const option = optionsArray?.find(opt => opt.id === id); // Added optional chaining
        return option ? option.label : `[${id}]`;
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
             if (!stepDef || !stepDef.condition || stepDef.condition()) {
                 visibleStepCount++;
             }
         }
         // If currentStep is 1, visibleStepCount will be 1.
         // If currentStep is > total steps, we should return total steps + 1 conceptually,
         // but for progress bar, maybe cap at total steps or return the actual count.
         // Let's stick with the actual count for now.
         return Math.max(1, visibleStepCount);
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
    function renderSentence(targetElement) {
        // Added checks for steps[index] existence before accessing options
        const purposeOptions = steps[0]?.options ?? [];
        const distanceOptions = steps[1]?.options ?? [];
        const bikeTypeOptions = steps[2]?.options ?? [];
        const cargoOptions = steps[3]?.options ?? [];
        const frameTypeOptions = steps[4]?.options ?? [];
        const cargoLocationOptions = steps[5]?.options ?? [];

        const purposeLabel = selections.purpose ? `<span class="selected-value">${getLabelById(purposeOptions, selections.purpose)}</span>` : `<span class="placeholder">bruksområde</span>`;
        const distanceLabel = selections.distance ? `<span class="selected-value">${getLabelById(distanceOptions, selections.distance)}</span>` : `<span class="placeholder">reiseavstand</span>`;
        const bikeTypeLabel = selections.bikeType ? `<span class="selected-value">${getLabelById(bikeTypeOptions, selections.bikeType)}</span>` : `<span class="placeholder">sykkeltype</span>`;

        let details = "";
        if (selections.cargo) {
             details += ` Jeg transporterer ofte <span class="selected-value">${getLabelById(cargoOptions, selections.cargo)}</span>`;
        }
         if (selections.purpose === 'transport' && selections.cargoLocation) {
            details += ` med <span class="selected-value">${getLabelById(cargoLocationOptions, selections.cargoLocation)}</span>`;
        }
         if (selections.frameType) {
            details += `. Foretrekker en ramme med <span class="selected-value">${getLabelById(frameTypeOptions, selections.frameType)}</span>`;
        }

        targetElement.innerHTML = `
            <p>Med min sykkel ønsker jeg først og fremst ${purposeLabel}
            og planlegger regelmessige reiser på ${distanceLabel}.
            Jeg ønsker ${bikeTypeLabel}.${details}.</p>
        `;
    }

    function renderOptions() {
         const currentVisibleStepNum = calculateCurrentVisibleStep();
         const stepDef = getStepDefinition(currentVisibleStepNum);

        if (!stepDef) {
            console.error("renderOptions: Kunne ikke finne definisjon for synlig trinn:", currentVisibleStepNum, "(logisk trinn:", currentStep, ")");
            // Maybe we are done? Let's trigger recommendations if state suggests we should be.
            if(currentStep > calculateTotalVisibleSteps()){
                 generateAndShowRecommendations();
            } else {
                stepTitle.textContent = "Feil ved lasting av trinn."; // Show error message
                stepOptions.innerHTML = ''; // Clear options
            }
            return;
        }

        stepTitle.textContent = stepDef.title;
        stepOptions.innerHTML = '';

        // Check if options exist
        if (!stepDef.options || stepDef.options.length === 0) {
            console.warn(`renderOptions: Ingen alternativer funnet for trinn ${currentStep} (ID: ${stepDef.id})`);
            return; // Don't try to render buttons if there are no options
        }

        stepDef.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            if(option.className) {
                 button.classList.add(option.className);
            }
            button.dataset.value = option.id;

            let buttonContent = ``;
             if(option.image){
                 buttonContent += `<img src="${option.image}" alt="${option.label}">`;
             }
             // Ensure label exists
             buttonContent += `<div>${option.label ?? `[Mangler label: ${option.id}]`}</div>`;

             if (option.description) {
                buttonContent += `<div class="description">${option.description}</div>`;
            }
            button.innerHTML = buttonContent;

            // Check if selections property exists before accessing
            if (selections.hasOwnProperty(stepDef.id) && selections[stepDef.id] === option.id) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id));
            stepOptions.appendChild(button);
        });

        updateProgress();
    }

     function renderRecommendations() {
        // Ensure the container exists
        if (!recommendationsOutput) {
            console.error("renderRecommendations: Kan ikke finne recommendationsOutput element.");
            return;
        }
        recommendationsOutput.innerHTML = '';

        if (!recommendations || recommendations.length === 0) {
            recommendationsOutput.innerHTML = '<p>Beklager, vi fant ingen sykler som matchet alle dine valg. Prøv å justere valgene dine, eller kontakt oss for veiledning.</p>';
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
                         ${bike.features.map(feature => `<li>${feature || ''}</li>`).join('')}
                     </ul>
                 </div>`;
            }

            card.innerHTML = `
                ${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}
                <div class="recommendation-image-container">
                    <img src="${bike.image || 'https://via.placeholder.com/300x180.png?text=Bilde+mangler'}" alt="${bike.name || 'Ukjent sykkel'}" class="recommendation-image">
                </div>
                <div class="recommendation-content">
                    <h3>${bike.name || 'Ukjent sykkel'}</h3>
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

    function updateView() {
        // Ensure elements exist before manipulating them
        if (!questionsSection || !recommendationsSection || !loadingIndicator || !recommendationsOutput || !sentenceBuilder) {
            console.error("updateView: Ett eller flere kritiske UI-elementer mangler.");
            return;
        }

        if (showRecommendationsView) {
            questionsSection.classList.add('hidden');
            recommendationsSection.classList.remove('hidden');
            // Loading/output visibility is handled within generateAndShowRecommendations
            if(summarySentenceFinal) renderSentence(summarySentenceFinal); // Render final sentence if element exists
        } else {
            questionsSection.classList.remove('hidden');
            recommendationsSection.classList.add('hidden');
            loadingIndicator.classList.add('hidden');
            recommendationsOutput.classList.add('hidden');
            renderSentence(sentenceBuilder);
            renderOptions(); // Render options for the current step
            if(backButton) backButton.classList.toggle('hidden', calculateCurrentVisibleStep() <= 1);
        }
        // Always try to update progress
        totalSteps = calculateTotalVisibleSteps();
        updateProgress();
    }


    // --- 7. Logikk for Anbefalinger (Scoring-system) ---
    function generateAndShowRecommendations() {
        console.log("Starter generering av anbefalinger med scoring...");

        // Ensure elements exist before showing loading state
         if (!questionsSection || !recommendationsSection || !recommendationsOutput || !loadingIndicator || !summarySentenceFinal) {
            console.error("generateAndShowRecommendations: Kan ikke vise loading state, UI-elementer mangler.");
            return;
        }

        showRecommendationsView = true;
        questionsSection.classList.add('hidden');
        recommendationsSection.classList.remove('hidden');
        recommendationsOutput.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        renderSentence(summarySentenceFinal);
        recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Using setTimeout to ensure UI updates before heavy calculation starts
        setTimeout(() => {
            try { // Add try-catch for robustness during calculation
                console.log("Utfører scoring av sykler basert på:", selections);

                const weights = {
                    purposeMatch: 15, purposePrimaryBonus: 5, purposeMismatchPenalty: -50,
                    distanceMatch: 8, distanceBonus: 4, distancePenalty: -5,
                    speedMatch: 10, speedMismatchPenalty: -20,
                    cargoMatch: 7, cargoExactBonus: 3, cargoMismatchPenalty: -10,
                    frameMatch: 6, frameMismatchPenalty: -3,
                    cargoLocationMatch: 12, cargoLocationMismatchPenalty: -15
                };

                const scoredBikes = BikeCatalog.evoOriginal.map(bike => {
                    let score = 0;
                    let matchReasons = []; // For debugging

                    // --- Scoring Logic (ensure null/undefined checks) ---
                     // 1. Formål
                    if (bike.purpose && bike.purpose.length > 0 && selections.purpose) {
                        if (bike.purpose.includes(selections.purpose)) {
                            score += weights.purposeMatch;
                            matchReasons.push(`Formål OK (${selections.purpose})`);
                            if (bike.purpose[0] === selections.purpose) {
                                score += weights.purposePrimaryBonus;
                                matchReasons.push("Primært formål bonus");
                            }
                        } else {
                            score += weights.purposeMismatchPenalty;
                            matchReasons.push(`Feil formål (trenger ${selections.purpose})`);
                        }
                    } else if (!selections.purpose) {
                         matchReasons.push("Formål ikke valgt"); // No score change if user didn't select
                    } else {
                         matchReasons.push("Sykkel mangler formål"); // No score change if bike has no purpose listed
                    }


                    // 2. Distanse
                    if (selections.distance && bike.distance_km) {
                        const distanceMap = { kort: 20, medium: 50, lang: 100 };
                        const userMaxDistance = distanceMap[selections.distance] ?? 50; // Use nullish coalescing
                        const bikeMaxDistance = bike.distance_km[1] ?? 0; // Use nullish coalescing

                        if (bikeMaxDistance >= userMaxDistance * 0.75) {
                            score += weights.distanceMatch;
                            matchReasons.push(`Rekkevidde OK (>=${Math.round(userMaxDistance*0.75)}km)`);
                            if (bikeMaxDistance >= userMaxDistance) {
                                score += weights.distanceBonus;
                                matchReasons.push("Rekkevidde bonus");
                            }
                        } else if (bikeMaxDistance > 0) {
                            score += weights.distancePenalty;
                            matchReasons.push(`Rekkevidde litt kort (${bikeMaxDistance}km vs ${userMaxDistance}km)`);
                        }
                    } else if (selections.distance) {
                         matchReasons.push("Sykkel mangler distanseinfo");
                    }

                    // 3. Hastighet (Sykkeltype)
                    if (selections.bikeType) {
                        const desiredSpeed = selections.bikeType === 'highSpeed' ? 45 : 25;
                        const bikeSpeed = bike.speed_kmh ?? 25; // Default to 25 if missing

                        if (bikeSpeed === desiredSpeed) {
                            score += weights.speedMatch;
                            matchReasons.push(`Riktig fart (${desiredSpeed}km/t)`);
                        } else if (desiredSpeed === 45 && bikeSpeed === 25) {
                            score += weights.speedMismatchPenalty;
                            matchReasons.push(`Feil fart (ikke HS)`);
                        }
                    }

                    // 4. Lastekapasitet (Cargo)
                    if (selections.cargo) {
                        const cargoLevelMap = { små: 1, store: 2, massiv: 3 };
                        const capacityLevelMap = { none: 0, small: 1, medium: 2, large: 3, massive: 3 };
                        const userCargoLevel = cargoLevelMap[selections.cargo] ?? 0;
                        const bikeCargoLevel = capacityLevelMap[bike.cargo_capacity] ?? 0; // Default to 0 if missing

                        if (bikeCargoLevel >= userCargoLevel) {
                            score += weights.cargoMatch;
                            matchReasons.push(`Last OK (${bike.cargo_capacity ?? 'ukjent'} >= ${selections.cargo})`);
                            if (bikeCargoLevel === userCargoLevel && userCargoLevel > 0) {
                                score += weights.cargoExactBonus;
                                matchReasons.push("Last eksakt bonus");
                            }
                        } else if (userCargoLevel > 0) {
                            score += weights.cargoMismatchPenalty;
                            matchReasons.push(`For liten last (${bike.cargo_capacity ?? 'ukjent'} < ${selections.cargo})`);
                        }
                    }

                    // 5. Rammetype
                    if (selections.frameType && bike.frame_types && bike.frame_types.length > 0) {
                        const frameMap = { dypGjennomgang: 'low-step', lavtTopprør: 'mid-step', høytTopprør: 'high-step' };
                        const desiredFrameInternal = frameMap[selections.frameType];
                        if (bike.frame_types.includes(desiredFrameInternal)) {
                            score += weights.frameMatch;
                            matchReasons.push(`Ramme OK (${selections.frameType})`);
                        } else {
                            score += weights.frameMismatchPenalty;
                            matchReasons.push(`Ramme mangler (${selections.frameType})`);
                        }
                    } else if (selections.frameType) {
                         matchReasons.push("Sykkel mangler rammeinfo");
                    }


                    // 6. Lastetype (Kun for transport)
                    if (selections.purpose === 'transport' && selections.cargoLocation) {
                        const cargoLocationMap = { frontlaster: 'front', langhale: 'rear' };
                        const desiredLocationInternal = cargoLocationMap[selections.cargoLocation];
                        if (bike.cargo_location === desiredLocationInternal) {
                            score += weights.cargoLocationMatch;
                            matchReasons.push(`Lastetype OK (${selections.cargoLocation})`);
                        } else {
                            if (bike.purpose?.includes('transport')){ // Check if it's even a transport bike
                                score += weights.cargoLocationMismatchPenalty;
                                matchReasons.push(`Feil lastetype (ønsket ${selections.cargoLocation})`);
                            }
                        }
                    }
                    // --- End Scoring Logic ---


                     console.log(`Sykkel: ${bike.name ?? 'Ukjent'}, Score: ${score.toFixed(1)}, Grunner: ${matchReasons.join('; ')}`);
                    return { ...bike, score, matchReasons };

                }).filter(bike => bike.score >= 0); // Filter out negative scores

                scoredBikes.sort((a, b) => b.score - a.score); // Sort by score DESC
                recommendations = scoredBikes.slice(0, 3); // Take top 3

                console.log("Endelige anbefalinger (score basert):", recommendations.map(b => `${b.name ?? 'Ukjent'} (${b.score?.toFixed(1) ?? 'N/A'})`));

                // Hide loader, render and show results
                if(loadingIndicator) loadingIndicator.classList.add('hidden');
                renderRecommendations(); // Render the cards
                if(recommendationsOutput) recommendationsOutput.classList.remove('hidden'); // Show the grid

             } catch (error) {
                console.error("Feil under generering av anbefalinger:", error);
                if(loadingIndicator) loadingIndicator.classList.add('hidden'); // Hide loader on error too
                if(recommendationsOutput) {
                     recommendationsOutput.innerHTML = '<p>Oisann! Noe gikk galt under henting av anbefalinger. Prøv igjen.</p>'; // Show error message
                     recommendationsOutput.classList.remove('hidden');
                }
            }

        }, 750); // Delay for UI / perceived work
    }


    // --- 8. Event Handlers ---
    function handleOptionSelect(stepId, value) {
        if (!selections.hasOwnProperty(stepId)) {
            console.warn(`handleOptionSelect: Ukjent stepId '${stepId}'`);
            return;
        }
        selections[stepId] = value;
        console.log("Valg oppdatert:", selections);

        currentStep++; // Increment logical step

        let nextStepDef = steps[currentStep - 1];
        // Skip conditional steps if condition is not met
        while(nextStepDef && nextStepDef.condition && !nextStepDef.condition()) {
            console.log(`Hopper over betinget trinn ${currentStep}: ${nextStepDef.id}`);
            currentStep++;
            nextStepDef = steps[currentStep - 1];
        }

        const totalVisible = calculateTotalVisibleSteps();
        const nextVisible = calculateCurrentVisibleStep(); // This calc seems complex for this check

        // Simplified check: If logical step is beyond defined steps array length
        if (currentStep > steps.length) {
             console.log("Alle trinn fullført (logisk), viser resultater.");
             generateAndShowRecommendations();
        } else {
             // Let's double-check if the *next* visible step actually exists
             const stepDefForNextView = getStepDefinition(nextVisible);
             if (!stepDefForNextView && currentStep <= steps.length) {
                 // We might have skipped the last step(s), so we are done
                 console.log("Alle *synlige* trinn fullført, viser resultater.");
                 generateAndShowRecommendations();
             } else {
                 updateView(); // Update to show the next question
             }
         }
    }

   function handleBack() {
        // Ensure elements exist
        if (!recommendationsSection || !questionsSection) {
             console.error("handleBack: Kan ikke finne nødvendige seksjoner.");
             return;
        }

        if (showRecommendationsView) {
             showRecommendationsView = false;
             // Find the logical step index corresponding to the last visible step number
             const lastVisibleStepNum = calculateTotalVisibleSteps();
             let lastVisibleStepLogicalIndex = 0;
             let visibleCount = 0;
              for (let i = 0; i < steps.length; i++) {
                    const stepDef = steps[i];
                    if (!stepDef.condition || stepDef.condition()) {
                        visibleCount++;
                        if (visibleCount === lastVisibleStepNum) {
                            lastVisibleStepLogicalIndex = i;
                            break;
                        }
                    }
                }
             currentStep = lastVisibleStepLogicalIndex + 1; // Set logical step to the last visible one
             updateView();
         } else {
             let previousVisibleStepIndex = -1;
             let targetVisibleStepNum = calculateCurrentVisibleStep() - 1; // Target the previous VISIBLE step number

             if (targetVisibleStepNum >= 1) {
                 let visibleStepCounter = 0;
                 for (let i = 0; i < steps.length; i++) {
                     const stepDef = steps[i];
                     if (!stepDef.condition || stepDef.condition()) {
                         visibleStepCounter++;
                         if (visibleStepCounter === targetVisibleStepNum) {
                             previousVisibleStepIndex = i;
                             break;
                         }
                     }
                 }

                 if (previousVisibleStepIndex !== -1) {
                     currentStep = previousVisibleStepIndex + 1; // Set logical step index + 1
                      // Optionally clear the selection for the step we *came from*
                      const stepWeLeftIndex = currentStep; // Index of the step we are now showing alternatives for
                      if(steps[stepWeLeftIndex]) {
                         const stepIdWeLeft = steps[stepWeLeftIndex].id;
                         // selections[stepIdWeLeft] = null; // Uncomment to clear future selections on back
                      }
                     updateView();
                 } else {
                     console.warn("Kunne ikke finne forrige synlige trinn index ved tilbake.");
                     resetAdvisor();
                 }
             } else {
                 console.log("Kan ikke gå tilbake fra første trinn.");
             }
         }
    }

    function resetAdvisor() {
        currentStep = 1;
        selections = { purpose: null, distance: null, bikeType: null, cargo: null, frameType: null, cargoLocation: null };
        recommendations = [];
        showRecommendationsView = false;
        // Ensure all elements exist before resetting view
        if (questionsSection && recommendationsSection) {
            updateView(); // Update view to show first step
        } else {
            console.error("resetAdvisor: Kan ikke oppdatere view, elementer mangler.");
        }
    }


    // --- 9. Initialisering ---
    // Add checks to ensure buttons exist before adding listeners
    if(backButton) backButton.addEventListener('click', handleBack);
    if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
    if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
    if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // Initial setup
    totalSteps = calculateTotalVisibleSteps();
    console.log("Initialiserer rådgiver...");
    updateView(); // Show the first step

});
