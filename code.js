// Google Apps Script for Evo Elsykkel Rådgiver
// Henter sykkeldata og lagrer nyhetsbrevpåmeldinger til Google Sheet.

// --- Globale Konstanter ---
const SHEET_ID = "1xQLtzq6gl32aIl1kUsGJQTj0bOwwrCMxTJN40MCBMe0"; // <--- VIKTIG: Erstatt med din Spreadsheet ID!
const SYKKEL_SHEET_NAME = 'sykler'; // Navnet på arket med sykkeldata
const MAILCHIMP_SHEET_NAME = 'MailchimpPåmeldinger'; // Navnet på arket for påmeldinger

/**
 * Håndterer GET-forespørsler, primært for å hente sykkelkatalogen.
 */
function doGet(e) {
  try {
    // Hvis action=ping (brukt i testConnection i script (8).js), returner enkel respons
    if (e && e.parameter && e.parameter.action === 'ping') {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: "Ping mottatt av doGet", timestamp: new Date().toISOString() }))
        .setMimeType(ContentService.MimeType.JSON)
        .withHeaders({'Access-Control-Allow-Origin': '*'}); // Tillat alle for enkel ping
    }

    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SYKKEL_SHEET_NAME);

    if (!sheet) {
      throw new Error(`Sheet med navnet "${SYKKEL_SHEET_NAME}" ble ikke funnet i spreadsheet med ID ${SHEET_ID}.`);
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    const dataRows = dataRange.getValues();

    const bikes = dataRows.map(row => ({
      id: String(row[0] || '').trim(),
      name: String(row[1] || '').trim(),
      productUrl: String(row[2] || '').trim(),
      purpose: (String(row[3] || '').trim()).split(',').map(item => item.trim()).filter(item => item),
      description: String(row[4] || '').trim(),
      features: (String(row[5] || '').trim()).split(';').map(item => item.trim()).filter(item => item),
      price: String(row[6] || '').trim(),
      frame_types: (String(row[7] || '').trim()).split(',').map(item => item.trim()).filter(item => item),
      speed_kmh: (row[8] !== "" && !isNaN(row[8])) ? parseInt(row[8], 10) : 25,
      cargo_capacity: String(row[9] || '').trim().toLowerCase(),
      cargo_location: String(row[10] || '').trim().toLowerCase(),
      distance_km: (() => {
        const str = String(row[11] || '').trim().replace(/km/gi, '');
        const parts = str.split('-');
        if (parts.length === 2) return [parseInt(parts[0].trim(), 10) || 0, parseInt(parts[1].trim(), 10) || 0];
        if (parts.length === 1 && parts[0]) { const s = parseInt(parts[0].trim(), 10) || 0; return [s > 20 ? s - 20 : 0, s];}
        return [0,0];
      })(),
      maxChildren: (row[12] !== "" && !isNaN(row[12])) ? parseInt(row[12], 10) : 0,
      image: String(row[13] || '').trim(),
      preOrdered: row.length > 14 && row[14] !== "" ? (String(row[14]).toLowerCase() === 'true' || String(row[14]) === '1') : false,
    })).filter(bike => bike.id);

    return ContentService.createTextOutput(JSON.stringify(bikes)).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error in doGet: ${error.message}\nStack: ${error.stack}`);
    return ContentService
      .createTextOutput(JSON.stringify({ error: true, message: `Feil i doGet: ${error.message}`, stack: error.stack }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Håndterer POST-forespørsler. Forventer FormData.
 */
function doPost(e) {
  // Bestem origin basert på e.origin eller en fallback hvis det er nødvendig
  // For nå, bruker vi den spesifikke origin du har eller '*'
  const allowedOrigin = 'https://cor9kase.github.io'; // Eller '*' hvis du vil være mindre restriktiv

  try {
    if (!e || !e.parameter) {
      throw new Error("Ingen parametere mottatt i POST-forespørsel.");
    }

    // Sjekk for en 'action' parameter for å rute forespørselen hvis nødvendig
    // const action = e.parameter.action;
    // if (action === 'saveNewsletter') { // Eller en annen handling
    // }

    // Forventer spesifikt nyhetsbrevdata basert på FormData fra frontend
    const navn = e.parameter.navn || "";
    const email = e.parameter.email_address;
    const tagsString = e.parameter.tags || ""; // Mottas som en kommaseparert streng

    if (!email) {
      throw new Error("E-postadresse mangler i forespørselen (e.parameter).");
    }

    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(MAILCHIMP_SHEET_NAME);

    if (!sheet) {
      throw new Error(`Sheet med navnet "${MAILCHIMP_SHEET_NAME}" ble ikke funnet.`);
    }

    const timestamp = new Date();
    const status = "subscribed_via_rådgiver_formdata";

    sheet.appendRow([timestamp, navn, email, tagsString, status]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Påmeldingsdata (FormData) lagret vellykket." }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({ 'Access-Control-Allow-Origin': allowedOrigin });

  } catch (error) {
    Logger.log(`Error in doPost (FormData): ${error.message}\nStack: ${error.stack}`);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: true, message: `Feil i doPost (FormData): ${error.message}`, stack: error.stack }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({ 'Access-Control-Allow-Origin': allowedOrigin });
  }
}

/**
 * Håndterer OPTIONS pre-flight forespørsler for CORS.
 */
function doOptions(e) {
  const allowedOrigin = 'https://cor9kase.github.io'; // Må matche det du bruker i doPost/doGet
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .withHeaders({
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Legg til Authorization hvis du planlegger å bruke det
    });
}

// --- Valgfrie Testfunksjoner ---
function testBikeDataOutput() { /* ... (som før) ... */ }
function testNewsletterSignupFormData() {
  try {
    Logger.log("Tester doPost for nyhetsbrev med FormData-stil parametere...");
    const mockEvent = {
      parameter: { // Simulere e.parameter
        navn: "Test FormData Bruker",
        email_address: "test.formdata@example.com",
        tags: "SykkelX,SykkelY" // Sendes som streng
      }
      // postData feltet ville vært annerledes for FormData, så vi tester parameter direkte
    };
    const response = doPost(mockEvent);
    if (response) {
      Logger.log(`Resultat fra doPost (getContent): ${response.getContent()}`);
      const parsedResponse = JSON.parse(response.getContent());
      if (parsedResponse.error) {
        Logger.log(`Feil i testNewsletterSignupFormData (doPost): ${parsedResponse.message}`);
      } else {
        Logger.log("Påmelding (FormData-stil) ser ut til å ha gått bra ifølge responsen.");
      }
    } else {
       Logger.log("doPost returnerte null eller undefined under FormData test.");
    }
  } catch (err) {
    Logger.log(`Feil under kjøring av testNewsletterSignupFormData: ${err.message}\nStack: ${err.stack}`);
  }
}
