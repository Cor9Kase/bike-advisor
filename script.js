document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data (Riese & Müller / Tern Eksempler) ---
    // VIKTIG: Bytt ut placeholder-URLer med ekte bilde-URLer og produktlenker!
    // VIKTIG: Bytt ut prisformat (€) til kr hvis ønskelig.
    const BikeCatalog = {
        evoOriginal: [
            // Pendling
            {
                id: 'rm-charger4-gt',
                name: "Riese & Müller Charger4 GT",
                purpose: ['pendling', 'trekking'],
                description: "Et ypperlig pendlervalg med integrert 750 Wh batteri som gir lang rekkevidde og kraftig Bosch-motor for høy marsjfart. Dempegaffel og dempet setepinne sørger for komfort selv på ujevn asfalt.",
                features: ["750 Wh batteri", "Kraftig Bosch-motor", "Dempegaffel", "Dempet setepinne", "Kontinuerlig kjørelys"],
                price: "5,699.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Charger4+GT", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: null,
                distance_km: [40, 120]
            },
            {
                id: 'tern-quick-haul-d8',
                name: "Tern Quick Haul D8",
                purpose: ['pendling', 'bybruk', 'allsidig', 'transport'],
                description: "En kompakt elsykkel som kombinerer bysykkelens smidighet med noe lastkapasitet. Lett å manøvrere i bytrafikk og tar liten plass på kontoret eller i boden.",
                features: ["400 Wh batteri", "Bosch-motor", "Kompakt", "Ergonomisk sittestilling", "Robust ramme", "50 kg lastkapasitet (bak)"],
                price: "3,499.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Quick+Haul+D8", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['low-step'],
                speed_kmh: 25,
                cargo_capacity: 'medium',
                cargo_location: 'rear',
                distance_km: [20, 70]
            },
            {
                id: 'rm-roadster',
                name: "Riese & Müller Roadster",
                purpose: ['pendling', 'bybruk'],
                description: "En sporty pendlesykkel med slank, tradisjonell ramme. Den er rask og lettkjørt, med en sterk Bosch Performance-motor som gir rask akselerasjon.",
                features: ["Bosch Performance-motor", "Slank ramme", "Fremoverlent kjørestilling", "Smalere dekk", "Dempegaffel"],
                price: "4,499.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Roadster", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: null,
                distance_km: [30, 80]
            },

            // Bybruk
            {
                id: 'rm-swing',
                name: "Riese & Müller Swing",
                purpose: ['bybruk', 'leisure'],
                description: "En klassisk komfort-elsykkel i retrostil, rettet mot bysykling i rolig tempo. Elegant buet lav-innstegsramme, dempegaffel og dempet setepinne.",
                features: ["Lav-innstegsramme", "Dempegaffel", "Dempet setepinne", "Navgir og beltedrift", "Oppreist, avslappet sittestilling"],
                price: "4,299.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Swing", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['low-step'],
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: null,
                distance_km: [30, 80]
            },
            {
                id: 'tern-nbd',
                name: "Tern NBD",
                purpose: ['bybruk', 'leisure', 'allsidig'],
                description: "Terns 'Near Busy Dad' (NBD) er en superlav innstegs elsykkel utformet for enkelhet og komfort i byen. Med ultralav ramme er det enkelt å sette føttene flatt i bakken.",
                features: ["Ultralav ramme (39 cm steg)", "Bosch Active Plus-motor", "Tykkere dekk", "Dempepinne i setet", "Brukervennlig"],
                price: "3,999.00 €",
                image: "https://via.placeholder.com/300x180.png?text=NBD", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['low-step'],
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: null,
                distance_km: [25, 70]
            },
            {
                id: 'rm-nevo4',
                name: "Riese & Müller Nevo4",
                purpose: ['bybruk', 'pendling', 'trekking', 'allsidig'],
                description: "En kombinasjon av komfort og allsidighet i et lavt innsteg-design. Gjennomstegsramme som gjør av- og påstigning enkelt.",
                features: ["Gjennomstegsramme", "Bosch CX-motor", "625-750 Wh batteri", "Solid bagasjebrett", "Dempet forgaffel"],
                price: "4,799.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Nevo4", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['low-step', 'mid-step'],
                speed_kmh: 25,
                cargo_capacity: 'medium',
                cargo_location: 'rear',
                distance_km: [40, 110]
            },

            // Terreng
            {
                id: 'rm-delite-mountain',
                name: "Riese & Müller Delite Mountain",
                purpose: ['terreng', 'mtb'],
                description: "En fulldempet terreng-elsykkel bygget for eventyr i høy hastighet. Fox Float bakdemper og 150 mm vandring foran, som sammen med en kraftig Bosch Performance CX-motor.",
                features: ["Fox Float bakdemper", "150mm vandring", "Bosch Performance CX-motor", "High Speed-klar", "Ekstremt kapabel offroad"],
                price: "6,999.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Delite+Mountain", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['high-step'],
                speed_kmh: 25,
                cargo_capacity: 'none',
                cargo_location: null,
                distance_km: [35, 90]
            },
            {
                id: 'rm-superdelite',
                name: "Riese & Müller Superdelite",
                purpose: ['terreng', 'trekking', 'pendling'],
                description: "'Super'-versjonen av Delite kommer med dobbelt batteri (1125 Wh totalt) for ekstra lang rekkevidde på raske turer. Skapt for de lengste og mest krevende turene.",
                features: ["Dobbelt batteri (1125 Wh)", "Full demping", "Rohloff elektronisk gir", "ABS-bremser (opsjon)", "DualBattery-teknologi"],
                price: "7,999.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Superdelite", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: null,
                distance_km: [60, 180]
            },

            // Transport
            {
                id: 'rm-load4-60',
                name: "Riese & Müller Load4 60",
                purpose: ['transport', 'family'],
                description: "En premium lastesykkel med frontmontert lasteplan og fulldempet ramme. Takler tung last (f.eks. to barn i kasse med kalesje) uten å kompromisse på stabilitet eller kjøreglede.",
                features: ["Bosch Cargo Line-motor", "Fulldempet", "Frontmontert lasteplan", "Lavt tyngdepunkt", "Høy stabilitet"],
                price: "7,299.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Load4+60", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['cargo'],
                speed_kmh: 25,
                cargo_capacity: 'massive',
                cargo_location: 'front',
                distance_km: [30, 80]
            },
            {
                id: 'tern-gsd-s10',
                name: "Tern GSD S10",
                purpose: ['transport', 'family', 'allsidig'],
                description: "Terns velkjente longtail-lastesykkel, designet for å erstatte bilen i hverdagen. Kompakt format men kan frakte opp til to barn eller store varemengder på det forlengede bakre lasteplanet.",
                features: ["Bosch Cargo-motor", "Mulighet for doble batterier", "Kompakt format", "Tilbehør for barn og hund", "Garasjevennlig størrelse"],
                price: "5,499.00 €",
                image: "https://via.placeholder.com/300x180.png?text=GSD+S10", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['cargo-longtail'],
                speed_kmh: 25,
                cargo_capacity: 'massive',
                cargo_location: 'rear',
                distance_km: [30, 100]
            },
            {
                id: 'rm-packster-70',
                name: "Riese & Müller Packster 70",
                purpose: ['transport', 'family', 'business'],
                description: "En frontlaster spesialdesignet for familier og varelevering. Romslig transportboks foran med benker til barn og sikkerhetsbelter.",
                features: ["Bosch Performance CX-motor", "Stort lastevolum", "Familievennlig", "Tilbehør for ulike behov", "God balanse mellom pris og funksjonalitet"],
                price: "6,699.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Packster+70", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['cargo'],
                speed_kmh: 25,
                cargo_capacity: 'massive',
                cargo_location: 'front',
                distance_km: [30, 80]
            },

            // Allsidig
            {
                id: 'rm-multicharger2',
                name: "Riese & Müller Multicharger2",
                purpose: ['allsidig', 'transport', 'trekking', 'family'],
                description: "Bygget for å takle flere oppgaver. En miks av terrengsykkel og longtail-lastesykkel med utvidet bagasjebrett som kan ta barneseter eller sidevesker med varer.",
                features: ["Bosch CX-motor", "Opptil 750 Wh batteri", "Family-utgave med barneseter", "Sidevesker", "Offroad-kapasitet"],
                price: "5,868.60 €",
                image: "https://via.placeholder.com/300x180.png?text=Multicharger2", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25,
                cargo_capacity: 'large',
                cargo_location: 'rear',
                distance_km: [40, 110]
            },
            // Tern Quick Haul D8 er allerede listet under Pendling, men passer også her.
            {
                id: 'rm-multitinker',
                name: "Riese & Müller Multitinker",
                purpose: ['allsidig', 'bybruk', 'transport', 'family'],
                description: "En ultraversatil bysykkel med kompakte 20' hjul og lang akselavstand med integrert bagasjebrett, noe som gir lavt tyngdepunkt og stabilitet med last.",
                features: ["Kompakte 20' hjul", "Last opp til 100 kg", "To barn bakpå", "Kort for bysykling", "Fullt utstyrt"],
                price: "4,999.00 €",
                image: "https://via.placeholder.com/300x180.png?text=Multitinker", // Bytt ut!
                productUrl: "#", // Bytt ut!
                frame_types: ['low-step'],
                speed_kmh: 25,
                cargo_capacity: 'large',
                cargo_location: 'rear',
                distance_km: [30, 80]
            }
        ]
    };


    // --- 2. State Variabler ---
    let currentStep = 1;
    let totalSteps = 6; // Startverdi, justeres dynamisk
    let selections = {
        purpose: null,
        distance: null,
        bikeType: null,
        cargo: null,
        frameType: null,
        cargoLocation: null
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
                { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' }
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
                { id: 'highSpeed', label: 'S-Pedelec / Speed Bike (opptil 45 km/t)' }
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
                { id: 'frontlaster', label: 'Frontlaster', image: 'https://via.placeholder.com/80x60.png?text=Front', description: 'Lasteboks foran', className: 'cargo-type' }, // Bytt ut bilde!
                { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://via.placeholder.com/80x60.png?text=Rear', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } // Bytt ut bilde!
            ],
            condition: () => selections.purpose === 'transport' // Betingelse for å vise trinnet
        }
    ];
    totalSteps = calculateTotalVisibleSteps(); // Sett totalt antall trinn basert på initielle forhold


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
        const option = optionsArray.find(opt => opt.id === id);
        return option ? option.label : `[${id}]`;
    }

    function updateProgress() {
        const currentVisibleStep = calculateCurrentVisibleStep();
        const totalVisibleSteps = calculateTotalVisibleSteps(); // Beregn på nytt i tilfelle forhold endres

        const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`;
    }

     function calculateCurrentVisibleStep() {
        let visibleStepCount = 0;
         // Gå gjennom trinnene opp til (men ikke inkludert) det logiske currentStep
         for (let i = 0; i < currentStep; i++) {
            const stepDef = steps[i];
            // Hvis trinnet ikke har en betingelse ELLER betingelsen er oppfylt
             if (!stepDef || !stepDef.condition || stepDef.condition()) {
                 visibleStepCount++;
             }
         }
         // Returnerer 1 for første trinn, 2 for andre synlige trinn, etc.
         // Hvis currentStep er 1, returnerer den 1 (siden løkken ikke kjører)
         return Math.max(1, visibleStepCount); // Sørg for at vi minst returnerer 1
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
        const purposeLabel = selections.purpose ? `<span class="selected-value">${getLabelById(steps[0].options, selections.purpose)}</span>` : `<span class="placeholder">bruksområde</span>`;
        const distanceLabel = selections.distance ? `<span class="selected-value">${getLabelById(steps[1].options, selections.distance)}</span>` : `<span class="placeholder">reiseavstand</span>`;
        const bikeTypeLabel = selections.bikeType ? `<span class="selected-value">${getLabelById(steps[2].options, selections.bikeType)}</span>` : `<span class="placeholder">sykkeltype</span>`;

        let details = "";
        if (selections.cargo) {
             details += ` Jeg transporterer ofte <span class="selected-value">${getLabelById(steps[3].options, selections.cargo)}</span>`;
        }
         if (selections.purpose === 'transport' && selections.cargoLocation) {
            details += ` med <span class="selected-value">${getLabelById(steps[5].options, selections.cargoLocation)}</span>`;
        }
         if (selections.frameType) {
            details += `. Foretrekker en ramme med <span class="selected-value">${getLabelById(steps[4].options, selections.frameType)}</span>`;
        }

        targetElement.innerHTML = `
            <p>Med min sykkel ønsker jeg først og fremst ${purposeLabel}
            og planlegger regelmessige reiser på ${distanceLabel}.
            Jeg ønsker ${bikeTypeLabel}.${details}.</p>
        `;
    }

    function renderOptions() {
         // Først, beregn hvilket *synlig* trinn vi er på
         const currentVisibleStepNum = calculateCurrentVisibleStep();
         const stepDef = getStepDefinition(currentVisibleStepNum); // Hent definisjon basert på synlig trinnnummer

        if (!stepDef) {
            console.error("Kunne ikke finne definisjon for synlig trinn:", currentVisibleStepNum, "(logisk trinn:", currentStep, ")");
             generateAndShowRecommendations(); // Gå til resultater hvis vi er "ferdig"
            return;
        }

        stepTitle.textContent = stepDef.title;
        stepOptions.innerHTML = '';

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
             buttonContent += `<div>${option.label}</div>`;

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

        updateProgress();
    }

     function renderRecommendations() {
        recommendationsOutput.innerHTML = '';

        if (recommendations.length === 0) {
            // Bruker HTML som vist i brukerens bilde
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

    function updateView() {
        if (showRecommendationsView) {
            questionsSection.classList.add('hidden');
            recommendationsSection.classList.remove('hidden');
            renderSentence(summarySentenceFinal);
            renderRecommendations();
            advisorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            questionsSection.classList.remove('hidden');
            recommendationsSection.classList.add('hidden');
            renderSentence(sentenceBuilder);
            renderOptions();
            // Vis/skjul tilbakeknapp basert på *synlig* trinnnummer
            backButton.classList.toggle('hidden', calculateCurrentVisibleStep() <= 1);
        }
        // Sørg for at totalt antall trinn er oppdatert
        totalSteps = calculateTotalVisibleSteps();
        updateProgress(); // Oppdater progressbar uansett view
    }

    // --- 7. Logikk for Anbefalinger (Oppdatert regelbasert) ---
    function generateAndShowRecommendations() {
        console.log("Genererer anbefalinger basert på:", selections);

        // 1. Start med sykler som matcher valgt formål
        let potentialMatches = BikeCatalog.evoOriginal.filter(bike =>
            bike.purpose && bike.purpose.includes(selections.purpose)
        );
        console.log(`Fant ${potentialMatches.length} sykler for formål: ${selections.purpose}`);

        // 2. Spesialfiltrering for 'transport' basert på 'cargoLocation'
        if (selections.purpose === 'transport' && selections.cargoLocation) {
            console.log(`Filtrerer transport-sykler for lastetype: ${selections.cargoLocation}`);
            potentialMatches = potentialMatches.filter(bike => {
                const targetLocation = selections.cargoLocation === 'frontlaster' ? 'front' : 'rear';
                return bike.cargo_location === targetLocation;
            });
            console.log(`Etter lastetype-filter: ${potentialMatches.length} sykler igjen.`);
        }

        // 3. Valgfri Sortering (prioriter match på rammetype hvis valgt)
        if (selections.frameType) {
            const frameMap = { dypGjennomgang: 'low-step', lavtTopprør: 'mid-step', høytTopprør: 'high-step' };
            const desiredFrameInternal = frameMap[selections.frameType];

            potentialMatches.sort((a, b) => {
                const aMatchesFrame = a.frame_types && a.frame_types.includes(desiredFrameInternal);
                const bMatchesFrame = b.frame_types && b.frame_types.includes(desiredFrameInternal);

                if (aMatchesFrame && !bMatchesFrame) return -1;
                if (!aMatchesFrame && bMatchesFrame) return 1;
                return 0;
            });
            console.log("Sortert basert på rammetype-match (hvis valgt).");
        }
        // Andre sorteringer kan legges til her (f.eks. på pris, batteri...)

        // 4. Begrens til topp 3 resultater
        recommendations = potentialMatches.slice(0, 3);
        console.log("Endelige anbefalinger:", recommendations.map(b => b.name));

        // 5. Vis resultat-viewet
        showRecommendationsView = true;
        updateView();
    }


    // --- 8. Event Handlers ---
    function handleOptionSelect(stepId, value) {
        // Oppdater state
        selections[stepId] = value;
        console.log("Valg oppdatert:", selections);

        // Gå til neste logiske trinn
        currentStep++;

         // Sjekk om neste trinn er betinget og ikke skal vises
         let nextStepDef = steps[currentStep - 1]; // Husk 0-basert index
         while(nextStepDef && nextStepDef.condition && !nextStepDef.condition()) {
             console.log(`Hopper over betinget trinn ${currentStep}: ${nextStepDef.id}`);
             currentStep++; // Hopp over dette trinnet
             nextStepDef = steps[currentStep - 1];
         }

        // Sjekk om vi er ferdige (currentStep er nå *etter* siste synlige trinn)
        if (currentStep > steps.length) { // Eller en mer robust sjekk basert på synlige trinn
             console.log("Alle trinn fullført, viser resultater.");
             generateAndShowRecommendations();
        } else {
             // Gå til neste trinn (eller det første etter overhoppede)
             updateView();
         }
    }


   function handleBack() {
        if (showRecommendationsView) {
             // Går tilbake fra resultatvisning til siste spørsmål
             showRecommendationsView = false;
             // currentStep er allerede forbi siste trinn, trenger ikke endre det
             updateView();
         } else {
             // Går tilbake mellom spørsmål
             // Må finne det *forrige* synlige trinnet
             let previousVisibleStepIndex = -1;
             let targetVisibleStepNum = calculateCurrentVisibleStep() - 1; // Vi vil til det *forrige* synlige

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
                     currentStep = previousVisibleStepIndex + 1; // Sett logisk trinn
                     // Nullstill valget for trinnet vi går tilbake fra? Valgfritt, men ofte lurt
                     // const stepIdToReset = steps[currentStep]?.id; // Id for trinnet ETTER det vi går til
                     // if(stepIdToReset) selections[stepIdToReset] = null;

                     updateView();
                 } else {
                     console.warn("Kunne ikke finne forrige synlige trinn index.");
                     resetAdvisor(); // Fallback
                 }
             } else {
                 console.log("Kan ikke gå tilbake fra første trinn.");
                 // Tilbake-knappen skal være skjult her uansett via updateView()
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
        totalSteps = calculateTotalVisibleSteps(); // Resett totalt antall
        updateView();
    }


    // --- 9. Initialisering ---
    backButton.addEventListener('click', handleBack);
    resetButtonStep.addEventListener('click', resetAdvisor);
    resetButtonFinal.addEventListener('click', resetAdvisor);
    currentYearSpan.textContent = new Date().getFullYear();

    // Initial view setup
    totalSteps = calculateTotalVisibleSteps(); // Beregn initielt antall trinn
    updateView();

});
