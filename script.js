document.addEventListener('DOMContentLoaded', async () => {
    if (window.self !== window.top) {
        document.body.classList.add('embedded');
    }

    // --- Konstanter ---
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby1fKwz3GoV8LjF2EBcmPyDHQbl7JMp5JGzzJBwn6safnupipUPqs_6qxJt6fHFsOTx/exec';

    // --- State Variabler ---
    let BikeCatalog = { evoOriginal: [] };
    let currentStep = 1;
    let selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
    let recommendations = [];
    let showRecommendationsView = false;
    let relaxedSearchPerformed = false;
    let totalSteps;
    let newsletterModalShownThisSession = false;
    let teaserShownThisSession = false;
    let scrolledPastRecommendations = false;
    let teaserTimeout = null;
    let modalTimeout = null;

    // --- DOM Referanser ---
    const initialLoader = document.getElementById('initial-loader');
    const initialLoaderText = document.getElementById('bike-loading-text-element');
    const bikeImageElement = initialLoader ? initialLoader.querySelector('.bike-loader-png') : null;
    const questionsSection = document.getElementById('questions-section');
    const recommendationsSection = document.getElementById('recommendations-section');
    const selectionSummary = document.getElementById('selection-summary');

    const stepTitle = document.getElementById('step-title');
    const stepOptions = document.getElementById('step-options');
    const backButton = document.getElementById('back-button');
    const resetButtonStep = document.getElementById('reset-button-step');
    const resetButtonFinal = document.getElementById('reset-button-final');
    const recommendationsOutput = document.getElementById('recommendations-output');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const loadingIndicator = document.getElementById('loading-indicator');
    const contactEvoSection = document.getElementById('contact-evo-section');

    // Modal DOM Referanser
    const newsletterPopupModal = document.getElementById('newsletter-popup-modal');
    const closeNewsletterModalBtn = document.getElementById('close-newsletter-modal');
    const modalNewsletterForm = document.getElementById('modal-newsletter-form');
    const modalNewsletterNameInput = document.getElementById('modal-newsletter-name');
    const modalNewsletterEmailInput = document.getElementById('modal-newsletter-email');
    const modalNewsletterPhoneInput = document.getElementById('modal-newsletter-phone');
    const modalNewsletterConsentCheckbox = document.getElementById('modal-newsletter-consent');
    const modalNewsletterMessage = document.getElementById('modal-newsletter-message');
    const modalNewsletterFormWrapper = document.getElementById('modal-newsletter-form-wrapper');
    const modalNewsletterThankyouWrapper = document.getElementById('modal-newsletter-thankyou-wrapper');
    const openNewsletterPopupBtn = document.getElementById('open-newsletter-popup-btn');

    // NYTT: Teaser DOM Referanser
    const newsletterTeaser = document.getElementById('newsletter-teaser');
    const teaserCtaBtn = document.getElementById('teaser-cta-btn');
    const teaserCloseBtn = document.getElementById('teaser-close-btn');

    // --- Steps Definisjon ---
    const steps = [
        {
            id: 'purpose',
            title: 'Hva skal sykkelen brukes til?',
            options: [
                { id: 'pendling', label: 'Pendling og turer' },
                { id: 'bybruk', label: 'Byliv og korte turer' },
                { id: 'terreng', label: 'Sti og grus' },
                { id: 'transport', label: 'Frakt av barn eller varer' },
                { id: 'allsidig', label: 'Litt av alt' }
            ]
        },
        {
            id: 'distance',
            title: 'Hvor langt skal du sykle?',
            options: [
                { id: 'kort', label: 'Opptil 20 km' },
                { id: 'medium', label: '20-50 km' },
                { id: 'lang', label: 'Over 50 km' }
            ]
        },
        {
            id: 'cargo',
            title: 'Hva trenger du å frakte?',
            options: [
                { id: 'små', label: 'Veske eller handlepose' },
                { id: 'store', label: 'Ukeshandel eller bagasje' },
                { id: 'massiv', label: 'Barn, kjæledyr eller tunge varer' }
            ]
        },
        {
            id: 'frameType',
            title: 'Hvilken ramme foretrekker du?',
            options: [
                { id: 'dypGjennomgang', label: 'Lavt innsteg', description: 'Lett å komme på og av' },
                { id: 'høytTopprør', label: 'Høyt overrør', description: 'Sportslig og stabil' }
            ]
        },
        {
            id: 'cargoLocation',
            title: 'Hvor vil du ha lasten?',
            options: [
                { id: 'frontlaster', label: 'Foran', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/front-1.png', description: 'Lasteboks foran', className: 'cargo-type' },
                { id: 'langhale', label: 'Bak', image: 'https://evoelsykler.no/wp-content/uploads/2025/04/longtail.png', description: 'Forlenget bagasjebrett', className: 'cargo-type' }
            ],
            condition: () => selections.purpose === 'transport'
        }
    ];

    // --- Hjelpefunksjoner ---
    function getStepDefinition(stepNum) { let visibleStepIndex = 0; for (const stepDef of steps) { const isConditional = typeof stepDef.condition === 'function'; if (!isConditional || stepDef.condition()) { visibleStepIndex++; if (visibleStepIndex === stepNum) { return stepDef; } } } return null; }
    function getLabelById(optionsArray, id) { if (!optionsArray || !id) return `[mangler data]`; const option = optionsArray.find(opt => opt.id === id); return option ? option.label : `[${id}]`; }
    function updateProgress() { const currentVisibleStep = calculateCurrentVisibleStep(); const totalVisibleSteps = calculateTotalVisibleSteps(); const progressPercentage = totalVisibleSteps > 0 ? (currentVisibleStep / totalVisibleSteps) * 100 : 0; if (progressBar) progressBar.style.width = `${Math.min(100, progressPercentage)}%`; if (progressText) progressText.textContent = `Trinn ${currentVisibleStep}/${totalVisibleSteps}`; }
    function calculateCurrentVisibleStep() { let visibleStepCount = 0; let logicalStepIndex = 0; while (logicalStepIndex < currentStep && logicalStepIndex < steps.length) { const stepDef = steps[logicalStepIndex]; if (!stepDef || !stepDef.condition || stepDef.condition()) { visibleStepCount++; } logicalStepIndex++; } const totalVisible = calculateTotalVisibleSteps(); if (currentStep > steps.length && totalVisible > 0) { return totalVisible; } return Math.min(Math.max(1, visibleStepCount), totalVisible > 0 ? totalVisible : 1); }
    function calculateTotalVisibleSteps() { let totalVisible = 0; steps.forEach(step => { if (!step.condition || step.condition()) { totalVisible++; } }); return totalVisible; }

    // --- Hent Sykkeldata ---
    async function fetchBikeCatalog() {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.length < 60) {
            console.error("GAS_WEB_APP_URL er ikke korrekt satt. Kan ikke hente sykkeldata.");
            if (initialLoaderText) initialLoaderText.textContent = 'Konfigurasjonsfeil. Kan ikke laste sykkeldata.';
            if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
            if (initialLoader) initialLoader.classList.remove('hidden');
            if (questionsSection) questionsSection.classList.add('hidden');
            return false;
        }
        if (initialLoader) initialLoader.classList.remove('hidden');
        if (questionsSection) questionsSection.classList.add('hidden');
        try {
            const response = await fetch(GAS_WEB_APP_URL, { method: 'GET', mode: 'cors' });
            if (!response.ok) {
                let errorDetails = `HTTP error! status: ${response.status} ${response.statusText}`;
                try { const errorText = await response.text(); errorDetails += `, ${errorText}`; } catch (e) { /* Ignorer */ }
                throw new Error(errorDetails);
            }
            const data = await response.json();
            if (data.error) {
                console.error("Feil returnert fra Google Apps Script (doGet):", data);
                throw new Error(`Feil fra Google Apps Script (doGet): ${data.message || 'Ukjent feil fra server.'}`);
            }

            // Håndter både array og object med metadata
            if (Array.isArray(data)) {
                BikeCatalog.evoOriginal = data;
                console.log("Sykkelkatalog lastet:", BikeCatalog.evoOriginal.length, "sykler funnet.");
            } else if (data.products && Array.isArray(data.products)) {
                BikeCatalog.evoOriginal = data.products;
                console.log("Sykkelkatalog lastet:", BikeCatalog.evoOriginal.length, "sykler funnet.");
                if (data.metadata) {
                    console.log("📊 Datakilde:", data.metadata.source === 'merchant_center' ? '🛒 Google Merchant Center' : '📄 Google Sheets');
                    console.log("⏰ Sist oppdatert:", data.metadata.timestamp);
                }
            } else {
                BikeCatalog.evoOriginal = data;
                console.log("Sykkelkatalog lastet:", BikeCatalog.evoOriginal.length, "sykler funnet.");
            }

            return true;
        } catch (error) {
            console.error("Feil ved henting av sykkelkatalog via Apps Script:", error);
            if (initialLoaderText) initialLoaderText.textContent = 'Kunne ikke laste sykkeldata. Prøv igjen senere.';
            if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
            if (initialLoader) initialLoader.classList.remove('hidden');
            if (questionsSection) questionsSection.classList.add('hidden');
            return false;
        } finally {
            if (BikeCatalog.evoOriginal.length > 0) {
                if (initialLoader) initialLoader.classList.add('hidden');
            } else if (initialLoader && !initialLoaderText.textContent.includes('Konfigurasjonsfeil') && !initialLoaderText.textContent.includes('Kunne ikke laste')) {
                if (initialLoaderText) initialLoaderText.textContent = 'Sykkelkatalogen er tom for øyeblikket.';
                if (initialLoader && bikeImageElement) bikeImageElement.style.display = 'none';
                if (initialLoader) initialLoader.classList.remove('hidden');
                if (questionsSection) questionsSection.classList.add('hidden');
            }
        }
    }

    // --- Rendering Funksjoner ---
    function renderOptions() {
        const currentVisibleStepNum = calculateCurrentVisibleStep();
        if (currentStep > steps.length) { if (!showRecommendationsView) { generateAndShowRecommendations(); } return; }
        const stepDef = getStepDefinition(currentVisibleStepNum);
        if (!stepDef) { if (!showRecommendationsView) { generateAndShowRecommendations(); } return; }
        if (stepTitle) stepTitle.textContent = stepDef.title;
        if (stepOptions) {
            stepOptions.innerHTML = '';
            stepDef.options.forEach((option) => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                if (option.className) { button.classList.add(option.className); }
                button.dataset.value = option.id;
                if (option.className === 'cargo-type') {
                    button.innerHTML = `${option.image ? `<img src="${option.image}" alt="${option.label}" onerror="this.style.display='none'; this.nextSibling.style.marginTop='0';">` : ''}<div><div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}</div>`;
                } else {
                    button.innerHTML = `<div>${option.label}</div>${option.description ? `<div class="description">${option.description}</div>` : ''}`;
                }
                if (selections[stepDef.id] === option.id) { button.classList.add('selected'); }
                button.addEventListener('click', () => handleOptionSelect(stepDef.id, option.id));
                stepOptions.appendChild(button);
            });
        }
        updateProgress();
    }

    function renderSelectionSummary() {
        if (!selectionSummary) return;
        selectionSummary.innerHTML = '';

        // Iterate through steps up to currentStep - 1 (completed steps)
        // Or iterate through all steps and show only those with selections?
        // Let's show selections for steps that are "active" and have a value.

        steps.forEach((step, index) => {
            // Check if step is relevant (condition met)
            if (step.condition && !step.condition()) return;

            // Check if we have a selection for this step
            const val = selections[step.id];
            if (val) {
                const label = getLabelById(step.options, val);
                const badge = document.createElement('div');
                badge.classList.add('summary-badge');
                // Optional: Add icon based on step ID if we wanted
                badge.innerHTML = `
                    <span class="badge-label">${label}</span>
                    <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                `;
                badge.addEventListener('click', () => {
                    // Allow clicking badge to jump back? 
                    // For now, let's just keep it visual or maybe simple jump
                    // jumpToStep(index + 1); // We'd need to implement jumpToStep safely
                });
                selectionSummary.appendChild(badge);
            }
        });
    }



    function renderRecommendations() {
        if (!recommendationsOutput) return;
        recommendationsOutput.innerHTML = '';
        if (recommendations.length === 0 && !relaxedSearchPerformed) { recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box"><h3>Ingen perfekt match funnet</h3><p>Basert på dine spesifikke valg, fant vi dessverre ingen sykler som passet 100%.</p><h4>Hva nå?</h4><ul><li>Prøv å gå tilbake og justere ett eller flere av valgene dine.</li><li><a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-contact-link">Kontakt oss</a> for veiledning, eller ring <a href="tel:+4723905555" id="track-no-results-call-link">23 90 55 55</a>.</li></ul></div>`; return; }
        else if (recommendations.length === 0 && relaxedSearchPerformed) { recommendationsOutput.innerHTML = `<div class="no-results contact-prompt-box"><h3>Fant ingen modeller</h3><p>Selv med justerte søkekriterier fant vi ingen passende modeller.</p><h4>Vi hjelper deg!</h4><p><a href="https://evoelsykler.no/kontakt-oss/" target="_blank" id="track-no-results-relaxed-contact-link">Kontakt oss</a> eller ring <a href="tel:+4723905555" id="track-no-results-relaxed-call-link">23 90 55 55</a>.</p></div>`; return; }

        recommendations.forEach((bike, index) => {
            const card = document.createElement('div');
            card.classList.add('recommendation-card');
            let badgeText = '';
            if (relaxedSearchPerformed) {
                if (index === 0) badgeText = 'NÆRMESTE VALG'; else if (index === 1) badgeText = 'GODT ALTERNATIV'; else if (index === 2) badgeText = 'ALTERNATIV';
            } else { if (index === 0) badgeText = 'TOPPVALG'; else if (index === 1) badgeText = 'GOD MATCH'; else if (index === 2) badgeText = 'ALTERNATIV'; }
            let childInfoHTML = ''; if (bike.maxChildren && bike.maxChildren > 0) { const t = bike.maxChildren === 1 ? "ett barn" : `${bike.maxChildren} barn`; childInfoHTML = `<p class="child-capacity-info"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:1.1em;height:1.1em;"><path fill-rule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z" clip-rule="evenodd" /></svg> Passer for opptil ${t}.</p>`; }
            let featuresHTML = ''; if (bike.features && Array.isArray(bike.features) && bike.features.length > 0) { featuresHTML = `<div class="recommendation-features"><h4>Nøkkelegenskaper:</h4><ul>${bike.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`; }

            // Legg til tracking på URL
            const trackingParams = "?utm_source=sykkelvelger&utm_medium=referral&utm_campaign=bonus_lock&coupon=SYKKELVELGER";
            const productUrlWithTracking = (bike.productUrl || '#') + trackingParams;

            const imageLink = document.createElement('a'); imageLink.href = productUrlWithTracking; imageLink.target = '_blank'; imageLink.title = `Se ${bike.name}`; imageLink.dataset.trackEvent = 'view_bike_details_image'; imageLink.dataset.bikeId = bike.id; imageLink.dataset.bikeName = bike.name;
            imageLink.innerHTML = `<img src="${bike.image || 'https://placehold.co/300x180/e9ecef/343a40?text=Bilde+mangler'}" alt="${bike.name || 'Sykkelbilde'}" class="recommendation-image" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x180/e9ecef/343a40?text=Bilde+feilet';">`;
            const imageContainer = document.createElement('div'); imageContainer.classList.add('recommendation-image-container'); imageContainer.appendChild(imageLink);
            const detailsButton = `<a href="${productUrlWithTracking}" target="_blank" class="button button-primary" data-track-event="view_bike_details_button" data-bike-id="${bike.id}" data-bike-name="${bike.name}">Se detaljer</a>`;
            card.innerHTML = `${badgeText ? `<div class="recommendation-badge">${badgeText}</div>` : ''}${imageContainer.outerHTML}<button class="card-toggle" aria-expanded="false">Mer info</button><div class="recommendation-content"><h3>${bike.name || 'Sykkelnavn mangler'}</h3>${childInfoHTML}<p class="description">${bike.description || 'Ingen beskrivelse.'}</p>${featuresHTML}<div class="recommendation-footer"><div class="recommendation-price">${bike.price ? `<span class="price-label">Fra</span><span class="price-value">${bike.price}</span>` : ''}</div><div class="recommendation-buttons">${detailsButton}</div></div></div>`;

            const toggleBtn = card.querySelector('.card-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    card.classList.toggle('expanded');
                    const expanded = card.classList.contains('expanded');
                    toggleBtn.textContent = expanded ? 'Skjul info' : 'Mer info';
                    toggleBtn.setAttribute('aria-expanded', expanded);
                });
            }

            recommendationsOutput.appendChild(card);
        });
    }

    // --- NYTT: Teaser Funksjoner ---
    function showTeaser() {
        if (newsletterTeaser && !teaserShownThisSession && !newsletterModalShownThisSession && showRecommendationsView && recommendations.length > 0) {
            newsletterTeaser.classList.remove('hidden');
            teaserShownThisSession = true;
            if (typeof sendHeight === 'function') sendHeight();
            trackAdvisorEvent('newsletter_teaser_shown');
        }
    }

    function hideTeaser() {
        if (newsletterTeaser) {
            newsletterTeaser.classList.add('hidden');
            if (typeof sendHeight === 'function') sendHeight();
        }
    }

    // --- Modal Funksjoner (Oppdatert) ---
    function openNewsletterModal() {
        if (newsletterPopupModal && !newsletterModalShownThisSession) {
            // Skjul teaser hvis den vises
            hideTeaser();

            if (modalNewsletterFormWrapper && modalNewsletterThankyouWrapper && modalNewsletterThankyouWrapper.classList.contains('hidden')) {
                if (modalNewsletterNameInput) modalNewsletterNameInput.value = '';
                if (modalNewsletterEmailInput) modalNewsletterEmailInput.value = '';
                if (modalNewsletterPhoneInput) modalNewsletterPhoneInput.value = '';
                if (modalNewsletterConsentCheckbox) modalNewsletterConsentCheckbox.checked = false;
                if (modalNewsletterMessage) modalNewsletterMessage.textContent = '';
                const submitBtn = modalNewsletterForm ? modalNewsletterForm.querySelector('button[type="submit"]') : null;
                if (submitBtn) submitBtn.disabled = false;
                modalNewsletterFormWrapper.classList.remove('hidden');
                modalNewsletterThankyouWrapper.classList.add('hidden');
                modalNewsletterThankyouWrapper.innerHTML = '';
            }
            newsletterPopupModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (typeof sendHeight === 'function') sendHeight();
            newsletterModalShownThisSession = true;
            trackAdvisorEvent('newsletter_modal_shown');
            try {
                parent.postMessage({ type: 'modalOpen' }, '*');
            } catch (e) {
                console.error('Failed to postMessage modalOpen:', e);
            }
        }
    }

    function closeNewsletterModal() {
        if (newsletterPopupModal) {
            newsletterPopupModal.classList.add('hidden');
            document.body.style.overflow = '';
            if (typeof sendHeight === 'function') sendHeight();
            if (modalNewsletterFormWrapper && modalNewsletterThankyouWrapper) {
                modalNewsletterFormWrapper.classList.remove('hidden');
                modalNewsletterThankyouWrapper.classList.add('hidden');
                modalNewsletterThankyouWrapper.innerHTML = '';
                if (modalNewsletterNameInput) modalNewsletterNameInput.value = '';
                if (modalNewsletterEmailInput) modalNewsletterEmailInput.value = '';
                if (modalNewsletterPhoneInput) modalNewsletterPhoneInput.value = '';
                if (modalNewsletterConsentCheckbox) modalNewsletterConsentCheckbox.checked = false;
                if (modalNewsletterMessage) modalNewsletterMessage.textContent = '';
            }
            try {
                parent.postMessage({ type: 'modalClose' }, '*');
            } catch (e) {
                console.error('Failed to postMessage modalClose:', e);
            }
        }
    }

    // --- NYTT: Scroll Trigger for Modal ---
    function checkScrollTrigger() {
        if (showRecommendationsView && !newsletterModalShownThisSession && recommendations.length > 0) {
            const recommendationsSection = document.getElementById('recommendations-section');
            if (recommendationsSection) {
                const rect = recommendationsSection.getBoundingClientRect();

                // Hvis bruker scroller forbi anbefalingene
                if (rect.bottom < window.innerHeight / 2 && !scrolledPastRecommendations) {
                    scrolledPastRecommendations = true;

                    // Avbryt eksisterende timers
                    if (teaserTimeout) clearTimeout(teaserTimeout);
                    if (modalTimeout) clearTimeout(modalTimeout);

                    // Vis modal direkte ved scroll
                    openNewsletterModal();
                    trackAdvisorEvent('newsletter_modal_triggered_by_scroll');
                }
            }
        }
    }

    // --- Oppdater Visning ---
    function updateView() {
        totalSteps = calculateTotalVisibleSteps();
        if (showRecommendationsView) {
            if (questionsSection) questionsSection.classList.add('hidden');
            if (recommendationsSection) recommendationsSection.classList.remove('hidden');
            if (contactEvoSection) { recommendations.length > 0 ? contactEvoSection.classList.remove('hidden') : contactEvoSection.classList.add('hidden'); }
        } else {
            if (BikeCatalog.evoOriginal && BikeCatalog.evoOriginal.length > 0) {
                if (questionsSection) questionsSection.classList.remove('hidden');
                if (initialLoader) initialLoader.classList.add('hidden');
            }
            if (recommendationsSection) recommendationsSection.classList.add('hidden');
            if (contactEvoSection) contactEvoSection.classList.add('hidden');

            const incentiveBanner = document.getElementById('incentive-banner');
            if (incentiveBanner) incentiveBanner.classList.add('hidden');
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
            if (recommendationsOutput) recommendationsOutput.classList.add('hidden');
            renderSelectionSummary();
            renderOptions();
            const currentVisible = calculateCurrentVisibleStep();
            if (backButton) backButton.classList.toggle('hidden', currentVisible <= 1 && currentStep <= 1);
        }
        updateProgress();
    }

    // --- Generer Anbefalinger (Oppdatert med ny timing-strategi) ---
    function generateAndShowRecommendations() {
        relaxedSearchPerformed = false;
        showRecommendationsView = true;
        scrolledPastRecommendations = false;

        if (questionsSection) questionsSection.classList.add('hidden');
        if (recommendationsSection) { recommendationsSection.classList.remove('hidden'); recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        if (recommendationsOutput) recommendationsOutput.classList.add('hidden');
        if (contactEvoSection) contactEvoSection.classList.add('hidden');

        const incentiveBanner = document.getElementById('incentive-banner');
        if (incentiveBanner) incentiveBanner.classList.add('hidden');
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');


        setTimeout(() => {
            const filterBikes = (relaxFrameType = false, relaxDistance = false, purposeOnly = false) => {
                let bikesToFilter = [...BikeCatalog.evoOriginal];
                if (selections.purpose && !purposeOnly) { bikesToFilter = bikesToFilter.filter(bike => bike.purpose && Array.isArray(bike.purpose) && bike.purpose.includes(selections.purpose)); }
                else if (purposeOnly && selections.purpose) { return bikesToFilter.filter(bike => bike.purpose && Array.isArray(bike.purpose) && bike.purpose.includes(selections.purpose)); }
                else if (purposeOnly && !selections.purpose) { return bikesToFilter; }
                if (!purposeOnly) {
                    if (selections.distance && !relaxDistance) { let minRange = 0; if (selections.distance === 'medium') minRange = 20; else if (selections.distance === 'lang') minRange = 50; bikesToFilter = bikesToFilter.filter(bike => bike.distance_km && Array.isArray(bike.distance_km) && bike.distance_km[1] >= minRange); }
                    if (selections.cargo) { let cargoLevels = []; if (selections.cargo === 'små') cargoLevels = ['small', 'medium', 'large', 'massive']; else if (selections.cargo === 'store') cargoLevels = ['medium', 'large', 'massive']; else if (selections.cargo === 'massiv') cargoLevels = ['large', 'massive']; bikesToFilter = bikesToFilter.filter(bike => bike.cargo_capacity && cargoLevels.includes(bike.cargo_capacity.toLowerCase())); }
                    if (selections.frameType && !relaxFrameType) {
                        let frameTypesToMatch = [];
                        if (selections.frameType === 'dypGjennomgang') {
                            frameTypesToMatch = ['low-step', 'cargo', 'cargo-longtail', 'mid-step'];
                        } else if (selections.frameType === 'høytTopprør') {
                            frameTypesToMatch = ['high-step'];
                        }
                        bikesToFilter = bikesToFilter.filter(bike => bike.frame_types && Array.isArray(bike.frame_types) && bike.frame_types.some(type => frameTypesToMatch.includes(type.toLowerCase())));
                    }
                    const cargoLocationStep = steps.find(s => s.id === 'cargoLocation'); const cargoLocationAsked = !cargoLocationStep || !cargoLocationStep.condition || cargoLocationStep.condition(); if (cargoLocationAsked && selections.purpose === 'transport' && selections.cargoLocation) { const locationToMatch = selections.cargoLocation === 'frontlaster' ? 'front' : 'rear'; bikesToFilter = bikesToFilter.filter(bike => bike.cargo_location && bike.cargo_location.toLowerCase() === locationToMatch); }
                }
                return bikesToFilter;
            };
            let potentialMatches = filterBikes();
            if (potentialMatches.length === 0) { potentialMatches = filterBikes(true, false); if (potentialMatches.length > 0) relaxedSearchPerformed = true; }
            if (potentialMatches.length === 0) { potentialMatches = filterBikes(false, false, true); if (potentialMatches.length > 0) relaxedSearchPerformed = true; }
            potentialMatches.sort((a, b) => {
                const inferChildNeed = selections.purpose === 'transport' || selections.cargo === 'massiv' || selections.cargo === 'store';
                const a_meets_child = (a.maxChildren && a.maxChildren > 0);
                const b_meets_child = (b.maxChildren && b.maxChildren > 0);
                if (inferChildNeed) {
                    if (a_meets_child && !b_meets_child) return -1;
                    if (!a_meets_child && b_meets_child) return 1;
                    if (a_meets_child && b_meets_child) {
                        return (b.maxChildren || 0) - (a.maxChildren || 0);
                    }
                }
                return (parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || Infinity) - (parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || Infinity);
            });

            let finalMatches = potentialMatches.slice(0, 3);
            if (finalMatches.length < 3) {
                const additional = BikeCatalog.evoOriginal
                    .filter(b => !finalMatches.includes(b))
                    .sort((a, b) => (parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || Infinity) - (parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || Infinity));
                if (additional.length > 0) {
                    relaxedSearchPerformed = true;
                }
                finalMatches = finalMatches.concat(additional.slice(0, 3 - finalMatches.length));
            }
            recommendations = finalMatches;
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
            renderRecommendations();
            if (recommendationsOutput) recommendationsOutput.classList.remove('hidden');

            // NYTT: Vis insentiv banner
            const incentiveBanner = document.getElementById('incentive-banner');
            if (incentiveBanner) {
                incentiveBanner.classList.remove('hidden');
            }

            if (contactEvoSection) { recommendations.length > 0 ? contactEvoSection.classList.remove('hidden') : contactEvoSection.classList.add('hidden'); }

            // NYTT: Implementer kombinert teaser + modal strategi
            if (recommendations.length > 0 && !newsletterModalShownThisSession && !teaserShownThisSession) {
                // 1. Vis teaser etter 2 sekunder
                teaserTimeout = setTimeout(() => {
                    showTeaser();

                    // 2. Hvis bruker ikke klikker på teaser, vis modal etter ytterligere 3 sekunder (5 sek totalt)
                    modalTimeout = setTimeout(() => {
                        if (!newsletterModalShownThisSession) {
                            openNewsletterModal();
                            trackAdvisorEvent('newsletter_modal_triggered_by_timer');
                        }
                    }, 3000);
                }, 2000);
            }
        }, 300);
    }

    // --- Event Handlers ---
    async function handleOptionSelect(stepId, value) {
        selections[stepId] = value;
        trackAdvisorEvent('option_selected', { step_id: stepId, selected_value: value, step_number: calculateCurrentVisibleStep() });

        // Visual feedback delay (let the user see the selection)
        await new Promise(r => setTimeout(r, 350));

        // Fade out
        if (questionsSection) questionsSection.classList.add('fade-out');

        // Wait for fade out
        await new Promise(r => setTimeout(r, 300));

        if (stepId === 'purpose' && value !== 'transport') { selections.cargoLocation = null; }
        currentStep++;
        let nextStepDef = steps[currentStep - 1];
        while (nextStepDef && nextStepDef.condition && !nextStepDef.condition()) {
            if (selections[nextStepDef.id] !== undefined) selections[nextStepDef.id] = null;
            currentStep++;
            nextStepDef = steps[currentStep - 1];
        }
        totalSteps = calculateTotalVisibleSteps();

        if (currentStep > steps.length) {
            trackAdvisorEvent('quiz_completed', selections);
            generateAndShowRecommendations();
        } else {
            updateView();
            // Fade in
            if (questionsSection) {
                // Force reflow
                void questionsSection.offsetWidth;
                questionsSection.classList.remove('fade-out');
            }
        }
    }

    function handleBack() {
        if (showRecommendationsView) {
            showRecommendationsView = false;
            let lastVisibleStepIndex = -1;
            for (let i = 0; i < steps.length; i++) {
                const stepDef = steps[i];
                if (!stepDef.condition || stepDef.condition()) {
                    lastVisibleStepIndex = i;
                }
            }
            currentStep = lastVisibleStepIndex + 1;
            trackAdvisorEvent('navigation_back_from_results', { to_step: currentStep });

            // Skjul teaser og modal ved tilbakenavigering
            hideTeaser();
            closeNewsletterModal();

            updateView();
        } else if (currentStep > 1) {
            const fromStepVisible = calculateCurrentVisibleStep();
            currentStep--;
            let prevStepDef = steps[currentStep - 1];
            while (currentStep > 1 && prevStepDef && prevStepDef.condition && !prevStepDef.condition()) {
                currentStep--;
                prevStepDef = steps[currentStep - 1];
            }
            trackAdvisorEvent('navigation_back', { from_step_visible: fromStepVisible, to_step_visible: calculateCurrentVisibleStep() });
            updateView();
        }
    }

    function resetAdvisor() {
        console.log('resetAdvisor called');
        trackAdvisorEvent('advisor_reset', { from_step: showRecommendationsView ? 'results' : calculateCurrentVisibleStep() });

        currentStep = 1;
        selections = { purpose: null, distance: null, cargo: null, frameType: null, cargoLocation: null };
        recommendations = [];
        showRecommendationsView = false;
        relaxedSearchPerformed = false;
        scrolledPastRecommendations = false;

        // Avbryt alle timers
        if (teaserTimeout) clearTimeout(teaserTimeout);
        if (modalTimeout) clearTimeout(modalTimeout);
        teaserTimeout = null;
        modalTimeout = null;

        // Skjul teaser og modal
        hideTeaser();
        closeNewsletterModal();

        // Reset teaser/modal states
        newsletterModalShownThisSession = false;
        teaserShownThisSession = false;

        if (contactEvoSection) contactEvoSection.classList.add('hidden');

        const incentiveBanner = document.getElementById('incentive-banner');
        if (incentiveBanner) incentiveBanner.classList.add('hidden');

        // Fjern fade-out class hvis den finnes
        if (questionsSection) questionsSection.classList.remove('fade-out');

        totalSteps = calculateTotalVisibleSteps();
        updateView();

        // Scroll til toppen av rådgiveren
        const container = document.getElementById('bike-advisor-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        console.log('Reset complete, currentStep:', currentStep, 'showRecommendationsView:', showRecommendationsView);
    }

    // --- Sporingsfunksjon ---
    function trackAdvisorEvent(eventName, eventParameters) {
        console.log(`TRACKING EVENT: ${eventName}`, eventParameters || {});
    }

    // --- Nyhetsbrev innsending med FormData (mode: 'no-cors') ---
    async function sendNewsletterDataWithFormData(navn, email, phone, recommendedBikes = []) {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.length < 60) {
            console.error("GAS_WEB_APP_URL er ikke korrekt satt for nyhetsbrev.");
            throw new Error("Konfigurasjonsfeil for innsending (GAS URL mangler).");
        }

        const mailchimpGroups = Array.isArray(recommendedBikes)
            ? recommendedBikes.map(bike => bike.name || bike.id || 'UkjentSykkelAnbefaling').filter(Boolean)
            : [];

        const formData = new FormData();
        formData.append('navn', navn);
        formData.append('email_address', email);
        if (phone) formData.append('phone', phone);

        const tagsForSheet = Array.isArray(recommendedBikes)
            ? recommendedBikes.map(b => b.name || b.id || 'UkjentSykkel').filter(Boolean)
            : [];
        tagsForSheet.push('bike advisor');
        formData.append('tags_for_logging', tagsForSheet.join(','));
        formData.append('mailchimp_groups_to_add', mailchimpGroups.join(','));

        try {
            await fetch(GAS_WEB_APP_URL, { method: "POST", mode: 'no-cors', body: formData });
            console.log("Nyhetsbrevdata (inkl. grupper) sendt (mode: 'no-cors'). Antar suksess på backend.");
            return { success: true, message: "Forespørsel sendt." };
        } catch (error) {
            console.error('Feil under sending av fetch-forespørsel (mode: no-cors):', error);
            throw new Error("Kunne ikke sende forespørsel. Sjekk nettverkstilkoblingen din.");
        }
    }

    async function submitNewsletterForm(e) {
        e.preventDefault();

        if (!modalNewsletterNameInput || !modalNewsletterEmailInput || !modalNewsletterConsentCheckbox || !modalNewsletterMessage || !modalNewsletterFormWrapper || !modalNewsletterThankyouWrapper) {
            console.error("Ett eller flere modal-nyhetsbrev-DOM-elementer mangler.");
            return;
        }

        const navn = modalNewsletterNameInput.value.trim();
        const email = modalNewsletterEmailInput.value.trim();
        const phone = modalNewsletterPhoneInput ? modalNewsletterPhoneInput.value.trim() : '';

        if (!navn) {
            modalNewsletterMessage.textContent = "Vennligst skriv inn navnet ditt.";
            modalNewsletterMessage.style.color = "#b71c1c";
            return;
        }
        if (!modalNewsletterConsentCheckbox.checked) {
            modalNewsletterMessage.textContent = "Du må godta vilkårene for å motta e-post.";
            modalNewsletterMessage.style.color = "#b71c1c";
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            modalNewsletterMessage.textContent = "Vennligst skriv inn en gyldig e-postadresse.";
            modalNewsletterMessage.style.color = "#b71c1c";
            return;
        }

        modalNewsletterMessage.textContent = "Sender...";
        modalNewsletterMessage.style.color = "#495057";
        const submitButton = modalNewsletterForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            await sendNewsletterDataWithFormData(navn, email, phone, recommendations);

            if (modalNewsletterFormWrapper) modalNewsletterFormWrapper.classList.add('hidden');
            if (modalNewsletterThankyouWrapper) {
                modalNewsletterThankyouWrapper.innerHTML = `
                    <h2>Takk, ${navn}!</h2>
                    <p>Du får straks anbefalingene dine tilsendt på e-post til ${email}.</p>
                    <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:48px; height:48px; color: #198754; margin-top: 15px; margin-bottom: 10px;">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.72 3.72-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" clip-rule="evenodd" />
                    </svg>
                    <p style="font-size: 0.9em; color: #6c757d;">Sjekk også søppelpostmappen din.</p>
                `;
                modalNewsletterThankyouWrapper.classList.remove('hidden');
            }
            if (modalNewsletterMessage) modalNewsletterMessage.textContent = "";

            if (typeof fbq === 'function') {
                fbq('track', 'Lead', {
                    content_name: 'Bike Advisor Newsletter',
                    email: email,
                    phone: phone,
                });
                console.log("Meta Pixel 'Lead' event trigget direkte fra koden.");
            }

            trackAdvisorEvent('newsletter_signup_success', { navn, email, phone, source: 'popup_modal' });
            try {
                window.parent.postMessage({
                    type: 'newsletter_signup_success',
                    navn: navn,
                    email: email,
                    phone: phone,
                    source: 'popup_modal'
                }, '*');
            } catch (e) {
                console.error('Kunne ikke sende postMessage til parent:', e);
            }
        } catch (err) {
            console.error("Innsending av nyhetsbrev fra modal feilet:", err);
            if (modalNewsletterMessage) {
                modalNewsletterMessage.textContent = err.message || "Noe gikk galt. Prøv igjen.";
                modalNewsletterMessage.style.color = "#b71c1c";
            }
            trackAdvisorEvent('newsletter_signup_failed', { navn, email, phone, source: 'popup_modal', error: err.message || String(err) });
            try {
                window.parent.postMessage({
                    type: 'newsletter_signup_failed',
                    navn: navn,
                    email: email,
                    phone: phone,
                    source: 'popup_modal',
                    error: err.message || String(err)
                }, '*');
            } catch (e) {
                console.error('Kunne ikke sende postMessage error til parent:', e);
            }
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    }

    // --- Event Listeners ---
    if (modalNewsletterForm) {
        modalNewsletterForm.addEventListener("submit", submitNewsletterForm);
    }
    if (closeNewsletterModalBtn) closeNewsletterModalBtn.addEventListener('click', closeNewsletterModal);
    if (newsletterPopupModal) {
        newsletterPopupModal.addEventListener('click', function (event) {
            if (event.target === newsletterPopupModal) closeNewsletterModal();
        });
    }
    if (openNewsletterPopupBtn) {
        openNewsletterPopupBtn.addEventListener('click', () => {
            // Avbryt eksisterende timers
            if (teaserTimeout) clearTimeout(teaserTimeout);
            if (modalTimeout) clearTimeout(modalTimeout);

            newsletterModalShownThisSession = false;
            openNewsletterModal();
            trackAdvisorEvent('newsletter_modal_opened_manually');
        });
    }

    // NYTT: Teaser Event Listeners
    if (teaserCtaBtn) {
        teaserCtaBtn.addEventListener('click', () => {
            // Avbryt modal timer når bruker klikker på teaser
            if (modalTimeout) clearTimeout(modalTimeout);

            openNewsletterModal();
            trackAdvisorEvent('newsletter_modal_opened_via_teaser');
        });
    }

    if (teaserCloseBtn) {
        teaserCloseBtn.addEventListener('click', () => {
            hideTeaser();
            trackAdvisorEvent('newsletter_teaser_closed');

            // Når bruker lukker teaser, vent litt lengre før modal vises (3 sek ekstra)
            if (modalTimeout) clearTimeout(modalTimeout);
            modalTimeout = setTimeout(() => {
                if (!newsletterModalShownThisSession) {
                    openNewsletterModal();
                    trackAdvisorEvent('newsletter_modal_triggered_after_teaser_close');
                }
            }, 3000);
        });
    }

    // NYTT: Legg til scroll listener
    window.addEventListener('scroll', checkScrollTrigger);

    // --- Initialisering ---
    async function initializeAdvisor() {
        const catalogLoaded = await fetchBikeCatalog();
        totalSteps = calculateTotalVisibleSteps();

        const backButton = document.getElementById('back-button');
        const resetButtonStep = document.getElementById('reset-button-step');
        const resetButtonFinal = document.getElementById('reset-button-final');

        console.log('Reset buttons found:', {
            backButton: !!backButton,
            resetButtonStep: !!resetButtonStep,
            resetButtonFinal: !!resetButtonFinal
        });

        if (backButton) backButton.addEventListener('click', handleBack);
        if (resetButtonStep) resetButtonStep.addEventListener('click', resetAdvisor);
        if (resetButtonFinal) {
            resetButtonFinal.addEventListener('click', resetAdvisor);
            console.log('Reset button final event listener attached');
        }

        if (catalogLoaded && BikeCatalog.evoOriginal.length > 0) {
            trackAdvisorEvent('advisor_ui_ready');
        }
        updateView();
    }

    initializeAdvisor();
});
