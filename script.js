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
                price: "37 000 kr", // Behøldt brukerens oppdatering
                image: "https://evoelsykler.no/wp-content/uploads/2024/06/Quick-Haul-H9-gronn.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-p9-400/?attribute_pa_farge=gronn&gad_source=1&gclid=Cj0KCQjwkZm_BhDrARIsAAEbX1FuNlRzuUBlKTbajjzWES0zb_flPmbDMd6jEmIoL5cFOZ0au9sEUOwaAnneEALw_wcB&gclsrc=aw.ds",
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

    // --- 2. State Variabler (uendret) ---
    let currentStep = 1;
    let totalSteps = 6;
    let selections = { purpose: null, distance: null, bikeType: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;

    // --- 3. DOM Referanser (uendret) ---
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

    // --- 4. Definisjoner for Trinn og Alternativer (uendret) ---
    const steps = [
        { id: 'purpose', title: 'Hva skal sykkelen primært brukes til?', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Hvilken reiseavstand planlegger du regelmessig (per tur)?', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'bikeType', title: 'Hvilken type el-sykkel ønsker du?', options: [ { id: 'standard', label: 'Standard elsykkel (opptil 25 km/t)' }, { id: 'highSpeed', label: 'S-Pedelec / Speed Bike (opptil 45 km/t)' } ] },
        { id: 'cargo', title: 'Hvor mye trenger du vanligvis å frakte?', options: [ { id: 'små', label: 'Litt handling eller en liten veske' }, { id: 'store', label: 'Ukentlig handling eller større bagasje' }, { id: 'massiv', label: 'Barn, kjæledyr eller store/tunge varer' } ] },
        { id: 'frameType', title: 'Hvilken rammetype foretrekker du?', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Hvilken type lastesykkel ser du for deg?', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://via.placeholder.com/80x60.png?text=Front', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://via.placeholder.com/80x60.png?text=Rear', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];
    totalSteps = calculateTotalVisibleSteps();

    // --- 5. Hjelpefunksjoner (uendret) ---
    function getStepDefinition(stepNum) { /* ... (som før) ... */ }
    function getLabelById(optionsArray, id) { /* ... (som før) ... */ }
    function updateProgress() { /* ... (som før) ... */ }
    function calculateCurrentVisibleStep() { /* ... (som før) ... */ }
    function calculateTotalVisibleSteps() { /* ... (som før) ... */ }

    // --- 6. Rendering Funksjoner (uendret) ---
    function renderSentence(targetElement) { /* ... (som før) ... */ }
    function renderOptions() { /* ... (som før) ... */ }
    function renderRecommendations() { /* ... (som før, viser nå kr) ... */ }
    function updateView() { /* ... (som før) ... */ }


    // --- 7. Logikk for Anbefalinger (Scoring-system, uendret logikk, men data har kr) ---
    function generateAndShowRecommendations() {
        console.log("Starter generering av anbefalinger med scoring...");

        showRecommendationsView = true;
        questionsSection.classList.add('hidden');
        recommendationsSection.classList.remove('hidden');
        recommendationsOutput.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        renderSentence(summarySentenceFinal);
        recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
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
                let matchReasons = [];

                // 1. Formål
                if (bike.purpose && bike.purpose.length > 0) { /* ... (som før) ... */ }

                // 2. Distanse
                if (selections.distance && bike.distance_km) { /* ... (som før) ... */ }

                // 3. Hastighet (Sykkeltype)
                if (selections.bikeType) { /* ... (som før) ... */ }

                // 4. Lastekapasitet (Cargo)
                if (selections.cargo) { /* ... (som før) ... */ }

                // 5. Rammetype
                if (selections.frameType && bike.frame_types && bike.frame_types.length > 0) { /* ... (som før) ... */ }

                // 6. Lastetype (Kun for transport)
                if (selections.purpose === 'transport' && selections.cargoLocation) { /* ... (som før) ... */ }

                console.log(`Sykkel: ${bike.name}, Score: ${score.toFixed(1)}, Grunner: ${matchReasons.join('; ')}`);
                return { ...bike, score, matchReasons };

            }).filter(bike => bike.score >= 0);

            scoredBikes.sort((a, b) => b.score - a.score);
            recommendations = scoredBikes.slice(0, 3);
            console.log("Endelige anbefalinger (score basert):", recommendations.map(b => `${b.name} (${b.score.toFixed(1)})`));

            loadingIndicator.classList.add('hidden');
            renderRecommendations();
            recommendationsOutput.classList.remove('hidden');

        }, 750);
    }


    // --- 8. Event Handlers (uendret) ---
    function handleOptionSelect(stepId, value) { /* ... (som før) ... */ }
    function handleBack() { /* ... (som før) ... */ }
    function resetAdvisor() { /* ... (som før) ... */ }


    // --- 9. Initialisering (uendret) ---
    backButton.addEventListener('click', handleBack);
    resetButtonStep.addEventListener('click', resetAdvisor);
    resetButtonFinal.addEventListener('click', resetAdvisor);
    currentYearSpan.textContent = new Date().getFullYear();
    totalSteps = calculateTotalVisibleSteps();
    updateView();

});

// Note: Scoring logic details inside generateAndShowRecommendations are collapsed (...) for brevity,
// but they are the same as in the previous full script provided.
// The only change is within the BikeCatalog.evoOriginal data, specifically the `price` fields.
