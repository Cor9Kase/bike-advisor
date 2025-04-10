document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data (Komplett katalog med fulle beskrivelser og rensede features) ---
    const BikeCatalog = {
        evoOriginal: [
            {
                id: 'tern-quick-haul-p9',
                name: "Quick Haul P9",
                purpose: ['bybruk', 'transport', 'pendling', 'allsidig', 'family'],
                description: "Kompakt og kraftig elsykkel med langt bagasjebrett (opptil 50 kg). Perfekt til både hverdag og småtransport – barn, handleposer eller hund. Brukervennlig, tilpassbar og solid bygget.", // Bruker "Kort beskrivelse" som hovedbeskrivelse
                features: ["Kompakt elsykkel", "Bagasjebrett (opptil 50 kg)", "Plass til 1 barn", "Brukervennlig & tilpassbar", "Solid bygget", "Bosch Performance Line motor", "400Wh batteri"],
                price: "KR 29.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/06/Quick-Haul-H9-gronn-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-p9-400/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear', distance_km: [20, 70], maxChildren: 1, preOrdered: false // Fjernet preOrdered
            },
            {
                id: 'rm-multicharger2-mixte-gt-vario-family',
                name: "Multicharger Mixte GT vario Family",
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'],
                description: "Kraftig familiesykkel med plass til to barn og cargo foran. Beltedrift, trinnløst gir og 750 Wh batteri gir lang rekkevidde og lite vedlikehold. Lavt innsteg og komfortdemping.", // Bruker "Kort beskrivelse"
                features: ["Plass til 2 barn", "Beltedrift (Gates Carbon)", "Enviolo trinnløst gir", "750 Wh batteri", "Mixte-ramme (lavt innsteg)", "Komfortdemping", "Bosch Performance CX motor"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/25_F01186_110402080714_MuCha2_Mixte_GT_Var_47_UGrey-Blk_SafetyBar_Kiox300_Cargo-1024x683.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-vario-family/",
                frame_types: ['mid-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [40, 110], maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-multicharger2-mixte-gt-touring-family',
                name: "Multicharger Mixte GT Touring Family",
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'],
                description: "Allsidig elsykkel for familien – trygg transport av barn og last. 750 Wh batteri, Shimano XT-gir og lavt innsteg. Perfekt til både hverdag og helg.", // Bruker "Kort beskrivelse"
                features: ["Trygg transport (barn/last)", "750 Wh batteri", "Shimano Deore XT 11-gir", "Mixte-ramme (lavt innsteg)", "Family Kit inkludert", "Bosch Performance CX motor"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Multicharger2-Mixte-GT-Vario-svart-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-touring-family/",
                frame_types: ['mid-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [40, 110], maxChildren: 2, preOrdered: false
            },
             {
                id: 'rm-multitinker-touring-family',
                name: "Multitinker Touring Family",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'],
                description: "Smart bysykkel med plass til to barn eller stor last. Shimano 11-gir og kjededrift gir kraft i motbakker. Kompakt, stabil og tilpasningsdyktig.", // Bruker "Kort beskrivelse"
                features: ["Plass til 2 barn / stor last", "Shimano Deore 11-gir Linkglide", "Kjededrift", "Kompakt (20\" hjul)", "Stabil & Tilpasningsdyktig", "Bosch Performance CX"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Multitinker-Touring-Family-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-touring-family/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [30, 80], maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-multitinker-vario-family',
                name: "Multitinker Vario Family",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'],
                description: "Samme stabile Multitinker med trinnløst gir og beltedrift for enklere vedlikehold. Komfortabel, trygg og bygget for byliv med barn eller varer.", // Bruker "Kort beskrivelse"
                features: ["Plass til 2 barn / stor last", "Enviolo trinnløst gir", "Beltedrift (Gates)", "Vedlikeholdsvennlig", "Kompakt (20\" hjul)", "Stabil & Trygg", "Bosch Performance CX"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/Multitinker-Vario-bla-med-telt-prod-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-vario-family/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [30, 80], maxChildren: 2, preOrdered: false
            },
             {
                id: 'tern-quick-haul-long-d9',
                name: "Quick Haul Long D9 400",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'],
                description: "Lang og robust elsykkel som kan bære to barn og tung last. Stabil, lett å manøvrere og enkel å dele. 400 Wh batteri og Bosch Cargo Line-motor.", // Bruker "Kort beskrivelse"
                features: ["Kompakt lastesykkel (190 kg totalvekt)", "Designet for 2 barn / stor last", "Lavt innsteg & lang akselavstand (stabil)", "Bosch Cargo Line motor (85Nm)", "400 Wh batteri (25-85km)", "Parkerbar vertikalt", "Passer 155–185 cm"],
                price: "KR 49.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/Quick-Haul-Long-prod-rod-1-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-long-d9-400/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [25, 85], maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-nevo4-gt-vario-core',
                name: "NEVO4 GT vario CORE",
                purpose: ['bybruk', 'pendling', 'allsidig', 'trekking'],
                description: "Hverdagsvennlig elsykkel med lavt innsteg og trinnløst gir. Komfortabel og stabil med 625 Wh batteri og Bosch CX-motor.", // Bruker "Kort beskrivelse"
                features: ["Lavt innsteg", "Komfortabel sittestilling", "Trinnløst Enviolo-gir", "Gates karbonbelte", "Bosch Performance CX (85Nm)", "625Wh batteri (opptil 100km)", "Setepinnedemping & dempegaffel"],
                price: "KR 63.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Nevo4-GT-vario-CORE-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-nevo4-gt-vario-core/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear', distance_km: [40, 100], maxChildren: 0, preOrdered: false
            },
            {
                id: 'rm-roadster4-touring',
                name: "Roadster4 Touring",
                purpose: ['pendling', 'bybruk'],
                description: "Lett, elegant og kraftig elsykkel. Perfekt for både by og tur. Integrert batteri og sporty komfort.", // Bruker "Kort beskrivelse"
                features: ["Lett og dynamisk design", "Bosch CX-motor (85Nm)", "625 Wh batteri integrert i rammen", "Komfort med dempegaffel", "Brede dekk", "Shimano Deore XT 11-gir"],
                price: "KR 59.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/25_F01130_0401060913_Rd4_Tou_56_BlkMtt_ChainbagVAUDE_5764-1024x683.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-roadster4-touring/",
                frame_types: ['high-step', 'mid-step'], speed_kmh: 25, cargo_capacity: 'small', cargo_location: 'rear', distance_km: [35, 90], maxChildren: 0, preOrdered: false
            },
            {
                id: 'tern-orox-s12',
                name: "Tern Orox S12 27,5",
                purpose: ['terreng', 'transport', 'allsidig', 'adventure'],
                description: "Eventyrsykkel som tåler ekstrem last og terreng. Bosch CX-motor og 800 Wh batteri gir solid kraft og rekkevidde.", // Bruker "Kort beskrivelse"
                features: ["Adventure-lastesykkel", "Terreng & Vinterbruk", "Kan utstyres med to batterier", "Tåler opptil 210 kg last", "Fatbike-dekk", "Bosch Performance CX", "800 Wh batteri"],
                price: "KR 80.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/12/Otox-S12-275-gronn-prod-1-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-orox-s12-275/",
                frame_types: ['high-step'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'rear', distance_km: [50, 150], maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-load4-75-touring-familie',
                name: "Load4 75 Touring Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'],
                description: "Stor familiesykkel med tre barneseter, regntelt og demping foran og bak. Komfortabel og kraftig.", // Bruker "Kort beskrivelse"
                features: ["Fullfjæret lastesykkel (høy komfort)", "Transporterer opptil 3 barn", "Komplett utstyr (regntelt, bagasjebrett, belter)", "Bosch Cargo Line (Gen4, 85Nm)", "725 Wh batteri (40-120km)"],
                price: "KR 108.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load5-75-touring-famili-prod-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-touring-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [40, 120], maxChildren: 3, preOrdered: false
            },
            {
                id: 'rm-load4-60-touring-familie',
                name: "Load4 60 Touring Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'],
                description: "Kompakt familiesykkel med demping, regntelt og to seter. Praktisk, trygg og fullspekket med utstyr.", // Bruker "Kort beskrivelse"
                features: ["Demper foran og bak (maks komfort)", "Transporterer 2 barn", "Komplett familiepakke (regntelt, bagasjebrett)", "Bosch Cargo Line (Gen4)", "725 Wh batteri", "Universell størrelse"],
                price: "KR 99.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-1536x816.webp",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-60-touring-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [30, 80], maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-delite5-gt-pinion',
                name: "Delite5 GT pinion",
                purpose: ['pendling', 'terreng', 'trekking', 'adventure', 'allsidig'],
                description: "Fulldempet elsykkel med integrert gir og motor. Høy ytelse for pendlere og langtur.", // Bruker "Kort beskrivelse"
                features: ["Integrert Pinion E-Drive System", "Fulldemping (Control Technology)", "Resirkulert aluminiumsramme", "Skjermet drivverk", "Bosch 800 Wh batteri", "Lang rekkevidde", "Dropper-setepinne"],
                price: "KR 105.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/09/25_F01315_040209081506_Delite5_GT_Pinion_51_StoneGrey_2755-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-delite5-gt-pinion/",
                frame_types: ['high-step', 'mid-step'], speed_kmh: 25, cargo_capacity: 'small', cargo_location: 'rear', distance_km: [50, 150], maxChildren: 0, preOrdered: false
            },
            {
                id: 'rm-load4-75-vario-familie',
                name: "Load4 75 Vario Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'],
                description: "Kraftig lastesykkel med beltedrift og plass til tre barn. Komfortabel og robust med demping og regntelt.", // Bruker "Kort beskrivelse"
                features: ["Fulldempet og lettkjørt (tung last)", "Transport av opptil 3 barn", "Beltedrift (Gates)", "Enviolo trinnløst gir", "Bosch Cargo Line motor", "725 Wh batteri", "Komplett familiepakke (regntelt, etc.)"],
                price: "KR 113.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load4-75-vario-familie-peanut-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-vario-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [30, 80], maxChildren: 3, preOrdered: false
            }
        ]
    };

    // --- State (uten childCapacity) ---
    let currentStep = 1;
    let selections = {
        purpose: null, distance: null, cargo: null,
        frameType: null, cargoLocation: null
    };
    let recommendations = [];
    let showRecommendationsView = false;

    // --- DOM Referanser ---
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

    // --- Steps definisjon (med oppdaterte titler, uten childCapacity) ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://via.placeholder.com/80x60.png?text=Front', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://via.placeholder.com/80x60.png?text=Rear', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
    ];
    let totalSteps = calculateTotalVisibleSteps();

    // --- Hjelpefunksjoner ---
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
        const totalVisibleSteps = calculateTotalVisibleSteps();
        const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0;
        progressBar.style.width = `${Math.min(100, progressPercentage)}%`;
        progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`;
     }
     function calculateCurrentVisibleStep() {
        let visibleStepCount = 0; let logicalStepIndex = 0;
        while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) {
            const stepDef = steps[logicalStepIndex];
            if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; }
            logicalStepIndex++;
        }
        const totalVisible = calculateTotalVisibleSteps();
        if (currentStep > steps.length) { return totalVisible; }
        return Math.min(Math.max(1, visibleStepCount), totalVisible);
     }
     function calculateTotalVisibleSteps() {
          let totalVisible = 0;
          steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } });
          return totalVisible;
     }

    // --- Rendering Funksjoner ---
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
          const cargoSpan = createSpan(selections.cargo, 'cargo', 'lastemengde'); if (cargoSpan) sentenceParts.push(`Jeg trenger å frakte ${cargoSpan}.`);
          const cargoLocationSpan = createSpan(selections.cargoLocation, 'cargoLocation', 'lastetype');
          const cargoLocStepDef = steps.find(s => s.id === 'cargoLocation'); const cargoLocIsActive = cargoLocStepDef && (!cargoLocStepDef.condition || cargoLocStepDef.condition());
          if (cargoLocIsActive && selections.cargoLocation) { sentenceParts.push(`Jeg ser for meg en ${cargoLocationSpan} sykkel.`); }
          const frameTypeSpan = createSpan(selections.frameType, 'frameType', 'rammetype'); if (frameTypeSpan) sentenceParts.push(`Jeg foretrekker en ramme med ${frameTypeSpan}.`);
          targetElement.innerHTML = `<p>${sentenceParts.join(' ').replace(/\s{2,}/g, ' ')}</p>`;
     }
     function renderOptions() {
         const currentVisibleStepNum = calculateCurrentVisibleStep();
         if (currentStep > steps.length) { if (!showRecommendationsView) { generateAndShowRecommendations(); } return; }
         const stepDef = getStepDefinition(currentVisibleStepNum);
         if (!stepDef) { if (!showRecommendationsView) { generateAndShowRecommendations(); } return; }
         stepTitle.textContent = stepDef.title; stepOptions.innerHTML = '';
         stepDef.options.forEach(option => { const button = document.createElement('button'); button.classList.add('option-button'); if(option.className) { button.classList.add(option.className); } button.dataset.value = option.id; if (option.className === 'cargo-type') { button.innerHTML = `${option.image ? `<img src="${option.image}" alt="${option.label}">` : ''}<div><div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}</div>`; } else { button.innerHTML = `<div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}`; } if (selections[stepDef.id] === option.id) { button.classList.add('selected'); } button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id)); stepOptions.appendChild(button); });
         updateProgress();
     }
     let relaxedSearchPerformed = false;
     function renderRecommendations() {
         recommendationsOutput.innerHTML = '';
         if (recommendations.length === 0 && !relaxedSearchPerformed) {
             recommendationsOutput.innerHTML = `<div class="no-results" style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f8f9fa;"><h3>Ingen perfekt match funnet</h3><p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100% blant våre anbefalte modeller akkurat nå.</p><p>Forslag:</p><ul style="margin-left: 20px; list-style: disc;"><li>Prøv å gå tilbake og justere ett eller flere av valgene dine (f.eks. rammetype).</li><li>De anbefalte syklene er prioritert. Det kan finnes andre modeller som passer – <a href="#kontakt-oss-link">kontakt oss</a> gjerne direkte for full oversikt!</li></ul></div>`;
             return;
         } else if (recommendations.length === 0 && relaxedSearchPerformed) {
              recommendationsOutput.innerHTML = `<div class="no-results" style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f8f9fa;"><h3>Fant ingen modeller</h3><p>Selv med justerte søkekriterier fant vi ingen passende modeller. <a href="#kontakt-oss-link">Kontakt oss</a> gjerne for personlig veiledning!</p></div>`;
             return;
         }
         if (relaxedSearchPerformed) {
            const notice = document.createElement('p'); notice.textContent = "Ingen sykler passet 100% til alle dine valg, så her er de nærmeste alternativene:"; notice.style.cssText = 'font-size: 0.9em; font-style: italic; margin-bottom: 15px; color: #6c757d;'; recommendationsOutput.appendChild(notice);
         }
         recommendations.forEach((bike, index) => {
             const card = document.createElement('div'); card.classList.add('recommendation-card');
             let badgeText = ''; if (index === 0) badgeText = 'TOPPVALG'; else if (index === 1) badgeText = 'GOD MATCH'; else if (index === 2) badgeText = 'ALTERNATIV'; // Forenklet badge uten preOrdered
             let childInfoHTML = ''; if (bike.maxChildren && bike.maxChildren > 0) { const t = bike.maxChildren === 1 ? "ett barn" : `${bike.maxChildren} barn`; childInfoHTML = `<p class="child-capacity-info" style="font-size: 0.9em; color: #495057; font-weight: 500; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1.1em; height: 1.1em; flex-shrink: 0;"><path fill-rule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clip-rule="evenodd" /></svg> Passer for opptil ${t}.</p>`; }
             let featuresHTML = ''; if(bike.features && bike.features.length > 0) { featuresHTML = `<div class="recommendation-features"><h4><svg class="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Nøkkelegenskaper:</h4><ul>${bike.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`; }
             card.innerHTML = `${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}<div class="recommendation-image-container"><img src="${bike.image || 'https://via.placeholder.com/300x180.png?text=Bilde+mangler'}" alt="${bike.name}" class="recommendation-image"></div><div class="recommendation-content"><h3>${bike.name}</h3>${childInfoHTML}<p class="description">${bike.description || 'Ingen beskrivelse tilgjengelig.'}</p>${featuresHTML}<div class="recommendation-footer"><div class="recommendation-price">${bike.price ? `<span class="price-label">Fra</span><span class="price-value">${bike.price}</span>` : ''}</div><div class="recommendation-buttons"><a href="${bike.productUrl || '#'}" target="_blank" class="button button-secondary">Se detaljer</a></div></div></div>`;
             recommendationsOutput.appendChild(card);
         });
     }
     function updateView() {
        totalSteps = calculateTotalVisibleSteps();
        if (showRecommendationsView) { questionsSection.classList.add('hidden'); recommendationsSection.classList.remove('hidden'); }
        else { questionsSection.classList.remove('hidden'); recommendationsSection.classList.add('hidden'); loadingIndicator.classList.add('hidden'); recommendationsOutput.classList.add('hidden'); renderSentence(sentenceBuilder); renderOptions(); const currentVisible = calculateCurrentVisibleStep(); backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1); }
        updateProgress();
     }

    // --- Logikk for Anbefalinger (Med Relaxed Filtering og justert sortering) ---
    function generateAndShowRecommendations() {
        console.log("Starter generering av anbefalinger med valg:", JSON.parse(JSON.stringify(selections)));
        relaxedSearchPerformed = false;

        showRecommendationsView = true; questionsSection.classList.add('hidden'); recommendationsSection.classList.remove('hidden'); recommendationsOutput.classList.add('hidden'); loadingIndicator.classList.remove('hidden'); renderSentence(summarySentenceFinal); recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            console.log("Utfører filtrering og sortering...");
            const filterBikes = (relaxFrameType = false, relaxDistance = false, purposeOnly = false) => {
                let bikesToFilter = [...BikeCatalog.evoOriginal];
                console.log(`Filtrerer med: relaxFrameType=${relaxFrameType}, relaxDistance=${relaxDistance}, purposeOnly=${purposeOnly}`);
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
            console.log(`Treff etter streng filtrering: ${potentialMatches.length}`);
            if (potentialMatches.length === 0) {
                console.log("Ingen treff, slapper av rammetype-filteret...");
                potentialMatches = filterBikes(true); relaxedSearchPerformed = true;
                console.log(`Treff etter avslappet rammetype: ${potentialMatches.length}`);
            }
             if (potentialMatches.length === 0 && selections.purpose) {
                 console.log("Siste utvei: Viser sykler basert kun på formål...");
                 potentialMatches = filterBikes(false, false, true); relaxedSearchPerformed = true;
                 console.log(`Treff basert kun på formål: ${potentialMatches.length}`);
             }

            // Justert Sortering (uten preOrdered)
             potentialMatches.sort((a, b) => {
                 const inferChildNeed = selections.purpose === 'transport' || selections.purpose === 'family' || selections.cargo === 'massiv' || selections.cargo === 'store';
                 const meetsChildReq = (bike, inferNeed) => { if (!inferNeed) return true; return bike.maxChildren !== null && bike.maxChildren > 0; };
                 const a_meets_child = meetsChildReq(a, inferChildNeed); const b_meets_child = meetsChildReq(b, inferChildNeed);
                 if (a_meets_child !== b_meets_child) { return a_meets_child ? -1 : 1; }
                 const a_children = a.maxChildren ?? -1; const b_children = b.maxChildren ?? -1;
                 if (a_children !== b_children && inferChildNeed) { return b_children - a_children; }
                 // Sekundær sortering: Cargo Capacity hvis relevant
                 if (selections.cargo === 'massiv' || selections.cargo === 'store') { const order = { 'small': 1, 'medium': 2, 'large': 3, 'massive': 4 }; const capA = order[a.cargo_capacity] || 0; const capB = order[b.cargo_capacity] || 0; if (capA !== capB) { return capB - capA; } }
                 return 0; // Returner 0 hvis ingen annen forskjell
             });
            console.log(`Sortert med prioritert barnematch, deretter cargo.`);

            recommendations = potentialMatches.slice(0, 3);
            console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (Kids: ${b.maxChildren ?? 'N/A'})`));

            loadingIndicator.classList.add('hidden');
            renderRecommendations();
            recommendationsOutput.classList.remove('hidden');
        }, 500);
    }

    // --- Event Handlers (uten childCapacity-logikk) ---
    function handleOptionSelect(stepId, value) {
        selections[stepId] = value; console.log("Valg:", stepId, "=", value);
        if (stepId === 'purpose' && value !== 'transport') { selections.cargoLocation = null; }
        currentStep++; let next = steps[currentStep - 1];
        while(next && next.condition && !next.condition()) { console.log(`Hopper over ${currentStep}: ${next.id}`); if (selections[next.id] !== undefined) selections[next.id] = null; currentStep++; next = steps[currentStep - 1]; }
        totalSteps = calculateTotalVisibleSteps(); const nextVis = calculateCurrentVisibleStep();
        console.log("Logisk:", currentStep, "Neste synlige:", nextVis, "Totalt:", totalSteps);
        if (currentStep > steps.length) { console.log("Ferdig"); generateAndShowRecommendations(); }
        else { console.log("Neste spørsmål"); updateView(); }
     }
     function handleBack() {
         if (showRecommendationsView) {
             showRecommendationsView = false; let lastVisIdx = -1;
             for (let i = 0; i < steps.length; i++) { const s = steps[i]; if (!s.condition || s.condition()) { lastVisIdx = i; } }
             currentStep = lastVisIdx + 1; console.log("Tilbake fra resultat ->", currentStep); updateView();
         } else if (currentStep > 1) {
             currentStep--; let prev = steps[currentStep - 1];
             while (currentStep > 1 && prev && prev.condition && !prev.condition()) { console.log(`Hopper bakover ${currentStep}: ${prev.id}`); currentStep--; prev = steps[currentStep - 1]; }
             console.log("Går tilbake ->", currentStep); updateView();
         } else { console.log("Kan ikke gå tilbake"); }
     }
     function resetAdvisor() {
        console.log("Reset."); currentStep = 1;
        selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null }; // Uten childCapacity
        recommendations = []; showRecommendationsView = false; totalSteps = calculateTotalVisibleSteps(); updateView();
     }

    // --- 9. Initialisering ---
    if(backButton) backButton.addEventListener('click', handleBack);
    if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
    if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
    if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    totalSteps = calculateTotalVisibleSteps();
    updateView(); // Vis første trinn

}); // Slutt på DOMContentLoaded
