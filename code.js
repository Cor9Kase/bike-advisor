// Google Apps Script for å hente sykkeldata fra et regneark
// Gå til Extensions > Apps Script i ditt Google Sheet for å lime inn denne koden.

// Global konstant for å enkelt endre arknavn om nødvendig
const SHEET_ID = ""; // <--- Sjekk at denne stemmer!
const SHEET_NAME = 'sykler'; // << VIKTIG: ENDRE DETTE HVIS ARKET DITT HETER NOE ANNET

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet med navnet "${SHEET_NAME}" ble ikke funnet.`);
    }

    // Hent alle data fra rad 2 og nedover (antar at rad 1 er overskrifter)
    // sheet.getLastColumn() henter antall kolonner med data.
    // sheet.getLastRow() - 1 henter antall rader med data (ekskluderer overskriftsraden).
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    const dataRows = dataRange.getValues();

    const bikes = dataRows.map(row => {
      // Mapper kolonneindekser til mer lesbare variabler
      // Dette er basert på skjermbildet ditt. Juster hvis kolonnerekkefølgen er annerledes.
      const id = String(row[0]).trim(); // Kolonne A
      const name = String(row[1]).trim(); // Kolonne B
      const productUrl = String(row[2]).trim(); // Kolonne C
      const purposeString = String(row[3]).trim(); // Kolonne D
      const description = String(row[4]).trim(); // Kolonne E
      const featuresString = String(row[5]).trim(); // Kolonne F
      const price = String(row[6]).trim(); // Kolonne G
      const frameTypesString = String(row[7]).trim(); // Kolonne H
      const speedKmh = row[8] !== "" ? parseInt(row[8], 10) : 25; // Kolonne I
      const cargoCapacity = String(row[9]).trim().toLowerCase(); // Kolonne J
      const cargoLocation = String(row[10]).trim().toLowerCase(); // Kolonne K
      const distanceKmString = String(row[11]).trim(); // Kolonne L
      const maxChildren = row[12] !== "" ? parseInt(row[12], 10) : 0; // Kolonne M
      const image = String(row[13]).trim(); // Kolonne N
      
      // Anta en 'preOrdered' kolonne (f.eks. kolonne O, indeks 14)
      // Hvis den ikke finnes, sett en default eller fjern linjen.
      const preOrdered = row.length > 14 && row[14] !== "" ? (String(row[14]).toLowerCase() === 'true' || String(row[14]) === '1') : false; // Kolonne O (antatt)

      // Konverter strenger til arrays
      const purpose = purposeString ? purposeString.split(',').map(item => item.trim()).filter(item => item) : [];
      const features = featuresString ? featuresString.split(';').map(item => item.trim()).filter(item => item) : [];
      const frame_types = frameTypesString ? frameTypesString.split(',').map(item => item.trim()).filter(item => item) : [];

      // Konverter rekkevidde "40-80 km" til [40, 80]
      let distance_km = [0, 0];
      if (distanceKmString) {
        const parts = distanceKmString.replace('km', '').trim().split('-');
        if (parts.length === 2) {
          distance_km = [parseInt(parts[0].trim(), 10) || 0, parseInt(parts[1].trim(), 10) || 0];
        } else if (parts.length === 1 && parts[0]) { // Håndterer enkelverdi (f.eks. "80 km") som maks
          const singleVal = parseInt(parts[0].trim(), 10) || 0;
          distance_km = [singleVal > 20 ? singleVal - 20 : 0, singleVal]; // Enkel gjetning for min-verdi
        }
      }
      
      // Returner sykkelobjektet i det formatet frontend forventer
      return {
        id: id,
        name: name,
        purpose: purpose,
        description: description,
        features: features,
        price: price,
        image: image,
        productUrl: productUrl,
        frame_types: frame_types,
        speed_kmh: speedKmh,
        cargo_capacity: cargoCapacity,
        cargo_location: cargoLocation,
        distance_km: distance_km,
        maxChildren: maxChildren,
        preOrdered: preOrdered
      };
    }).filter(bike => bike.id); // Filtrer bort rader uten ID (tomme rader)

    return ContentService
      .createTextOutput(JSON.stringify(bikes))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error in doGet: ${error.message}\nStack: ${error.stack}`);
    // Returner en feilmelding i JSON-format for enklere feilsøking på klientsiden
    return ContentService
      .createTextOutput(JSON.stringify({ error: true, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Funksjon for å teste output i Apps Script-loggen (valgfritt)
function testBikeDataOutput() {
  const result = doGet(null); // Send null for 'e' siden den ikke brukes i test
  Logger.log(result.getContent());
}
