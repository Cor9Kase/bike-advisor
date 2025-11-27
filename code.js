// Google Apps Script for Evo Elsykkel Rådgiver
// Versjon 3.4: Inkluderer funksjon for å SKRIVE priser tilbake til Google Sheet.

// --- Globale Konstanter ---
const SYKKEL_SHEET_ID = "1xQLtzq6gl32aIl1kUsGJQTj0bOwwrCMxTJN40MCBMe0"; // ID for regnearket med sykkeldata
const MAILCHIMP_SHEET_ID = "1rSiITXV7M9UPblTM-SsVHaIVa6jM6IDJ55A7ckJz2_s"; // ID for Mailchimp-håndtering
const SYKKEL_SHEET_NAME = 'sykler'; // Navnet på arket med sykkeldata
const CHANNABLE_FEED_URL = "https://files.channable.com/mxOTTrygE_kiOWcjanHKIQ==.xml"; // URL til produktfeed

/**
 * Hovedfunksjon for å oppdatere priser i selve Google Sheetet.
 * Denne bør kjøres manuelt eller settes opp med en tidsstyrt trigger (f.eks. hver natt).
 */
function updateSheetPrices() {
  const spreadsheet = SpreadsheetApp.openById(SYKKEL_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SYKKEL_SHEET_NAME);

  if (!sheet) {
    Logger.log("Fant ikke arket 'sykler'.");
    return;
  }

  // 1. Hent alle data fra feeden
  const feedPrices = getFeedPrices(false); // false = ikke bruk cache, hent fersk data
  if (!feedPrices) {
    Logger.log("Kunne ikke hente feed-data. Avbryter.");
    return;
  }

  // 2. Les hele arket
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  // Henter URL (Kolonne C = indeks 2) og Pris (Kolonne G = indeks 6)
  // Vi leser hele området for å være effektive
  const range = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  const values = range.getValues();

  const updates = []; // Lagrer oppdateringer her: {row: 1, col: 7, value: "..."}
  let updateCount = 0;

  // 3. Gå gjennom hver rad
  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const productUrl = String(row[2] || '').trim(); // Kolonne C
    const currentPrice = String(row[6] || '').trim(); // Kolonne G

    if (!productUrl) continue;

    // Normaliser URL for matching
    const normalizedUrl = productUrl.split('?')[0].replace(/\/$/, "").toLowerCase();

    if (feedPrices[normalizedUrl]) {
      const feedData = feedPrices[normalizedUrl];
      const newPriceString = feedData.finalPriceString; // Eks: "KR 69.000"

      // Sjekk om prisen faktisk er annerledes (ignorerer små formatforskjeller hvis vi vil, men her sjekker vi streng likhet)
      // Vi normaliserer begge strengene litt for å unngå unødvendige oppdateringer (f.eks mellomrom)
      if (currentPrice.replace(/\s/g, '') !== newPriceString.replace(/\s/g, '')) {
        // Oppdater kolonne G (indeks 7 i sheet, 1-basert)
        // i er 0-basert fra data-arrayet, så radnummeret i sheet er i + 2
        sheet.getRange(i + 2, 7).setValue(newPriceString);
        updateCount++;
        Logger.log(`Oppdaterer rad ${i + 2}: ${productUrl} -> ${newPriceString} (Var: ${currentPrice})`);
      }
    }
  }

  Logger.log(`Ferdig! Oppdaterte ${updateCount} priser.`);
  return `Oppdaterte ${updateCount} priser.`;
}

/**
 * Håndterer GET-forespørsler.
 * Nå som vi oppdaterer arket direkte, kan doGet lese rett fra arket.
 * Men vi beholder "live-fletting" som en sikkerhet i tilfelle arket ikke er oppdatert nylig.
 */
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'ping') {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: "Ping mottatt av doGet", timestamp: new Date().toISOString() }))
        .setMimeType(ContentService.MimeType.JSON)
        .withHeaders({ 'Access-Control-Allow-Origin': '*' });
    }

    const spreadsheet = SpreadsheetApp.openById(SYKKEL_SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SYKKEL_SHEET_NAME);

    if (!sheet) {
      throw new Error(`Sheet med navnet "${SYKKEL_SHEET_NAME}" ble ikke funnet i spreadsheet med ID ${SYKKEL_SHEET_ID}.`);
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    const dataRows = dataRange.getValues();

    // Vi henter feed-priser for å sikre at frontend ALLTID viser ferskeste pris,
    // selv om updateSheetPrices() ikke har kjørt ennå.
    const feedPrices = getFeedPrices(true); // true = bruk cache

    const bikes = dataRows.map(row => {
      const id = String(row[0] || '').trim();
      const productUrl = String(row[2] || '').trim();
      const normalizedUrl = productUrl.split('?')[0].replace(/\/$/, "").toLowerCase();

      let price = String(row[6] || '').trim();
      let originalPrice = "";

      // Live-override fra feed hvis tilgjengelig
      if (normalizedUrl && feedPrices && feedPrices[normalizedUrl]) {
        price = feedPrices[normalizedUrl].finalPriceString;
      }

      return {
        id: id,
        name: String(row[1] || '').trim(),
        productUrl: productUrl,
        purpose: (String(row[3] || '').trim()).split(',').map(item => item.trim()).filter(item => item),
        description: String(row[4] || '').trim(),
        features: (String(row[5] || '').trim()).split(';').map(item => item.trim()).filter(item => item),
        price: price,
        originalPrice: originalPrice,
        frame_types: (String(row[7] || '').trim()).split(',').map(item => item.trim()).filter(item => item),
        speed_kmh: (row[8] !== "" && !isNaN(row[8])) ? parseInt(row[8], 10) : 25,
        cargo_capacity: String(row[9] || '').trim().toLowerCase(),
        cargo_location: String(row[10] || '').trim().toLowerCase(),
        distance_km: (() => {
          const str = String(row[11] || '').trim().replace(/km/gi, '');
          const parts = str.split('-');
          if (parts.length === 2) return [parseInt(parts[0].trim(), 10) || 0, parseInt(parts[1].trim(), 10) || 0];
          if (parts.length === 1 && parts[0]) { const s = parseInt(parts[0].trim(), 10) || 0; return [s > 20 ? s - 20 : 0, s]; }
          return [0, 0];
        })(),
        maxChildren: (row[12] !== "" && !isNaN(row[12])) ? parseInt(row[12], 10) : 0,
        image: String(row[13] || '').trim(),
        preOrdered: row.length > 14 && row[14] !== "" ? (String(row[14]).toLowerCase() === 'true' || String(row[14]) === '1') : false,
      };
    }).filter(bike => bike.id);

    return ContentService.createTextOutput(JSON.stringify(bikes)).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error in doGet: ${error.message}\nStack: ${error.stack}`);
    return ContentService
      .createTextOutput(JSON.stringify({ error: true, message: `Feil i doGet: ${error.message}`, stack: error.stack }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Hjelpefunksjon for å hente og parse XML-feeden.
 * @param {boolean} useCache - Om vi skal bruke cache eller tvinge ny henting.
 */
function getFeedPrices(useCache = true) {
  const cache = CacheService.getScriptCache();
  const cached = useCache ? cache.get("feed_prices_url_v1") : null;

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = UrlFetchApp.fetch(CHANNABLE_FEED_URL);
    const xml = response.getContentText();
    const document = XmlService.parse(xml);
    const root = document.getRootElement();
    const channel = root.getChild("channel");
    const items = channel.getChildren("item");

    const ns = XmlService.getNamespace("g", "http://base.google.com/ns/1.0");

    const urlMap = {};

    items.forEach(item => {
      const linkElement = item.getChild("link");
      const priceElement = item.getChild("price", ns);
      const salePriceElement = item.getChild("sale_price", ns);

      if (linkElement && priceElement) {
        let url = linkElement.getText().trim();
        url = url.split('?')[0].replace(/\/$/, "").toLowerCase();

        const priceRaw = priceElement.getText();
        const salePriceRaw = salePriceElement ? salePriceElement.getText() : null;

        const cleanPrice = parseFloat(priceRaw.replace(/[^0-9.]/g, ""));
        const cleanSalePrice = salePriceRaw ? parseFloat(salePriceRaw.replace(/[^0-9.]/g, "")) : null;

        const currentEffectivePrice = cleanSalePrice || cleanPrice;

        if (!urlMap[url] || currentEffectivePrice < urlMap[url].effectivePrice) {
          const formattedPrice = currentEffectivePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          const finalPriceString = `KR ${formattedPrice}`;

          urlMap[url] = {
            price: cleanPrice,
            sale_price: cleanSalePrice,
            effectivePrice: currentEffectivePrice,
            finalPriceString: finalPriceString
          };
        }
      }
    });

    // Cache i 15 minutter
    cache.put("feed_prices_url_v1", JSON.stringify(urlMap), 900);
    return urlMap;

  } catch (e) {
    Logger.log("Feil ved henting av feed: " + e.message);
    return null;
  }
}

/**
 * Håndterer POST-forespørsler. Forventer FormData.
 */
function doPost(e) {
  const allowedOrigin = 'https://cor9kase.github.io';

  try {
    if (!e || !e.parameter) {
      throw new Error("Ingen parametere mottatt i POST-forespørsel.");
    }

    const navn = e.parameter.navn || "";
    const email = e.parameter.email_address;
    const telefon = e.parameter.telefon || "";
    const tagsForLogging = e.parameter.tags_for_logging || "";
    const mailchimpGroupsString = e.parameter.mailchimp_groups_to_add || "";

    if (!email) {
      throw new Error("E-postadresse mangler i forespørselen (e.parameter).");
    }

    const spreadsheet = SpreadsheetApp.openById(MAILCHIMP_SHEET_ID);
    const sheet = spreadsheet.getSheets()[0];

    if (!sheet) {
      throw new Error(`Klarte ikke å finne det første arket i regnearket med ID ${MAILCHIMP_SHEET_ID}.`);
    }

    const timestamp = new Date();
    const status = "subscribed_via_rådgiver_formdata_v3";

    sheet.appendRow([timestamp, navn, email, telefon, tagsForLogging, mailchimpGroupsString, status]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Påmeldingsdata lagret vellykket." }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({ 'Access-Control-Allow-Origin': allowedOrigin });

  } catch (error) {
    Logger.log(`Error in doPost: ${error.message}\nStack: ${error.stack}`);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: true, message: `Feil i doPost: ${error.message}`, stack: error.stack }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({ 'Access-Control-Allow-Origin': allowedOrigin });
  }
}

function doOptions(e) {
  const allowedOrigin = 'https://cor9kase.github.io';
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .withHeaders({
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
}

// --- Testfunksjoner ---

function testBikeDataOutput() {
  try {
    Logger.log("Tester doGet for sykkeldata...");
    const response = doGet({ parameter: {} });
    if (response) {
      const parsedResponse = JSON.parse(response.getContent());
      if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
        Logger.log(`Hentet ${parsedResponse.length} sykler. Første sykkel: ${JSON.stringify(parsedResponse[0])}`);
      } else {
        Logger.log("Sykkelkatalogen er tom eller feilet.");
      }
    }
  } catch (err) {
    Logger.log(`Feil: ${err.message}`);
  }
}

function testFeedFetch() {
  const prices = getFeedPrices(false);
  if (prices) {
    Logger.log("Suksess! Hentet priser. Eksempel:");
    const keys = Object.keys(prices).slice(0, 3);
    keys.forEach(k => Logger.log(`${k}: ${JSON.stringify(prices[k])}`));
  } else {
    Logger.log("Feilet å hente priser.");
  }
}
