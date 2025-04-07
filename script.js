// --- 1. Data (OPPDATERT med 'allsidig' i purpose der det manglet) ---
    const BikeCatalog = {
        evoOriginal: [
            {
                id: 'tern-quick-haul-p9',
                name: "Quick Haul P9",
                purpose: ['bybruk', 'transport', 'pendling', 'allsidig', 'family'], // Har 'allsidig'
                description: "Kompakt og kraftig elsykkel...",
                features: ["Kompakt elsykkel", "Bagasjebrett (opptil 50 kg)", "Plass til 1 barn", "Brukervennlig & tilpassbar", "Solid bygget"],
                price: "KR 29.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/06/Quick-Haul-H9-gronn-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-p9-400/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear', distance_km: [20, 70], maxChildren: 1, preOrdered: true
            },
            {
                id: 'rm-multicharger2-mixte-gt-vario-family',
                name: "Multicharger Mixte GT vario Family",
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'], // Har 'allsidig'
                description: "Kraftig familiesykkel...",
                features: ["Plass til 2 barn", "Beltedrift (Gates Carbon)", "Enviolo trinnløst gir", "750 Wh batteri", "Mixte-ramme (lavt innsteg)", "Komfortdemping", "Bosch Performance CX?"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/25_F01186_110402080714_MuCha2_Mixte_GT_Var_47_UGrey-Blk_SafetyBar_Kiox300_Cargo-1024x683.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-vario-family/",
                frame_types: ['mid-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [40, 110], maxChildren: 2, preOrdered: true
            },
            {
                id: 'rm-multicharger2-mixte-gt-touring-family',
                name: "Multicharger Mixte GT Touring Family",
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'], // Har 'allsidig'
                description: "Allsidig elsykkel for familien...",
                features: ["Trygg transport (barn/last)", "750 Wh batteri", "Shimano Deore XT 11-gir", "Mixte-ramme (lavt innsteg)", "Family Kit inkludert?", "Bosch Performance CX?"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Multicharger2-Mixte-GT-Vario-svart-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-touring-family/",
                frame_types: ['mid-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [40, 110], maxChildren: 2, preOrdered: true
            },
             {
                id: 'rm-multitinker-touring-family',
                name: "Multitinker Touring Family",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'], // Har 'allsidig'
                description: "Smart bysykkel...",
                features: ["Plass til 2 barn / stor last", "Shimano Deore 11-gir Linkglide", "Kjededrift", "Kompakt (20\" hjul)", "Stabil & Tilpasningsdyktig", "Bosch Performance CX"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Multitinker-Touring-Family-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-touring-family/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [30, 80], maxChildren: 2, preOrdered: true
            },
            {
                id: 'rm-multitinker-vario-family',
                name: "Multitinker Vario Family",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'], // Har 'allsidig'
                description: "Samme stabile Multitinker...",
                features: ["Plass til 2 barn / stor last", "Enviolo trinnløst gir", "Beltedrift (Gates)", "Vedlikeholdsvennlig", "Kompakt (20\" hjul)", "Stabil & Trygg", "Bosch Performance CX"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/Multitinker-Vario-bla-med-telt-prod-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-vario-family/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [30, 80], maxChildren: 2, preOrdered: true
            },
             {
                id: 'tern-quick-haul-long-d9',
                name: "Quick Haul Long D9 400",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'], // Har 'allsidig'
                description: "Lang og robust elsykkel...",
                features: ["Kompakt lastesykkel (190 kg totalvekt)", "Designet for 2 barn / stor last", "Lavt innsteg & lang akselavstand (stabil)", "Bosch Cargo Line motor (85Nm)", "400 Wh batteri (25-85km)", "Parkerbar vertikalt", "Passer 155–185 cm"],
                price: "KR 49.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/Quick-Haul-Long-prod-rod-1-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-long-d9-400/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear', distance_km: [25, 85], maxChildren: 2, preOrdered: true
            },
            {
                id: 'rm-nevo4-gt-vario-core',
                name: "NEVO4 GT vario CORE",
                purpose: ['bybruk', 'pendling', 'allsidig', 'trekking'], // Har 'allsidig'
                description: "Hverdagsvennlig elsykkel...",
                features: ["Lavt innsteg", "Komfortabel sittestilling", "Enviolo trinnløst gir", "Gates karbonbelte", "Bosch Performance CX (85Nm)", "625Wh batteri (opptil 100km)", "Setepinnedemping & dempegaffel"],
                price: "KR 63.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Nevo4-GT-vario-CORE-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-nevo4-gt-vario-core/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear', distance_km: [40, 100], maxChildren: 0, preOrdered: true
            },
            {
                id: 'rm-roadster4-touring',
                name: "Roadster4 Touring",
                purpose: ['pendling', 'bybruk'], // Mangler 'allsidig' - Ok? Roadster er ganske spesifikk.
                description: "Lett, elegant og kraftig...",
                features: ["Lett og dynamisk design", "Bosch Performance CX (85Nm)", "625 Wh batteri (integrert)", "Komfortabel (dempegaffel)", "Brede dekk", "Shimano Deore XT 11-gir"],
                price: "KR 59.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/25_F01130_0401060913_Rd4_Tou_56_BlkMtt_ChainbagVAUDE_5764-1024x683.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-roadster4-touring/",
                frame_types: ['high-step', 'mid-step'], speed_kmh: 25, cargo_capacity: 'small', cargo_location: 'rear', distance_km: [35, 90], maxChildren: 0, preOrdered: true
            },
            {
                id: 'tern-orox-s12',
                name: "Tern Orox S12 27,5",
                purpose: ['terreng', 'transport', 'allsidig', 'adventure'], // Har 'allsidig'
                description: "Eventyrsykkel som tåler...",
                features: ["Adventure-lastesykkel", "Terreng & Vinterbruk", "Maks totalvekt 210 kg", "Mulighet for 2 batterier", "Fatbike-dekk (27.5\")", "Bosch Performance CX (85Nm)", "800 Wh batteri (standard)"],
                price: "KR 80.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/12/Otox-S12-275-gronn-prod-1-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-orox-s12-275/",
                frame_types: ['high-step'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'rear', distance_km: [50, 150], maxChildren: 2, preOrdered: true
            },
            {
                id: 'rm-load4-75-touring-familie',
                name: "Load4 75 Touring Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'], // <--- LAGT TIL 'allsidig'
                description: "Stor familiesykkel...",
                features: ["Fullfjæret lastesykkel", "Plass til 3 barn", "Høy komfort", "Komplett familiepakke (regntelt, etc.)", "Bosch Cargo Line (Gen4, 85Nm)", "725 Wh batteri (40-120km)"],
                price: "KR 108.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load5-75-touring-famili-prod-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-touring-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [40, 120], maxChildren: 3, preOrdered: true
            },
            {
                id: 'rm-load4-60-touring-familie',
                name: "Load4 60 Touring Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'], // <--- LAGT TIL 'allsidig' (Antar at hvis 75 er det, er 60 det også)
                description: "Kompakt familiesykkel...",
                features: ["Fullfjæret (maks komfort)", "Plass til 2 barn", "Trygg transport", "Komplett familiepakke (regntelt, etc.)", "Bosch Cargo Line (Gen4, 85Nm?)", "725 Wh batteri", "Universell størrelse"],
                price: "KR 99.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-1536x816.webp",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-60-touring-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [30, 80], maxChildren: 2, preOrdered: true
            },
            {
                id: 'rm-delite5-gt-pinion',
                name: "Delite5 GT pinion",
                purpose: ['pendling', 'terreng', 'trekking', 'adventure', 'allsidig'], // <--- LAGT TIL 'allsidig' (Delite er ofte veldig allsidig)
                description: "Fulldempet elsykkel...",
                features: ["Integrert Pinion E-Drive System", "Fulldempet (Control Technology)", "Resirkulert alu-ramme", "Skjermet drivverk", "Bosch 800 Wh batteri?", "Lang rekkevidde", "Dropper-setepinne"],
                price: "KR 105.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/09/25_F01315_040209081506_Delite5_GT_Pinion_51_StoneGrey_2755-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-delite5-gt-pinion/",
                frame_types: ['high-step', 'mid-step'], speed_kmh: 25, cargo_capacity: 'small', cargo_location: 'rear', distance_km: [50, 150], maxChildren: 0, preOrdered: true
            },
            {
                id: 'rm-load4-75-vario-familie',
                name: "Load4 75 Vario Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'], // <--- LAGT TIL 'allsidig'
                description: "Kraftig lastesykkel...",
                features: ["Plass til 3 barn", "Fullfjæret", "Lettkjørt (tung last)", "Beltedrift (Gates)", "Enviolo trinnløst gir", "Bosch Cargo Line (85Nm?)", "725 Wh batteri", "Komplett familiepakke"],
                price: "KR 113.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load4-75-vario-familie-peanut-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-vario-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front', distance_km: [30, 80], maxChildren: 3, preOrdered: true
            }
        ]
    };

    // ... (Resten av koden forblir uendret fra forrige versjon) ...
    // --- State, DOM Refs, Steps definisjon ---
    // --- Hjelpefunksjoner ---
    // --- Rendering Funksjoner ---
    // --- Logikk for Anbefalinger (Med Relaxed Filtering) ---
    // --- Event Handlers ---
    // --- Initialisering ---

}); // Slutt på DOMContentLoaded
