document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data (Komplett katalog med alle 18 sykler og siste data) ---
    // OCR Data for referanse (fra bildet sist):
    // ID | Navn                                      | Produkt-URL                                             | Formål                                                 | Beskrivelse (forkortet)                                | Nøkkelegenskaper (forkortet)                                                                                                                            | Pris      | Ramme               | Maks Fart | Lastekapasitet | Lastelokasjon | Rekkevidde (km) | Maks Barn | Bilde-URL
    // ---|-------------------------------------------|---------------------------------------------------------|--------------------------------------------------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------------------|-----------|----------------|---------------|-----------------|-----------|----------
    // tern-Quick Haul P9                          | ...                                                     | ...bybruk, transport, pendling, allsidig, family       | Kompakt midtail...                                     | Kompakt elsykkel; Bagasjebrett (50kg); Plass 1 barn; Brukervennlig; Solid; Bosch Performance Line 65nm; 400Wh                                         | KR 29.900 | low-step            | 25        | medium         | rear          | 40-80 km        | 1         | ...
    // rm-n Multicharger Mixte GT vario Family       | ...                                                     | ...transport, pendling, allsidig, family, trekking     | Kraftig familiesykkel...                               | Plass 2 barn; Beltedrift; Enviolo; 750Wh; Mixte; Komfortdemping; Bosch Perf CX                                                                         | KR 79.000 | mid-step            | 25        | large          | rear          | 60-150 km       | 2         | ...
    // rm-n Multicharger Mixte GT Touring Family   | ...                                                     | ...transport, pendling, allsidig, family, trekking     | Allsidig elsykkel for familien...                      | Trygg transport; 750Wh; Shimano XT 11g; Mixte; Family Kit; Bosch Perf CX                                                                                | KR 75.000 | mid-step            | 25        | large          | rear          | 60-150 km       | 2         | ...
    // rm-n Multitinker Touring Family             | ...                                                     | ...transport, bybruk, allsidig, family                 | Smart bysykkel...                                      | Plass 2 barn/last; Shimano Deore 11g Linkglide; Kjede; Kompakt 20"; Stabil; Bosch Perf CX                                                                | KR 75.000 | low-step            | 25        | large          | rear          | 40-120 km       | 2         | ...
    // rm-n Multitinker Vario Family               | ...                                                     | ...transport, bybruk, allsidig, family                 | Samme stabile Multitinker...                           | Plass 2 barn/last; Enviolo; Belt; Vedlikeholdsvennlig; Kompakt 20"; Stabil; Bosch Perf CX                                                                | KR 79.000 | low-step            | 25        | large          | rear          | 40-120 km       | 2         | ...
    // tern- Quick Haul Long D9 400                | ...                                                     | ...transport, bybruk, allsidig, family                 | Lang og robust elsykkel...                             | Kompakt lastesykkel (190kg total); 2 barn/last; Lavt innsteg; Bosch Cargo Line 85Nm; 400Wh (25-85km); Parkerbar vertikalt; Passer 155-185cm              | KR 49.900 | low-step            | 25        | large          | rear          | 35-85 km        | 2         | ...
    // rm-n NEVO4 GT vario CORE                    | ...                                                     | ...bybruk, pendling, allsidig, trekking                | Hverdagsvennlig elsykkel...                            | Lavt innsteg; Komfortabel; Enviolo; Gates; Bosch Perf CX 85Nm; 625Wh (opptil 100km); Setepinnedemping & dempegaffel                                     | KR 63.000 | low-step            | 25        | medium         | rear          | 40-120 km       | 0         | ...
    // rm-ro Roadster4 Touring                     | ...                                                     | ...pendling, bybruk                                    | Lett, elegant og kraftig...                            | Lett design; Bosch CX 85Nm; 625Wh integrert; Komfort dempegaffel; Brede dekk; Shimano Deore XT 11g                                                    | KR 59.000 | high-step, mid-st   | 25        | small          | rear          | 35-90 km        | 0         | ...
    // rm-lo Load4 75 Touring Familie              | ...                                                     | ...transport, family, pendling, allsidig               | Stor familiesykkel...                                  | Fullfjæret; 3 barn; Komplett utstyr; Bosch Cargo Line 85Nm; 725Wh (40-120km)                                                                           | KR 108.000| cargo               | 25        | massive        | front         | 40-120 km       | 3         | ...
    // rm-lo Load4 60 Touring Familie              | ...                                                     | ...transport, family, pendling, allsidig               | Kompakt familiesykkel...                               | Demper foran/bak; 2 barn; Komplett familiepakke; Bosch Cargo Line; 725Wh; Universell størrelse                                                         | KR 99.000 | cargo               | 25        | massive        | front         | 40-100 km       | 2         | ...
    // rm-d Delite5 GT pinion                      | ...                                                     | ...pendling, terreng, trekking, adventure, allsidig    | Fulldempet elsykkel...                                 | Pinion E-Drive; Fulldemping; Resirkulert alu; Skjermet drivverk; Bosch 800Wh; Lang rekkevidde; Dropper; Bosch Perf CX                                    | KR 105.000| high-step, mid-st   | 25        | small          | rear          | 50-150 km       | 0         | ...
    // rm-lo Load4 75 Vario Familie                | ...                                                     | ...transport, family, pendling, allsidig               | Kraftig lastesykkel...                                 | Plass 3 barn; Fullfjæret; Lettkjørt; Beltedrift; Enviolo; Bosch Cargo Line; 725Wh; Komplett familiepakke                                                | KR 113.000| cargo               | 25        | massive        | front         | 40-120 km       | 3         | ...
    // tern-Tern GSD Gen3 S10                      | ...                                                     | ...transport, family, bybruk, allsidig, pendling       | Solid lastesykkel...                                   | Bosch Cargo Line Gen4 85Nm; DualBattery (opptil 200km); 2 barneseter/1 voksen; Hydraulisk brems m/ABS; Brede 20" dekk; Total last 210kg                 | KR 82.000 | cargo-longtail, lov | 25        | massive        | rear          | 50-200 km       | 2         | ...
    // rm-lo Load4 60 Vario Familie                | ...                                                     | ...transport, family, bybruk, allsidig                 | Fulldempet familiesykkel...                            | Plass 2 barn; Enviolo; Beltedrift; Bosch Cargo Line 85Nm; Fulldempet; 725Wh (40-120km); Komplett familiepakke; Bosch SmartSystem Kiox 300               | KR 104.000| cargo, low-step     | 25        | massive        | front         | 40-120 km       | 2         | ...
    // rm-c Carrie Touring                         | ...                                                     | ...transport, bybruk, allsidig                         | Kompakt lastesykkel...                                 | Kompakt; Stort lasteområde (Flex Box); Bosch Perf Line 75Nm; 545Wh (oppgraderbar); Microshift 10g; Bosch SmartSystem Intuvia 100; Valgfri demp setepinne | KR 74.850 | cargo, low-step     | 25        | large          | front         | 35-80 km        | 2         | ...
    // rm-c Carrie Vario                           | ...                                                     | ...transport, bybruk, allsidig, pendling               | Kompakt lastesykkel...                                 | Kompakt; Stort lasteområde (Flex Box); Bosch Perf Line 75Nm; 545Wh (oppgraderbar); Enviolo; Beltedrift; Vedlikeholdsvennlig; Bosch SmartSystem Intuvia 100 | KR 79.000 | cargo, low-step     | 25        | large          | front         | 35-80 km        | 2         | ...
    // rm-n Nevo4 GT Touring CORE                  | ...                                                     | ...bybruk, pendling, allsidig, trekking                | Kompakt lastesykkel med trinnløst... (Beskrivelse feil i OCR, bruker eksisterende) | Lavt innsteg; Stabil; Bosch Perf CX 85Nm; 625Wh (opptil 100km); Shimano Cues 10S; Setepinnedemping & dempegaffel; Brede 27.5" dekk (GT)             | KR 59.900 | low-step            | 25        | medium         | rear          | 50-120 km       | 0         | ...

    const BikeCatalog = {
        evoOriginal: [
            {
                id: 'tern-quick-haul-p9',
                name: "Quick Haul P9",
                purpose: ['bybruk', 'transport', 'pendling', 'allsidig', 'family'],
                description: "Kompakt og kraftig elsykkel med langt bagasjebrett (opptil 50 kg). Perfekt til både hverdag og småtransport – barn, handleposer eller hund. Brukervennlig, tilpassbar og solid bygget.",
                features: ["Kompakt elsykkel", "Bagasjebrett (opptil 50 kg)", "Plass til 1 barn", "Brukervennlig & tilpassbar", "Solid bygget", "Bosch Performance Line motor", "400Wh batteri"],
                price: "KR 29.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/06/Quick-Haul-H9-gronn-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-p9-400/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear',
                distance_km: [40, 80], // Var [20, 70]
                maxChildren: 1, preOrdered: false
            },
            {
                id: 'rm-multicharger2-mixte-gt-vario-family',
                name: "Multicharger Mixte GT vario Family",
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'],
                description: "Kraftig familiesykkel med plass til to barn og cargo foran. Beltedrift, trinnløst gir og 750 Wh batteri gir lang rekkevidde og lite vedlikehold. Lavt innsteg og komfortdemping.",
                features: ["Plass til 2 barn", "Beltedrift (Gates Carbon)", "Enviolo trinnløst gir", "750 Wh batteri", "Mixte-ramme (lavt innsteg)", "Komfortdemping", "Bosch Performance CX motor"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/25_F01186_110402080714_MuCha2_Mixte_GT_Var_47_UGrey-Blk_SafetyBar_Kiox300_Cargo-1024x683.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-vario-family/",
                frame_types: ['mid-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear',
                distance_km: [60, 150], // Var [40, 110]
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-multicharger2-mixte-gt-touring-family',
                name: "Multicharger Mixte GT Touring Family",
                purpose: ['transport', 'pendling', 'allsidig', 'family', 'trekking'],
                description: "Allsidig elsykkel for familien – trygg transport av barn og last. 750 Wh batteri, Shimano XT-gir og lavt innsteg. Perfekt til både hverdag og helg.",
                features: ["Trygg transport (barn/last)", "750 Wh batteri", "Shimano Deore XT 11-gir", "Mixte-ramme (lavt innsteg)", "Family Kit inkludert", "Bosch Performance CX motor"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Multicharger2-Mixte-GT-Vario-svart-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multicharger2-mixte-gt-touring-family/",
                frame_types: ['mid-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear',
                distance_km: [60, 150], // Var [40, 110]
                maxChildren: 2, preOrdered: false
            },
             {
                id: 'rm-multitinker-touring-family',
                name: "Multitinker Touring Family",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'],
                description: "Smart bysykkel med plass til to barn eller stor last. Shimano 11-gir og kjededrift gir kraft i motbakker. Kompakt, stabil og tilpasningsdyktig.",
                features: ["Plass til 2 barn / stor last", "Shimano Deore 11-gir Linkglide", "Kjededrift", "Kompakt (20\" hjul)", "Stabil & Tilpasningsdyktig", "Bosch Performance CX"],
                price: "KR 75.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Multitinker-Touring-Family-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-touring-family/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear',
                distance_km: [40, 120], // Var [30, 80]
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-multitinker-vario-family',
                name: "Multitinker Vario Family",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'],
                description: "Samme stabile Multitinker med trinnløst gir og beltedrift for enklere vedlikehold. Komfortabel, trygg og bygget for byliv med barn eller varer.",
                features: ["Plass til 2 barn / stor last", "Enviolo trinnløst gir", "Beltedrift (Gates)", "Vedlikeholdsvennlig", "Kompakt (20\" hjul)", "Stabil & Trygg", "Bosch Performance CX"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/Multitinker-Vario-bla-med-telt-prod-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-multitinker-vario-family/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear',
                distance_km: [40, 120], // Var [30, 80]
                maxChildren: 2, preOrdered: false
            },
             {
                id: 'tern-quick-haul-long-d9',
                name: "Quick Haul Long D9 400",
                purpose: ['transport', 'bybruk', 'allsidig', 'family'],
                description: "Lang og robust elsykkel som kan bære to barn og tung last. Stabil, lett å manøvrere og enkel å dele. 400 Wh batteri og Bosch Cargo Line-motor.",
                features: ["Kompakt lastesykkel (190 kg totalvekt)", "Designet for 2 barn / stor last", "Lavt innsteg & lang akselavstand (stabil)", "Bosch Cargo Line motor (85Nm)", "400 Wh batteri (25-85km)", "Parkerbar vertikalt", "Passer 155–185 cm"],
                price: "KR 49.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/11/Quick-Haul-Long-prod-rod-1-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-quick-haul-long-d9-400/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'rear',
                distance_km: [35, 85], // Var [25, 85]
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-nevo4-gt-vario-core',
                name: "NEVO4 GT vario CORE",
                purpose: ['bybruk', 'pendling', 'allsidig', 'trekking'],
                description: "Hverdagsvennlig elsykkel med lavt innsteg og trinnløst gir. Komfortabel og stabil med 625 Wh batteri og Bosch CX-motor.",
                features: ["Lavt innsteg", "Komfortabel sittestilling", "Enviolo trinnløst gir", "Gates karbonbelte", "Bosch Performance CX (85Nm)", "625Wh batteri (opptil 100km)", "Setepinnedemping & dempegaffel"],
                price: "KR 63.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Nevo4-GT-vario-CORE-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-nevo4-gt-vario-core/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear',
                distance_km: [40, 120], // Var [40, 100]
                maxChildren: 0, preOrdered: false
            },
            {
                id: 'rm-roadster4-touring',
                name: "Roadster4 Touring",
                purpose: ['pendling', 'bybruk'],
                description: "Lett, elegant og kraftig elsykkel. Perfekt for både by og tur. Integrert batteri og sporty komfort.",
                features: ["Lett og dynamisk design", "Bosch CX-motor (85Nm)", "625 Wh batteri integrert i rammen", "Komfort med dempegaffel", "Brede dekk", "Shimano Deore XT 11-gir"],
                price: "KR 59.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/25_F01130_0401060913_Rd4_Tou_56_BlkMtt_ChainbagVAUDE_5764-1024x683.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-roadster4-touring/",
                frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: 'rear',
                distance_km: [35, 90], // Samme som OCR
                maxChildren: 0, preOrdered: false
            },
            { // OPPDATERT: Riese & Müller Delite4 GT Touring
                id: 'rm-delite4-gt-touring',
                name: "Delite4 GT Touring",
                purpose: ['terreng', 'allsidig', 'adventure', 'pendling', 'trekking'],
                description: "Delite4 er i stand til å overvinne enhver utfordring – enten det er lange turer, krevende skogsstier eller bratte stigninger. Eksepsjonelt design, Riese & Müller Control Technology og kraftig Bosch Performance Line CX-motor med 750Wh batteri gir frihet og fleksibilitet.",
                features: [
                    "Riese & Müller Control Technology (fullfjæring)",
                    "Bosch Performance Line CX motor (85Nm)",
                    "Bosch PowerTube 750Wh batteri",
                    "Bosch Smart System med Kiox 300 display & eBike Flow app",
                    "Shimano Deore XT 11-S Linkglide girsystem (Touring)",
                    "Magura MT5/MT4 hydrauliske skivebremser",
                    "GX-option standard i Norge (Fox Float 140mm gaffel, Schwalbe Johnny Watts dekk)",
                    "Bremselys integrert i baklykt",
                    "Mulighet for ABS-bremser og Range Extender (ekstra)"
                ],
                price: "KR 86.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Delite4-GT-Touirng-coal-grey-24-1200x2000-1-1440x750-1.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-delite4-gt-touring/",
                frame_types: ['high-step', 'mid-step'], // Dobbeltsjekk om 'mid-step' faktisk er tilgjengelig
                speed_kmh: 25,
                cargo_capacity: 'small',
                cargo_location: 'rear',
                distance_km: [50, 140], // Basert på 750Wh batteri
                maxChildren: 0,
                preOrdered: false
            },
            {
                id: 'rm-load4-75-touring-familie',
                name: "Load4 75 Touring Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'],
                description: "Stor familiesykkel med tre barneseter, regntelt og demping foran og bak. Komfortabel og kraftig.",
                features: ["Fullfjæret lastesykkel (høy komfort)", "Transporterer opptil 3 barn", "Komplett utstyr (regntelt, bagasjebrett, belter)", "Bosch Cargo Line (Gen4, 85Nm)", "725 Wh batteri (40-120km)"],
                price: "KR 108.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load5-75-touring-famili-prod-1536x1024.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-touring-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front',
                distance_km: [40, 120], // Samme som OCR
                maxChildren: 3, preOrdered: false
            },
            {
                id: 'rm-load4-60-touring-familie',
                name: "Load4 60 Touring Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'],
                description: "Kompakt familiesykkel med demping, regntelt og to seter. Praktisk, trygg og fullspekket med utstyr.",
                features: ["Demper foran og bak (maks komfort)", "Transporterer 2 barn", "Komplett familiepakke (regntelt, bagasjebrett)", "Bosch Cargo Line (Gen4)", "725 Wh batteri", "Universell størrelse"],
                price: "KR 99.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-1536x816.webp",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-60-touring-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front',
                distance_km: [40, 100], // Var [30, 80]
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-delite5-gt-pinion',
                name: "Delite5 GT pinion",
                purpose: ['pendling', 'terreng', 'trekking', 'adventure', 'allsidig'],
                description: "Fulldempet elsykkel med integrert gir og motor. Høy ytelse for pendlere og langtur.",
                features: ["Integrert Pinion E-Drive System", "Fulldemping (Control Technology)", "Resirkulert alu-ramme", "Skjermet drivverk", "Bosch 800 Wh batteri", "Lang rekkevidde", "Dropper-setepinne", "Bosch Performance CX motor"],
                price: "KR 105.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/09/25_F01315_040209081506_Delite5_GT_Pinion_51_StoneGrey_2755-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-delite5-gt-pinion/",
                frame_types: ['high-step', 'mid-step'],
                speed_kmh: 25, cargo_capacity: 'small', cargo_location: 'rear',
                distance_km: [50, 150], // Samme som OCR
                maxChildren: 0, preOrdered: false
            },
            {
                id: 'rm-load4-75-vario-familie',
                name: "Load4 75 Vario Familie",
                purpose: ['transport', 'family', 'pendling', 'allsidig'],
                description: "Kraftig lastesykkel med beltedrift og plass til tre barn. Komfortabel og robust med demping og regntelt.",
                features: ["Plass til 3 barn", "Fullfjæret", "Lettkjørt (tung last)", "Beltedrift (Gates)", "Enviolo trinnløst gir", "Bosch Cargo Line motor", "725 Wh batteri", "Komplett familiepakke"],
                price: "KR 113.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/11/Load4-75-vario-familie-peanut-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-75-vario-familie-2/",
                frame_types: ['cargo'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front',
                distance_km: [40, 120], // Var [30, 80]
                maxChildren: 3, preOrdered: false
            },
             {
                id: 'tern-gsd-s10-gen3',
                name: "Tern GSD Gen3 S10",
                purpose: ['transport', 'family', 'bybruk', 'allsidig', 'pendling'],
                description: "Solid lastesykkel med Bosch Cargo Line-motor. Plass til to barn og stor last. Stabil og allsidig.",
                features: ["Bosch Cargo Line Gen 4 (85 Nm)", "DualBattery-kompatibel (opptil 200 km)", "Rom for 2 barneseter / 1 voksen", "Hydrauliske skivebremser m/ ABS", "Brede 20″ dekk, lavt tyngdepunkt", "Total lastekapasitet 210 kg"],
                price: "KR 82.000",
                image: "https://evoelsykler.no/wp-content/uploads/2025/03/TN-photo-GSD_S10-gen3-olive-profile-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/tern-gsd-gen3-s10/",
                frame_types: ['cargo-longtail', 'low-step'], // OCR sa "lov", antar "low-step"
                speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'rear',
                distance_km: [50, 200], // Samme som OCR
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-load4-60-vario-familie',
                name: "Load4 60 Vario Familie",
                purpose: ['transport', 'family', 'bybruk', 'allsidig'],
                description: "Fulldempet familiesykkel med lavt tyngdepunkt. Plass til to barn og komplett utstyr inkludert.",
                features: ["Plass til 2 barn", "Enviolo trinnløst navgir", "Beltedrift (Gates)", "Bosch Cargo Line (Gen4, 85Nm)", "Fulldempet", "725 Wh batteri (40-120km)", "Komplett familiepakke (regntelt, etc.)", "Bosch SmartSystem Kiox 300"],
                price: "KR 104.000",
                image: "https://evoelsykler.no/wp-content/uploads/2023/01/Load460Green_3000x-640x340.webp",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-load4-60-vario-familie-2/",
                frame_types: ['cargo', 'low-step'], speed_kmh: 25, cargo_capacity: 'massive', cargo_location: 'front',
                distance_km: [40, 120], // Samme som OCR
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-carrie-touring',
                name: "Carrie Touring",
                purpose: ['transport', 'bybruk', 'allsidig'],
                description: "Kompakt lastesykkel med fleksibelt lasteområde. Praktisk og manøvrerbar i byen.",
                features: ["Kompakt lastesykkel", "Stort lasteområde (Flex Box)", "Bosch Performance Line (75Nm)", "545 Wh batteri (oppgraderbar)", "Microshift 10-trinns gir", "Bosch SmartSystem Intuvia 100", "Valgfri dempende setepinne"],
                price: "KR 74.850",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Carrie-touring-m-flex-box-prod-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-carrie-touring-2/",
                frame_types: ['cargo', 'low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'front',
                distance_km: [35, 80], // Var [25, 70]
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-carrie-vario',
                name: "Carrie Vario",
                purpose: ['transport', 'bybruk', 'allsidig', 'pendling'],
                description: "Kompakt lastesykkel med trinnløst gir og beltedrift. Smart system og lavt vedlikehold.",
                features: ["Kompakt lastesykkel", "Stort lasteområde (Flex Box)", "Bosch Performance Line (75Nm)", "545 Wh batteri (oppgraderbar)", "Enviolo navgir (trinnløst)", "Beltedrift", "Vedlikeholdsvennlig", "Bosch SmartSystem Intuvia 100"],
                price: "KR 79.000",
                image: "https://evoelsykler.no/wp-content/uploads/2024/03/Carrie-Vario-aqua-basic-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-carrie-vario/",
                frame_types: ['cargo', 'low-step'], speed_kmh: 25, cargo_capacity: 'large', cargo_location: 'front',
                distance_km: [35, 80], // Var [25, 70]
                maxChildren: 2, preOrdered: false
            },
            {
                id: 'rm-nevo4-gt-touring-core',
                name: "Nevo4 GT Touring CORE",
                purpose: ['bybruk', 'pendling', 'allsidig', 'trekking'],
                description: "Riese & Müller Nevo4 GT Touring CORE er bysykler med et særegent rammedesign, designet for å kunne brukes av alle, uavhengig av kjønn og alder. Rammedesign med det lave innsteget betyr enkel og komfortabel av- og påstigning. Nevo er stabil, trygg, komfortabel, og på toppen av det hele er den morsom å sykle. En ekte hverdags- og helårssykkel.",
                features: ["Lavt innsteg", "Stabil, trygg, komfortabel", "Bosch Performance CX (85Nm)", "625Wh batteri (opptil 100km)", "Shimano Cues 10S", "Setepinnedemping & dempergaffel", "Brede 27,5\" dekk (GT)"],
                price: "KR 59.900",
                image: "https://evoelsykler.no/wp-content/uploads/2024/10/Nevo4-GT-Touring-CORE-640x427.jpg",
                productUrl: "https://evoelsykler.no/produkt/riese-muller-nevo4-gt-touring-core/",
                frame_types: ['low-step'], speed_kmh: 25, cargo_capacity: 'medium', cargo_location: 'rear',
                distance_km: [50, 120], // Var [40, 100]
                maxChildren: 0, preOrdered: false
            }
        ]
    };

    // --- State ---
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
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
    const contactEvoSection = document.getElementById('contact-evo-section');

    // --- Steps definisjon ---
    const steps = [
        { id: 'purpose', title: 'Jeg ser etter en sykkel for', options: [ { id: 'pendling', label: 'Turer eller pendling til jobb' }, { id: 'bybruk', label: 'Være ute i byen / Koseturer' }, { id: 'terreng', label: 'Bevege meg utenfor veien (sti/grus)' }, { id: 'transport', label: 'Transportere mye (varer/barn)' }, { id: 'allsidig', label: 'En allsidig sykkel til "litt av alt"' } ] },
        { id: 'distance', title: 'Den bør passe til', options: [ { id: 'kort', label: 'Kortere avstander (opptil 20 km)' }, { id: 'medium', label: 'Mellomdistanse (20-50 km)' }, { id: 'lang', label: 'Lange avstander (50+ km)' } ] },
        { id: 'cargo', title: 'Jeg trenger å frakte', options: [ { id: 'små', label: 'Lite (f.eks. veske, liten handlepose)' }, { id: 'store', label: 'Medium (f.eks. ukentlig handling, større bagasje)' }, { id: 'massiv', label: 'Mye (f.eks. barn, kjæledyr, store/tunge varer)' } ] },
        { id: 'frameType', title: 'Jeg foretrekker en ramme med', options: [ { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Enkelt å stige på og av' }, { id: 'lavtTopprør', label: 'Trapés / Lavt overrør', description: 'Sporty, men lettere å stige på/av enn høy' }, { id: 'høytTopprør', label: 'Diamant / Høyt overrør', description: 'Tradisjonell, ofte stivere ramme' } ] },
        { id: 'cargoLocation', title: 'Jeg ser for meg en', options: [ { id: 'frontlaster', label: 'Frontlaster', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' }, { id: 'langhale', label: 'Langhale (Longtail)', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett bak', className: 'cargo-type' } ], condition: () => selections.purpose === 'transport' }
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
          const cargoSpan = createSpan(selections.cargo, 'cargo', 'lastemengde'); if (cargoSpan) sentenceParts.push(`Jeg trenger å fraakte ${cargoSpan}.`);
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

     function updateView() {
        totalSteps = calculateTotalVisibleSteps();
        if (showRecommendationsView) {
            questionsSection.classList.add('hidden');
            recommendationsSection.classList.remove('hidden');
            if (contactEvoSection) {
                if (recommendations.length > 0) {
                    contactEvoSection.classList.remove('hidden');
                } else {
                    contactEvoSection.classList.add('hidden');
                }
            }
        } else {
            questionsSection.classList.remove('hidden');
            recommendationsSection.classList.add('hidden');
            if (contactEvoSection) contactEvoSection.classList.add('hidden');
            loadingIndicator.classList.add('hidden');
            recommendationsOutput.classList.add('hidden');
            renderSentence(sentenceBuilder);
            renderOptions();
            const currentVisible = calculateCurrentVisibleStep();
            backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1);
        }
        updateProgress();
     }

    // --- Logikk for Anbefalinger ---
    function generateAndShowRecommendations() {
        console.log("Starter generering av anbefalinger med valg:", JSON.parse(JSON.stringify(selections)));
        relaxedSearchPerformed = false;

        showRecommendationsView = true;
        questionsSection.classList.add('hidden');
        recommendationsSection.classList.remove('hidden');
        recommendationsOutput.classList.add('hidden'); 
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        renderSentence(summarySentenceFinal);
        recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            console.log("Utfører filtrering og sortering...");
            const filterBikes = (relaxFrameType = false, relaxDistance = false, purposeOnly = false) => {
                let bikesToFilter = [...BikeCatalog.evoOriginal];
                // console.log(`Filtrerer med: relaxFrameType=${relaxFrameType}, relaxDistance=${relaxDistance}, purposeOnly=${purposeOnly}`); // Kan reduseres for mindre støy i loggen
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
            // console.log(`Treff etter streng filtrering: ${potentialMatches.length}`);
            if (potentialMatches.length === 0) {
                // console.log("Ingen treff, slapper av rammetype-filteret...");
                potentialMatches = filterBikes(true); relaxedSearchPerformed = true;
                // console.log(`Treff etter avslappet rammetype: ${potentialMatches.length}`);
            }
             if (potentialMatches.length === 0 && selections.purpose) { 
                //  console.log("Siste utvei: Viser sykler basert kun på formål...");
                 potentialMatches = filterBikes(false, false, true); relaxedSearchPerformed = true; 
                //  console.log(`Treff basert kun på formål: ${potentialMatches.length}`);
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
            // console.log(`Sortert med prioritert barnematch, deretter cargo.`);

            recommendations = potentialMatches.slice(0, 3);
            console.log("Endelige anbefalinger:", recommendations.map(b => `${b.name} (ID: ${b.id}, Kids: ${b.maxChildren ?? 'N/A'})`));

            loadingIndicator.classList.add('hidden');
            renderRecommendations();
            recommendationsOutput.classList.remove('hidden');
            if (contactEvoSection) { 
                if (recommendations.length > 0) {
                    contactEvoSection.classList.remove('hidden');
                } else {
                    contactEvoSection.classList.add('hidden');
                }
            }
        }, 500);
    }

    // --- Event Handlers ---
    function handleOptionSelect(stepId, value) {
        selections[stepId] = value; // console.log("Valg:", stepId, "=", value);
        trackAdvisorEvent('option_selected', {
            step_id: stepId,
            selected_value: value,
            step_number: calculateCurrentVisibleStep() 
        });

        if (stepId === 'purpose' && value !== 'transport') { selections.cargoLocation = null; }
        currentStep++; let next = steps[currentStep - 1];
        while(next && next.condition && !next.condition()) { /*console.log(`Hopper over ${currentStep}: ${next.id}`);*/ if (selections[next.id] !== undefined) selections[next.id] = null; currentStep++; next = steps[currentStep - 1]; }
        totalSteps = calculateTotalVisibleSteps();
        // console.log("Logisk:", currentStep, "Neste synlige:", calculateCurrentVisibleStep(), "Totalt:", totalSteps);
        if (currentStep > steps.length) { 
            // console.log("Ferdig"); 
            trackAdvisorEvent('quiz_completed', selections);
            generateAndShowRecommendations(); 
        } else { 
            // console.log("Neste spørsmål"); 
            updateView(); 
        }
     }
     function handleBack() {
         if (showRecommendationsView) {
             showRecommendationsView = false; let lastVisIdx = -1;
             for (let i = 0; i < steps.length; i++) { const s = steps[i]; if (!s.condition || s.condition()) { lastVisIdx = i; } }
             currentStep = lastVisIdx + 1; // console.log("Tilbake fra resultat ->", currentStep); 
             trackAdvisorEvent('navigation_back_from_results', { to_step: currentStep });
             updateView();
         } else if (currentStep > 1) {
             const fromStep = calculateCurrentVisibleStep();
             currentStep--; let prev = steps[currentStep - 1];
             while (currentStep > 1 && prev && prev.condition && !prev.condition()) { /*console.log(`Hopper bakover ${currentStep}: ${prev.id}`);*/ currentStep--; prev = steps[currentStep -1]; }
             // console.log("Går tilbake ->", currentStep); 
             trackAdvisorEvent('navigation_back', { from_step_visible: fromStep, to_step_visible: calculateCurrentVisibleStep() });
             updateView();
         } // else { console.log("Kan ikke gå tilbake"); }
     }
     function resetAdvisor() {
        // console.log("Reset."); 
        trackAdvisorEvent('advisor_reset', { from_step: showRecommendationsView ? 'results' : calculateCurrentVisibleStep() });
        currentStep = 1;
        selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
        recommendations = []; showRecommendationsView = false; totalSteps = calculateTotalVisibleSteps();
        if (contactEvoSection) contactEvoSection.classList.add('hidden');
        updateView();
     }

    // --- START: Sporingsfunksjonalitet ---
    function trackAdvisorEvent(eventName, eventParameters) {
        console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {}); // Endret logg for tydelighet
        // Eksempel for Meta Pixel (krever at fbq er definert globalt)
        // if (typeof fbq === 'function') {
        //     const metaEventName = `Advisor_${eventName}`;
        //     const paramsToSend = eventParameters && Object.keys(eventParameters).length > 0 ? { ...eventParameters } : {};
        //     // For 'quiz_completed' og 'view_bike_details', kan man vurdere standard events
        //     if (eventName === 'quiz_completed') fbq('track', 'Lead', paramsToSend); // Eksempel
        //     else if (eventName === 'view_bike_details') fbq('track', 'ViewContent', paramsToSend); // Eksempel
        //     else fbq('trackCustom', metaEventName, paramsToSend);
        // }
        // Eksempel for GA4 (krever at gtag er definert globalt)
        // if (typeof gtag === 'function') {
        //     const ga4EventName = `advisor_${eventName.toLowerCase()}`;
        //     const paramsToSend = eventParameters && Object.keys(eventParameters).length > 0 ? { ...eventParameters } : {};
        //     gtag('event', ga4EventName, paramsToSend);
        // }
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
                eventName = 'contact_button_click';
                params.contact_method = 'email_button_main'; // Mer spesifikk
            } else if (elementId === 'track-call-button') {
                eventName = 'call_button_click';
                params.contact_method = 'phone_button_main'; // Mer spesifikk
                params.phone_number = trackableStaticElement.href;
            } else if (elementId === 'track-footer-contact-email-link') {
                eventName = 'footer_contact_link_click';
                params.contact_method = 'email_link_footer'; // Mer spesifikk
            } else if (elementId === 'track-footer-call-link') {
                eventName = 'footer_call_link_click';
                params.contact_method = 'phone_link_footer'; // Mer spesifikk
                params.phone_number = trackableStaticElement.href;
            } else if (elementId.startsWith('track-no-results')) {
                eventName = 'no_results_interaction';
                params.interaction_type = elementId.includes('contact') ? 'contact_link_click' : 'call_link_click';
                params.search_context = elementId.includes('relaxed') ? 'relaxed_search' : 'strict_search';
                params.contact_method = elementId.includes('call') ? 'phone' : 'contact_page_or_email';
            }
            
            trackAdvisorEvent(eventName, params);
            tracked = true;
        }
    });
    // --- SLUTT: Sporingsfunksjonalitet ---

    // --- 9. Initialisering ---
    if(backButton) backButton.addEventListener('click', handleBack);
    if(resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
    if(resetButtonFinal) resetButtonFinal.addEventListener('click', resetAdvisor);
    if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    totalSteps = calculateTotalVisibleSteps();
    trackAdvisorEvent('advisor_loaded');
    updateView();

});
