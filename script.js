document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data (OPPDATERT med kundens fulle liste og detaljer) ---
    const BikeCatalog = {
        evoOriginal: [
            {
                id: 'tern-quick-haul-p9',
                name: "Quick Haul P9",
                purpose: ['bybruk', 'transport', 'pendling', 'allsidig', 'family'], // Basert på "Bybruk/Transport" + info
                description: "Kompakt og kraftig elsykkel med langt bagasjebrett (opptil 50 kg). Perfekt til både hverdag og småtransport – barn, handleposer eller hund. Brukervennlig, tilpassbar og solid bygget.",
                features: ["Bosch Performance Line?", "400Wh batteri?", "Langt bagasjebrett (50 kg)", "1 barn kapasitet", "Kompakt", "Brukervennlig"], // Antatt 1 barn
                price: "KR 29.900", // Tilbudspris
                image: "https://evoelsykler.no/wp-content/uploads/2024/06/Quick-Haul-H9-gronn-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-p9-400/",
                frame_types: ['low-step'],
                speed_kmh: 25,
                cargo_capacity: 'medium', // 50kg er bra for kompakt
                cargo_location: 'rear',
                distance_km: [20, 70], // Estimat
                maxChildren: 1, // Antatt basert på type
                preOrdered: true
            },
            {
                id: 'rm-multicharger2-mixte-gt-vario-family',
                name: "Multicharger Mixte GT vario Family", // R&M navn lagt til for ID
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'], // Basert på "Transport/Pendling"
                description: "Kraftig familiesykkel med plass til to barn og cargo foran. Beltedrift, trinnløst gir og 750 Wh batteri gir lang rekkevidde og lite vedlikehold. Lavt innsteg og komfortdemping.",
                features: ["Plass til to barn", "Beltedrift", "Enviolo Trinnløst gir", "750 Wh batteri", "Mixte-ramme (lavt innsteg)", "Komfortdemping", "Bosch CX motor?"], // Cargo foran stemmer ikke for Multicharger?
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-vario-family/",
                frame_types: ['mid-step'], // Mixte er mid-step
                speed_kmh: 25,
                cargo_capacity: 'large',
                cargo_location: 'rear', // Multicharger er rear
                distance_km: [40, 110], // Estimat
                maxChildren: 2,
                preOrdered: true
            },
            {
                id: 'rm-multicharger2-mixte-gt-touring-family',
                name: "Multicharger Mixte GT Touring Family", // R&M navn lagt til for ID
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'], // Basert på "Transport/Pendling"
                description: "Allsidig elsykkel for familien – trygg transport av barn og last. 750 Wh batteri, Shimano XT-gir og lavt innsteg. Perfekt til både hverdag og helg.",
                features: ["Trygg transport av barn/last", "750 Wh batteri", "Shimano XT-gir", "Mixte-ramme (lavt innsteg)", "Family Kit", "Bosch CX motor?"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-touring-family/",
                frame_types: ['mid-step'],
                speed_kmh: 25,
                cargo_capacity: 'large',
                cargo_location: 'rear',
                distance_km: [40, 110],
                maxChildren: 2,
                preOrdered: true
            },
            {
                id: 'rm-multitinker-touring-family',
                name: "Multitinker Touring Family", // R&M navn lagt til for ID
                purpose: ['transport', 'bybruk', 'allsidig', 'family'], // Basert på "Transport/Bybruk"
                description: "Smart bysykkel med plass til to barn eller stor last. Shimano 11-gir og kjededrift gir kraft i motbakker. Kompakt, stabil og tilpasningsdyktig.",
                features: ["Plass til to barn", "Shimano 11-gir", "Kjededrift", "Kompakt (20\" hjul)", "Stabil", "Tilpasningsdyktig", "Bosch CX motor?"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-touring-family/",
                frame_types: ['low-step'], // Multitinker er low-step
                speed_kmh: 25,
                cargo_capacity: 'large',
                cargo_location: 'rear',
                distance_km: [30, 80], // Estimat
                maxChildren: 2,
                preOrdered: true
            },
            {
                id: 'rm-multitinker-vario-family',
                name: "Multitinker Vario Family", // R&M navn lagt til for ID
                purpose: ['transport', 'bybruk', 'allsidig', 'family'], // Basert på "Transport/Bybruk"
                description: "Samme stabile Multitinker med trinnløst gir og beltedrift for enklere vedlikehold. Komfortabel, trygg og bygget for byliv med barn eller varer.",
                features: ["Plass til to barn?", "Enviolo Trinnløst gir", "Beltedrift", "Kompakt (20\" hjul)", "Stabil", "Komfortabel", "Trygg", "Bosch CX motor?"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-vario-family/",
                frame_types: ['low-step'],
                speed_kmh: 25,
                cargo_capacity: 'large',
                cargo_location: 'rear',
                distance_km: [30, 80],
                maxChildren: 2, // Antatt 2 barn
                preOrdered: true
            },
            {
                id: 'tern-quick-haul-long-d9', // Lagt til D9 for spesifisitet
                name: "Quick Haul Long D9 400",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'], // Basert på "Transport/Bybruk"
                description: "Lang og robust elsykkel som kan bære to barn og tung last. Stabil, lett å manøvrere og enkel å dele. 400 Wh batteri og Bosch Cargo Line-motor.",
                features: ["Plass til to barn", "Tung last", "Stabil", "Lett å manøvrere", "400 Wh batteri", "Bosch Cargo Line-motor", "Langt bagasjebrett"],
                price: "KR 49.900",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-long-d9-400/",
                frame_types: ['low-step'], // Antatt low-step
                speed_kmh: 25,
                cargo_capacity: 'large', // Longtail
                cargo_location: 'rear',
                distance_km: [25, 60], // 400Wh + Cargo Line
                maxChildren: 2,
                preOrdered: true
            },
            {
                id: 'rm-nevo4-gt-vario-core',
                name: "NEVO4 GT vario CORE", // R&M navn for ID
                purpose: ['bybruk', 'pendling', 'allsidig', 'trekking'], // Basert på "Bybruk/Pendling"
                description: "Stilren bysykkel med lavt innsteg og trinnløst gir. Komfortabel, vedlikeholdsvennlig og solid – perfekt for daglig bruk året rundt.",
                features: ["Lavt innsteg (GTS)", "Enviolo Trinnløst gir", "Beltedrift?", "Komfortabel", "Vedlikeholdsvennlig", "Bosch CX motor?"],
                price: "KR 63.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-nevo4-gt-vario-core/",
                frame_types: ['low-step'], // Nevo er typisk low-step
                speed_kmh: 25,
                cargo_capacity: 'medium',
                cargo_location: 'rear',
                distance_km: [40, 100], // Estimat
                maxChildren: 0, // Ikke primært for barn
                preOrdered: true
            },
            {
                id: 'rm-roadster4-touring',
                name: "Roadster4 Touring", // R&M navn for ID
                purpose: ['pendling', 'bybruk'], // Basert på "Pendling/Bybruk"
                description: "Elegant elsykkel med kraft og rekkevidde for både by og tur. Shimano 11-gir, 625 Wh batteri og moderne design.",
                features: ["Elegant design", "Shimano 11-gir", "625 Wh batteri", "Moderne", "Bosch Performance SX?"],
                price: "KR 59.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-roadster4-touring/",
                frame_types: ['high-step', 'mid-step'], // Roadster finnes i begge
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: 'rear',
                distance_km: [35, 90], // Estimat
                maxChildren: 0,
                preOrdered: true
            },
            {
                id: 'tern-orox-s12',
                name: "Tern Orox S12 27,5",
                purpose: ['terreng', 'transport', 'allsidig', 'adventure'], // Basert på "Terreng/Transport"
                description: "Terrengsykkel med el og last. Tåler 210 kg og alle typer føre med sine brede fatbike-dekk. Perfekt for eventyr og tung last.",
                features: ["Høy lastekapasitet (210kg)", "Fatbike-dekk (27.5\")", "Klar for alle fører", "Eventyrklar", "Tung last", "Bosch Performance CX?"],
                price: "KR 80.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/tern-orox-s12-275/",
                frame_types: ['high-step'], // Ser ut som high-step
                speed_kmh: 25,
                cargo_capacity: 'massive', // 210kg kapasitet
                cargo_location: 'rear', // Pluss ramme
                distance_km: [40, 120], // Antatt dobbel batteri mulighet
                maxChildren: 2, // Kan ta barneseter
                preOrdered: true // Antatt preordered
            },
            {
                id: 'rm-load4-75-touring-familie',
                name: "Load4 75 Touring Familie", // R&M navn for ID
                purpose: ['transport', 'family', 'pendling'], // Basert på "Transport/Pendling" + Familie
                description: "Fullfjæret lastesykkel med plass til tre barn. Svært komfortabel og kraftig eldrift. Komplett familiepakke inkludert.",
                features: ["Plass til tre barn", "Fullfjæret", "Komfortabel", "Kraftig (Bosch Cargo Line)", "Shimano 11-gir?", "Komplett familiepakke"],
                price: "KR 108.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-touring-familie-2/",
                frame_types: ['cargo'],
                speed_kmh: 25,
                cargo_capacity: 'massive',
                cargo_location: 'front',
                distance_km: [30, 80], // Estimat
                maxChildren: 3,
                preOrdered: true
            },
            {
                id: 'rm-load4-60-touring-familie',
                name: "Load4 60 Touring Familie", // R&M navn for ID
                purpose: ['transport', 'family', 'pendling'], // Basert på "Transport/Pendling" + Familie
                description: "Kompakt familiesykkel med demping og plass til to barn. Bosch Cargo Line og Shimano 11-gir. Inkluderer alt du trenger for familiebruk.",
                features: ["Plass til to barn", "Fulldempet", "Kompakt (60cm)", "Bosch Cargo Line", "Shimano 11-gir", "Komplett familiepakke"],
                price: "KR 99.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp", // Placeholder - BYTT UT
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-60-touring-familie-2/",
                frame_types: ['cargo'],
                speed_kmh: 25,
                cargo_capacity: 'massive',
                cargo_location: 'front',
                distance_km: [30, 80],
                maxChildren: 2,
                preOrdered: true
            },
            {
                id: 'rm-delite5-gt-pinion',
                name: "Delite5 GT pinion", // R&M navn for ID
                purpose: ['pendling', 'terreng', 'trekking', 'adventure'], // Basert på "Pendling/Terreng"
                description: "Premium elsykkel med integrert gir og fulldemping. Lang rekkevidde, lavt vedlikehold og bygget for både pendling og eventyr.",
                features: ["Pinion integrert gir", "Beltedrift?", "Fulldempet", "Lang rekkevidde", "Lavt vedlikehold", "Bosch Performance CX?", "GT (Brede dekk)"],
                price: "KR 105.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/09/25_F01315_040209081506_Delite5_GT_Pinion_51_StoneGrey_2755-640x427.jpg", // Korrekt bilde
                productUrl: "https://evoelsykler.no/produkt/riese-muller-delite5-gt-pinion/",
                frame_types: ['high-step', 'mid-step'], // Delite finnes ofte i begge
                speed_kmh: 25,
                cargo_capacity: 'small', // Kan ha bagasjebrett
                cargo_location: 'rear', // Hvis bagasjebrett
                distance_km: [50, 150], // Kan ha dual battery
                maxChildren: 0, // Ikke for barn
                preOrdered: true // Antatt preordered
            },
            {
                id: 'rm-load4-75-vario-familie',
                name: "Load4 75 Vario Familie", // R&M navn for ID
                purpose: ['transport', 'family', 'pendling'], // Basert på "Transport/Pendling" + Familie
                description: "Robust familiesykkel med trinnløst gir og beltedrift. Plass til tre barn, demping foran og bak, og komplett tilbehørspakke.",
                features: ["Plass til tre barn", "Enviolo Trinnløst gir", "Beltedrift", "Fulldempet", "Bosch Cargo Line", "Komplett familiepakke"],
                price: "KR 113.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load4-75-vario-familie-peanut-prod-640x427.jpg", // Korrekt bilde
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-vario-familie-2/",
                frame_types: ['cargo'],
                speed_kmh: 25,
                cargo_capacity: 'massive',
                cargo_location: 'front',
                distance_km: [30, 80],
                maxChildren: 3,
                preOrdered: true
            }
            // Fjernet alle de gamle syklene som ikke var på den nye listen
        ]
    };


    // --- State, DOM Refs, Steps definisjon (bruker forrige versjon, ingen endringer her) ---
    let currentStep = 1;
    let totalSteps = 5; // Justert startverdi (fjerner 1 trinn, legger til 1 betinget)
    let selections = {
        purpose: null,
        distance: null,
        cargo: null,
        childCapacity: null, // NYTT FELT
        frameType: null,
        cargoLocation: null // For transport-spesifikk
    };
    let recommendations = [];
    let showRecommendationsView = false;

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


     const steps = [
         { // Trinn 1: Formål
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
         { // Trinn 2: Avstand
             id: 'distance',
             title: 'Hvilken reiseavstand planlegger du regelmessig (per tur)?',
             options: [
                 { id: 'kort', label: 'Kortere avstander (opptil 20 km)' },
                 { id: 'medium', label: 'Mellomdistanse (20-50 km)' },
                 { id: 'lang', label: 'Lange avstander (50+ km)' }
             ]
         },
         { // Trinn 3 (Ny nummerering): Lastemengde
             id: 'cargo',
             title: 'Hvor mye trenger du vanligvis å frakte?',
             options: [
                 { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, // Endret label litt
                 { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, // Endret label litt
                 { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } // Endret label litt
             ]
         },
         { // Trinn 4 (Ny nummerering): Barnekapasitet (BETINGET)
             id: 'childCapacity',
             title: 'Planlegger du å transportere barn?',
             options: [
                 { id: 'ingen', label: 'Nei / Ikke relevant' }, // Viktig for de som trenger stor last men ikke barn
                 { id: 'ett', label: 'Ja, ett barn' },
                 { id: 'flere', label: 'Ja, to eller flere barn' }
             ],
              // Vises hvis formål er transport/allsidig ELLER hvis de trenger å frakte mye
             condition: () => selections.purpose === 'transport' || selections.purpose === 'allsidig' || selections.cargo === 'massiv'
         },
         { // Trinn 5 (Ny nummerering): Rammetype
             id: 'frameType',
             title: 'Hvilken rammetype foretrekker du?',
             options: [
                 { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' },
                 { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' },
                 { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' }
             ]
         },
         { // Trinn 6 (Ny nummerering): Lastelokasjon (BETINGET, KUN for transport)
             id: 'cargoLocation',
             title: 'Hvilken type lastesykkel ser du for deg?',
             options: [
                 { id: 'frontlaster', label: 'Frontlaster', image: 'https://via.placeholder.com/80x60.png?text=Front', description: 'Lasteboks foran', className: 'cargo-type' },
                 { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://via.placeholder.com/80x60.png?text=Rear', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' }
             ],
             condition: () => selections.purpose === 'transport' // Kun for transport-formål
         }
     ];
     totalSteps = calculateTotalVisibleSteps();


    // --- Hjelpefunksjoner (fra forrige versjon, ingen endringer nødvendig) ---
     function getStepDefinition(stepNum) { /* ... uendret ... */
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
        console.warn("Fant ikke definisjon for synlig trinn:", stepNum);
        return null;
     }
     function getLabelById(optionsArray, id) { /* ... uendret ... */
        if (!optionsArray || !id) return `[mangler data]`; // Sikkerhetssjekk
        const option = optionsArray.find(opt => opt.id === id);
        return option ? option.label : `[${id}]`;
     }
     function updateProgress() { /* ... uendret ... */
        const currentVisibleStep = calculateCurrentVisibleStep();
        const totalVisibleSteps = calculateTotalVisibleSteps();
        const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0;
        progressBar.style.width = `${Math.min(100, progressPercentage)}%`;
        progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`;
     }
     function calculateCurrentVisibleStep() { /* ... uendret ... */
        let visibleStepCount = 0;
        let logicalStepIndex = 0;
        while(logicalStepIndex < currentStep && logicalStepIndex < steps.length) {
             const stepDef = steps[logicalStepIndex];
             if (!stepDef.condition || stepDef.condition()) {
                 visibleStepCount++;
             }
             logicalStepIndex++;
        }
        const totalVisible = calculateTotalVisibleSteps();
        // Returner det synlige nummeret for trinnet vi *er på* eller *skal til*
        // Hvis currentStep peker *etter* siste logiske trinn, bruk totalt antall synlige
        return currentStep > steps.length ? totalVisible : Math.min(Math.max(1, visibleStepCount), totalVisible);
     }
     function calculateTotalVisibleSteps() { /* ... uendret ... */
          let totalVisible = 0;
          steps.forEach(step => {
              if (!step.condition || step.condition()) {
                  totalVisible++;
              }
          });
          return totalVisible;
     }

    // --- Rendering Funksjoner (fra forrige versjon, ingen endringer nødvendig) ---
     function renderSentence(targetElement) { /* ... uendret ... */
        const createSpan = (selectionValue, stepId, placeholderText) => {
             const stepDef = steps.find(s => s.id === stepId);
             if (!stepDef) return `<span class="placeholder">[${stepId}?]</span>`;
             const isActive = !stepDef.condition || stepDef.condition();
             if (selectionValue && isActive) {
                 return `<span class="selected-value">${getLabelById(stepDef.options, selectionValue)}</span>`;
             } else if (isActive) {
                 return `<span class="placeholder">${placeholderText}</span>`;
             }
             return ''; // Ikke vis placeholder eller verdi hvis steget ikke er aktivt
         };

         const purposeSpan = createSpan(selections.purpose, 'purpose', 'bruksområde');
         const distanceSpan = createSpan(selections.distance, 'distance', 'reiseavstand');
         const cargoSpan = createSpan(selections.cargo, 'cargo', 'lastemengde');
         const childCapacitySpan = createSpan(selections.childCapacity, 'childCapacity', 'antall barn');
         const frameTypeSpan = createSpan(selections.frameType, 'frameType', 'rammetype');
         const cargoLocationSpan = createSpan(selections.cargoLocation, 'cargoLocation', 'lastetype');

         let sentenceParts = [];
         if (purposeSpan) sentenceParts.push(`Jeg ser etter en elsykkel for ${purposeSpan}.`);
         if (distanceSpan) sentenceParts.push(`Den bør passe til ${distanceSpan} per tur.`);
         if (cargoSpan) sentenceParts.push(`Jeg trenger å frakte ${cargoSpan}.`);

         const childStepDef = steps.find(s => s.id === 'childCapacity');
         const childIsActive = childStepDef && (!childStepDef.condition || childStepDef.condition());
         if (childIsActive && selections.childCapacity && selections.childCapacity !== 'ingen') {
             sentenceParts.push(`Jeg planlegger å ta med ${childCapacitySpan}.`);
         } else if (childIsActive && selections.childCapacity === 'ingen') {
              sentenceParts.push(`Jeg trenger ikke plass til barn.`);
         }

         const cargoLocStepDef = steps.find(s => s.id === 'cargoLocation');
         const cargoLocIsActive = cargoLocStepDef && (!cargoLocStepDef.condition || cargoLocStepDef.condition());
         if (cargoLocIsActive && selections.cargoLocation) {
             sentenceParts.push(`Jeg ser for meg en ${cargoLocationSpan} sykkel.`);
         }

         if (frameTypeSpan) sentenceParts.push(`Jeg foretrekker en ramme med ${frameTypeSpan}.`);

         targetElement.innerHTML = `<p>${sentenceParts.join(' ').replace(/\s{2,}/g, ' ')}</p>`;
     }
     function renderOptions() { /* ... uendret ... */
         const currentVisibleStepNum = calculateCurrentVisibleStep();
         // Sikrer at vi ikke prøver å rendre alternativer for et trinn som ikke finnes
         // (f.eks. når currentStep er større enn antall trinn, før vi går til resultater)
         if (currentStep > steps.length) {
              console.log("renderOptions: currentStep > steps.length, hopper over rendering.");
              // Hvis vi ikke allerede er i anbefalingsvisning, start prosessen
               if (!showRecommendationsView) {
                  generateAndShowRecommendations();
               }
              return;
         }

         const stepDef = getStepDefinition(currentVisibleStepNum);

        if (!stepDef) {
            console.warn("renderOptions: Kunne ikke finne definisjon for synlig trinn:", currentVisibleStepNum, "Logisk trinn:", currentStep);
            if (!showRecommendationsView) {
                 console.log("renderOptions: Går til anbefalinger da stepDef mangler.");
                 generateAndShowRecommendations();
            }
            return;
        }

        stepTitle.textContent = stepDef.title;
        stepOptions.innerHTML = ''; // Tøm gamle alternativer

        stepDef.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            if(option.className) {
                 button.classList.add(option.className);
            }
            button.dataset.value = option.id;

            if (option.className === 'cargo-type') {
                 button.innerHTML = `
                    ${option.image ? `<img src="${option.image}" alt="${option.label}">` : ''}
                    <div>
                        <div>${option.label}</div>
                        ${option.description ? `<div class="description">${option.description}</div>` : ''}
                    </div>
                 `;
             } else {
                 let buttonContent = `<div>${option.label}</div>`;
                 if (option.description) {
                     buttonContent += `<div class="description">${option.description}</div>`;
                 }
                 button.innerHTML = buttonContent;
             }

            if (selections[stepDef.id] === option.id) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id));
            stepOptions.appendChild(button);
        });

        updateProgress();
     }
     function renderRecommendations() { /* ... uendret ... */
         recommendationsOutput.innerHTML = '';

         if (recommendations.length === 0) {
             recommendationsOutput.innerHTML = `
                 <div class="no-results" style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f8f9fa;">
                     <h3>Ingen perfekt match funnet</h3>
                     <p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100% blant våre anbefalte modeller akkurat nå.</p>
                     <p>Forslag:</p>
                     <ul style="margin-left: 20px; list-style: disc;">
                         <li>Prøv å gå tilbake og justere ett eller flere av valgene dine (f.eks. rammetype eller antall barn).</li>
                         <li>De anbefalte syklene er prioritert. Det kan finnes andre modeller som passer – <a href="#kontakt-oss-link">kontakt oss</a> gjerne direkte for full oversikt!</li>
                     </ul>
                 </div>`;
             return;
         }

         recommendations.forEach((bike, index) => {
             const card = document.createElement('div');
             card.classList.add('recommendation-card');

             let badgeText = '';
             // Prioriterer preOrdered badge hvis den finnes
             if(bike.preOrdered && index === 0) badgeText = 'TOPPVALG (FORHÅNDSBESTILT)';
             else if (bike.preOrdered) badgeText = 'ANBEFALT (FORHÅNDSBESTILT)';
             else if (index === 0) badgeText = 'TOPPVALG';
             else if (index === 1) badgeText = 'GOD MATCH';
             else badgeText = 'ALTERNATIV';


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
                         </div>
                     </div>
                 </div>
             `;
             recommendationsOutput.appendChild(card);
         });
     }
     function updateView() { /* ... uendret ... */
        totalSteps = calculateTotalVisibleSteps(); // Sørg for at totalt antall trinn er oppdatert

        if (showRecommendationsView) {
            questionsSection.classList.add('hidden');
            recommendationsSection.classList.remove('hidden');
            // renderSentence(summarySentenceFinal); // Rendres når generate kalles
        } else {
            questionsSection.classList.remove('hidden');
            recommendationsSection.classList.add('hidden');
            loadingIndicator.classList.add('hidden');
            recommendationsOutput.classList.add('hidden');
            renderSentence(sentenceBuilder);
            renderOptions(); // Render alternativer for gjeldende trinn
             // Vis/skjul tilbakeknapp basert på *synlig* trinn nummer
             const currentVisible = calculateCurrentVisibleStep();
            backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1); // Skjul kun på det aller første trinnet
        }
         updateProgress();
     }

    // --- Logikk for Anbefalinger (fra forrige versjon, ingen endringer nødvendig) ---
    function generateAndShowRecommendations() { /* ... uendret ... */
        console.log("Starter generering av anbefalinger med valg:", JSON.parse(JSON.stringify(selections)));

        showRecommendationsView = true;
        questionsSection.classList.add('hidden');
        recommendationsSection.classList.remove('hidden');
        recommendationsOutput.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        renderSentence(summarySentenceFinal);
        recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            console.log("Utfører filtrering og sortering...");

            let potentialMatches = [...BikeCatalog.evoOriginal];

            // Filter 1: Formål
            if (selections.purpose) {
                potentialMatches = potentialMatches.filter(bike =>
                    bike.purpose && bike.purpose.includes(selections.purpose)
                );
                console.log(`Etter formål (${selections.purpose}): ${potentialMatches.length} treff`);
            }

            // Filter 2: Avstand
            if (selections.distance) {
                let minRequiredRange = 0;
                if (selections.distance === 'medium') minRequiredRange = 20;
                else if (selections.distance === 'lang') minRequiredRange = 50;
                potentialMatches = potentialMatches.filter(bike =>
                    bike.distance_km && bike.distance_km[1] >= minRequiredRange
                );
                 console.log(`Etter avstand (${selections.distance} -> min ${minRequiredRange}km): ${potentialMatches.length} treff`);
            }

            // Filter 4: Lastemengde
            if (selections.cargo) {
                let requiredCapacityLevels = [];
                if (selections.cargo === 'små') requiredCapacityLevels = ['small', 'medium', 'large', 'massive'];
                else if (selections.cargo === 'store') requiredCapacityLevels = ['medium', 'large', 'massive'];
                else if (selections.cargo === 'massiv') requiredCapacityLevels = ['large', 'massive'];
                potentialMatches = potentialMatches.filter(bike =>
                    bike.cargo_capacity && requiredCapacityLevels.includes(bike.cargo_capacity)
                );
                 console.log(`Etter lastemengde (${selections.cargo} -> ${requiredCapacityLevels.join('/')}): ${potentialMatches.length} treff`);
            }

             // Filter 5: Barnekapasitet
             const childStepDefCheck = steps.find(s => s.id === 'childCapacity');
             const childQuestionAsked = !childStepDefCheck || !childStepDefCheck.condition || childStepDefCheck.condition();
             if (childQuestionAsked && selections.childCapacity) {
                 let minChildren = 0;
                 if (selections.childCapacity === 'ett') minChildren = 1;
                 else if (selections.childCapacity === 'flere') minChildren = 2;

                 if (minChildren > 0) {
                    potentialMatches = potentialMatches.filter(bike =>
                        bike.maxChildren !== null && bike.maxChildren !== undefined && bike.maxChildren >= minChildren
                    );
                    console.log(`Etter barnekapasitet (${selections.childCapacity} -> min ${minChildren}): ${potentialMatches.length} treff`);
                 } else { // selections.childCapacity === 'ingen'
                      // VIKTIG: Hvis brukeren velger "ingen barn", fjern sykler som *kun* er designet for barn (hvis slike finnes)
                      // Eller, mer sannsynlig: IKKE filtrer ytterligere, men prioriter kanskje sykler med maxChildren=0 i sortering?
                      // Nåværende logikk: Ingen ekstra filtrering for 'ingen'.
                      console.log(`Etter barnekapasitet ('ingen'): Ingen ekstra filtrering på barn. ${potentialMatches.length} treff`);
                      // Alternativt: Fjern de som *krever* barn? (Usannsynlig case)
                      // potentialMatches = potentialMatches.filter(bike => bike.requiresChildren !== true );
                 }
             }

            // Filter 6: Rammetype
            if (selections.frameType) {
                let targetFrameTypes = [];
                 if (selections.frameType === 'dypGjennomgang') targetFrameTypes = ['low-step', 'cargo', 'cargo-longtail'];
                 else if (selections.frameType === 'lavtTopprør') targetFrameTypes = ['mid-step'];
                 else if (selections.frameType === 'høytTopprør') targetFrameTypes = ['high-step'];
                 potentialMatches = potentialMatches.filter(bike =>
                     bike.frame_types && bike.frame_types.some(type => targetFrameTypes.includes(type))
                 );
                 console.log(`Etter rammetype (${selections.frameType} -> ${targetFrameTypes.join('/')}): ${potentialMatches.length} treff`);
            }

             // Filter 7: Lastelokasjon (KUN for transport)
             const cargoLocStepDefCheck = steps.find(s => s.id === 'cargoLocation');
             const cargoLocQuestionAsked = !cargoLocStepDefCheck || !cargoLocStepDefCheck.condition || cargoLocStepDefCheck.condition();
            if (cargoLocQuestionAsked && selections.purpose === 'transport' && selections.cargoLocation) {
                const targetLocation = selections.cargoLocation === 'frontlaster' ? 'front' : 'rear';
                potentialMatches = potentialMatches.filter(bike =>
                    bike.cargo_location === targetLocation
                );
                 console.log(`Etter lastelokasjon (${selections.cargoLocation} -> ${targetLocation}): ${potentialMatches.length} treff`);
            }

            // Sortering: Prioriter forhåndsbestilte
            potentialMatches.sort((a, b) => {
                const scoreA = a.preOrdered ? 1 : 0;
                const scoreB = b.preOrdered ? 1 : 0;
                // Hvis begge har samme preOrdered-status, kan vi legge til sekundær sortering her, f.eks. på pris eller relevans? Foreløpig ingen.
                return scoreB - scoreA;
            });
            console.log(`Sortert med preOrdered først.`);

            // Endelig utvalg (Topp 3)
            recommendations = potentialMatches.slice(0, 3);
            console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (PreOrdered: ${!!b.preOrdered})`));

            loadingIndicator.classList.add('hidden');
            renderRecommendations();
            recommendationsOutput.classList.remove('hidden');

        }, 500);
    }

    // --- Event Handlers (fra forrige versjon, ingen endringer nødvendig) ---
    function handleOptionSelect(stepId, value) { /* ... uendret ... */
        selections[stepId] = value;
        console.log("Valg oppdatert:", stepId, "=", value);

        if (stepId === 'purpose') {
            if (value !== 'transport') selections.cargoLocation = null;
             if (value !== 'transport' && value !== 'allsidig' && selections.cargo !== 'massiv') selections.childCapacity = null;
        }
         if (stepId === 'cargo' && value !== 'massiv') {
             if (selections.purpose !== 'transport' && selections.purpose !== 'allsidig') selections.childCapacity = null;
         }

        currentStep++;
        let nextStepDef = steps[currentStep - 1];
        while(nextStepDef && nextStepDef.condition && !nextStepDef.condition()) {
            console.log(`Hopper over betinget trinn ${currentStep}: ${nextStepDef.id}`);
             if (selections[nextStepDef.id] !== undefined) selections[nextStepDef.id] = null;
            currentStep++;
            nextStepDef = steps[currentStep - 1];
        }

        totalSteps = calculateTotalVisibleSteps();
        const nextVisibleStepNum = calculateCurrentVisibleStep();

        console.log("Logisk trinn:", currentStep, "Neste synlige trinn:", nextVisibleStepNum, "Totalt synlige:", totalSteps);

        if (currentStep > steps.length) {
             console.log("Alle logiske trinn fullført, viser resultater.");
             generateAndShowRecommendations();
         } else {
             console.log("Går til neste spørsmål/visning.");
              updateView();
          }
    }
    function handleBack() { /* ... uendret ... */
         if (showRecommendationsView) {
             showRecommendationsView = false;
             let lastVisibleStepIndex = -1;
             let visibleCounter = 0;
             for (let i = 0; i < steps.length; i++) {
                  const stepDef = steps[i];
                  if (!stepDef.condition || stepDef.condition()) {
                      visibleCounter++;
                      lastVisibleStepIndex = i;
                  }
              }
             currentStep = lastVisibleStepIndex + 1;
             console.log("Tilbake fra resultat. Går til siste synlige trinn, logisk index:", lastVisibleStepIndex, "currentStep settes til:", currentStep);
             updateView();
         } else if (currentStep > 1) {
             currentStep--;
             let prevStepDef = steps[currentStep - 1];
             while (currentStep > 1 && prevStepDef && prevStepDef.condition && !prevStepDef.condition()) {
                 console.log(`Hopper bakover over betinget trinn ${currentStep}: ${prevStepDef.id}`);
                 currentStep--;
                 prevStepDef = steps[currentStep - 1];
             }
             console.log("Går tilbake til logisk trinn:", currentStep);
             updateView();
         } else {
              console.log("Kan ikke gå tilbake fra første trinn.");
         }
     }
    function resetAdvisor() { /* ... uendret ... */
        console.log("Tilbakestiller rådgiveren.");
        currentStep = 1;
        selections = {
            purpose: null, distance: null, cargo: null, childCapacity: null, frameType: null, cargoLocation: null
        };
        recommendations = [];
        showRecommendationsView = false;
        totalSteps = calculateTotalVisibleSteps();
        updateView();
    }

    // --- 9. Initialisering (fra forrige versjon, ingen endringer nødvendig) ---
    if(backButton) backButton.addEventListener('click', handleBack);
    if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
    if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
    if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    totalSteps = calculateTotalVisibleSteps();
    updateView();

});
