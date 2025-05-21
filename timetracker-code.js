// code.gs (Fullstendig med Automatisk Gjentakende Oppgaver og Planlagte Tider)

// --- Konfigurasjon ---
const SHEET_ID = "19TTiGD3ZBXKGA2Kj3YCX33UAFU01Rqi-i4kRVYYlbkk"; // <--- VIKTIG: Sjekk at denne stemmer!

const CUSTOMER_SHEET_BASE = "Kunder";
const LOG_SHEET_BASE = "Tidslogg";
const TASK_SHEET_BASE = "Oppgaver";

const USER_EMAILS = {
  C: "cornelius.test@example.com", // <-- BYTT UT
  W: "william.test@example.com"  // <-- BYTT UT
};

// Kolonneindekser for Kunder-arket
const CUST_MONTH_COL = 1;
const CUST_NAME_COL = 2;
const CUST_ALLOC_COL = 3;
const CUST_REMAIN_COL = 4;

// Kolonneindekser for Tidslogg-arket
const LOG_DATE_COL = 1;
const LOG_CUSTOMER_COL = 2;
const LOG_SPENT_COL = 3;
const LOG_SOLD_COL = 4;
const LOG_REMAINING_COL = 5;
const LOG_COMMENT_COL = 6;
const LOG_TASKID_COL = 7;

// Kolonneindekser for Oppgaver-arket (utvidet)
const TASK_ID_COL = 1;                      // A: OppgaveID
const TASK_CUSTOMER_COL = 2;                // B: Kundenavn
const TASK_NAME_COL = 3;                    // C: Oppgavenavn
const TASK_STATUS_COL = 4;                  // D: Status
const TASK_PRIORITY_COL = 5;                // E: Prioritet
const TASK_DUEDATE_COL = 6;                 // F: Frist (eller startdato for gjentakende)
const TASK_DESC_COL = 7;                    // G: Beskrivelse
const TASK_CREATED_COL = 8;                 // H: OpprettetDato
const TASK_COMPLETED_COL = 9;               // I: FerdigDato
const TASK_ESTIMATED_TIME_COL = 10;         // J: Estimert Tid
const TASK_ENDDATE_COL = 11;                // K: Sluttdato (Valgfri, for selve oppgaven)
const TASK_ASSIGNED_COL = 12;               // L: Tildelt (TRUE/FALSE - satt av manager)
const TASK_RECURRENCE_RULE_COL = 13;        // M: Gjentakelsesregel (Aldri, Daglig, Ukentlig, Månedlig)
const TASK_RECURRENCE_END_DATE_COL = 14;    // N: Gjentakelse Sluttdato
const TASK_NEXT_DUE_DATE_COL = 15;          // O: NesteFrist (for automatisk generering)
const TASK_IS_RECURRING_MASTER_COL = 16;    // P: ErMasterGjentakelse (TRUE/FALSE)
const TASK_PARENT_TASK_ID_COL = 17;         // Q: ParentTaskID (for genererte instanser)
const TASK_SCHEDULED_START_COL = 18;        // R: PlanlagtStart (NY)
const TASK_SCHEDULED_END_COL = 19;          // S: PlanlagtSlutt (NY)


function getUserSpecificSheetName(baseName, userSuffix) {
  if (!userSuffix || (userSuffix.toUpperCase() !== 'C' && userSuffix.toUpperCase() !== 'W')) {
    throw new Error("Ugyldig eller manglende brukeridentifikator (forventet 'C' eller 'W').");
  }
  return `${baseName}-${userSuffix.toUpperCase()}`;
}

function doGet(e) { 
 try {
   const params = (e && e.parameter) ? e.parameter : {};
   const action = params.action;
   const callback = params.callback;
   const userSuffix = params.user; 

   Logger.log(`doGet: Action=${action}, User=${userSuffix}, Params=${JSON.stringify(params)}`);

   if (!action) throw new Error("Mangler 'action' parameter.");
   
   switch (action) {
     case "getCustomers":
       if (!userSuffix) throw new Error("Mangler 'user' parameter for getCustomers.");
       return handleGetCustomers(params, userSuffix);
     case "getCustomerTotalsForMonth":
       if (!userSuffix) throw new Error("Mangler 'user' parameter for getCustomerTotalsForMonth.");
       return handleGetCustomerTotalsForMonth(params, userSuffix);
     case "getTimeLog":
       if (!userSuffix) throw new Error("Mangler 'user' parameter for getTimeLog.");
       return handleGetTimeLog(params, userSuffix);
     case "getTasks":
       if (!userSuffix) throw new Error("Mangler 'user' parameter for getTasks.");
       return handleGetTasks(params, userSuffix); // Oppdatert for å hente nye felter
     case "ping":
       return createJsonResponse({ success: true, message: "Pong! Skar timetracker backend er live.", timestamp: new Date().toISOString() }, callback);
     default:
        Logger.log("Ukjent GET action: " + action);
        return createJsonResponse({ success: false, message: "Ukjent GET action: " + action }, callback);
   }
 } catch (error) {
    Logger.log("FEIL i doGet: " + error + "\nStack: " + error.stack);
    const cb = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;
    return createJsonResponse({ success: false, message: "Serverfeil (doGet): " + error.message }, cb);
  }
}
function doPost(e) { 
 try {
   const params = (e && e.parameter) ? e.parameter : {};
   const action = params.action;
   const userSuffix = params.user; 

   Logger.log(`doPost: Action=${action}, User=${userSuffix}, Params=${JSON.stringify(params)}`);

   if (!action) throw new Error("Mangler 'action' parameter.");
   if (!userSuffix && action !== "ping") { 
       throw new Error(`Mangler 'user' parameter for action '${action}'.`);
   }

   switch (action) {
     case "logTime":
       return handleLogTime(params, userSuffix);
     case "addCustomer":
       return handleAddCustomer(params, userSuffix);
     case "updateCustomer":
       return handleUpdateCustomer(params, userSuffix);
     case "deleteCustomer":
       return handleDeleteCustomer(params, userSuffix);
     case "addTask": 
       return handleAddTask(params, userSuffix); // Oppdatert for å initialisere nye felter
     case "updateTask":
       return handleUpdateTask(params, userSuffix); // Oppdatert for å lagre nye felter
     case "deleteTask": // Antar du har denne, eller legger den til hvis ikke
       return handleDeleteTask(params, userSuffix);
     default:
        Logger.log("Ukjent POST action: " + action);
        return createJsonResponse({ success: false, message: "Ukjent POST action: " + action });
   }
 } catch (error) {
    Logger.log("FEIL i doPost: " + error + "\nStack: " + error.stack);
    return createJsonResponse({ success: false, message: "Serverfeil (doPost): " + error.message });
  }
}
function createJsonResponse(data, callback = null) { 
 const jsonString = JSON.stringify(data);
 let response;
 if (callback) {
   response = ContentService.createTextOutput(`${callback}(${jsonString})`).setMimeType(ContentService.MimeType.JAVASCRIPT);
 } else {
   response = ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
 }
 return response;
}
function findCustomerRowForMonth(sheet, customerName, monthYear) { 
 if (!customerName || !monthYear) return -1;
 const nameToFind = customerName.trim().toLowerCase();
 const lastRow = sheet.getLastRow();
 if (lastRow < 2) return -1; 
 const dataRange = sheet.getRange(2, CUST_MONTH_COL, lastRow - 1, CUST_NAME_COL - CUST_MONTH_COL + 1);
 const data = dataRange.getValues();
 for (let i = 0; i < data.length; i++) {
   const rowMonthValue = data[i][0]; 
   const rowNameValue = data[i][CUST_NAME_COL - CUST_MONTH_COL];   
   const rowMonth = rowMonthValue ? rowMonthValue.toString().trim() : "";
   const rowName = rowNameValue ? rowNameValue.toString().trim().toLowerCase() : "";
   if (rowMonth === monthYear && rowName === nameToFind) {
     return i + 2; 
   }
 }
 return -1; 
}

function handleGetCustomers(params, userSuffix) { 
  try {
    const customerSheetName = getUserSpecificSheetName(CUSTOMER_SHEET_BASE, userSuffix);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(customerSheetName);
    if (!sheet) throw new Error(`Fant ikke arket: ${customerSheetName}`);
    const spreadsheetTimezone = ss.getSpreadsheetTimeZone();
    const currentMonthYear = Utilities.formatDate(new Date(), spreadsheetTimezone, "yyyy-MM");
    Logger.log(`handleGetCustomers (${userSuffix}): Henter kunder for måned ${currentMonthYear} fra ark ${customerSheetName}`);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return createJsonResponse({ success: true, customers: [] }, params.callback);
    }
    const range = sheet.getRange(2, CUST_MONTH_COL, lastRow - 1, CUST_REMAIN_COL - CUST_MONTH_COL + 1);
    const values = range.getValues();
    const customersForMonth = [];
    for (let i = 0; i < values.length; i++) {
        const row = values[i];
        const rawMonthValue = row[CUST_MONTH_COL - CUST_MONTH_COL];
        let rowMonth = "";
        if (rawMonthValue instanceof Date && !isNaN(rawMonthValue.getTime())) {
            rowMonth = Utilities.formatDate(rawMonthValue, spreadsheetTimezone, "yyyy-MM");
        } else if (rawMonthValue) {
            rowMonth = rawMonthValue.toString().trim();
            if (!/^\d{4}-\d{2}$/.test(rowMonth)) {
                Logger.log(` (${userSuffix}) ADVARSEL: Måned '${rowMonth}' på rad ${i+2} har uventet format.`);
            }
        } else {
            continue;
        }
        if (rowMonth === currentMonthYear) {
            const name = row[CUST_NAME_COL - CUST_MONTH_COL];
            let allocated = parseFloat(row[CUST_ALLOC_COL - CUST_MONTH_COL]);
            let remaining = parseFloat(row[CUST_REMAIN_COL - CUST_MONTH_COL]);
            if (isNaN(allocated)) allocated = 0;
            if (isNaN(remaining)) remaining = 0;
            if (name && name.toString().trim()) {
                customersForMonth.push({
                    name: name.toString().trim(),
                    allocatedHours: allocated,
                    availableHours: remaining
                });
            }
        }
    }
    customersForMonth.sort((a, b) => a.name.localeCompare(b.name, 'no'));
    Logger.log(`getCustomers (${userSuffix}) fant ${customersForMonth.length} kunder for ${currentMonthYear}.`);
    return createJsonResponse({ success: true, customers: customersForMonth }, params.callback);
  } catch (error) {
    Logger.log(`Feil i handleGetCustomers (${userSuffix}): ${error}\nStack: ${error.stack}`);
    return createJsonResponse({ success: false, message: `Feil ved henting av kunder (${userSuffix}): ${error.message}` }, params.callback);
  }
}
function handleGetCustomerTotalsForMonth(params, userSuffix) { 
  const month = parseInt(params.month);
  const year = parseInt(params.year);
  Logger.log(`handleGetCustomerTotalsForMonth (${userSuffix}): Henter totalsummer for ${month}/${year}`);
  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    return createJsonResponse({ success: false, message: "Ugyldig måned/år." }, params.callback);
  }
  try {
    const customerSheetName = getUserSpecificSheetName(CUSTOMER_SHEET_BASE, userSuffix);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(customerSheetName);
    if (!sheet) throw new Error(`Fant ikke arket: ${customerSheetName}`);
    const spreadsheetTimezone = ss.getSpreadsheetTimeZone();
    const targetMonthYear = Utilities.formatDate(new Date(year, month - 1, 1), spreadsheetTimezone, "yyyy-MM");
    Logger.log(` (${userSuffix}) Søker etter måneden: ${targetMonthYear}`);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return createJsonResponse({ success: true, totalAllocated: 0, totalRemaining: 0 }, params.callback);
    }
    const lastDataCol = Math.max(CUST_MONTH_COL, CUST_ALLOC_COL, CUST_REMAIN_COL);
    const range = sheet.getRange(2, CUST_MONTH_COL, lastRow - 1, lastDataCol - CUST_MONTH_COL + 1);
    const values = range.getValues();
    let totalAllocated = 0;
    let totalRemaining = 0;
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const rawMonthValue = row[CUST_MONTH_COL - CUST_MONTH_COL];
      let rowMonth = "";
      if (rawMonthValue instanceof Date && !isNaN(rawMonthValue.getTime())) {
        rowMonth = Utilities.formatDate(rawMonthValue, spreadsheetTimezone, "yyyy-MM");
      } else if (rawMonthValue) {
        rowMonth = rawMonthValue.toString().trim();
         if (!/^\d{4}-\d{2}$/.test(rowMonth)) {
            Logger.log(` (${userSuffix}) ADVARSEL: Måned '${rowMonth}' på rad ${i+2} har uventet format.`);
        }
      } else {
        continue;
      }
      if (rowMonth === targetMonthYear) {
        const allocated = parseFloat(row[CUST_ALLOC_COL - CUST_MONTH_COL]) || 0;
        const remaining = parseFloat(row[CUST_REMAIN_COL - CUST_MONTH_COL]) || 0;
        totalAllocated += allocated;
        totalRemaining += remaining;
      }
    }
    Logger.log(`getCustomerTotalsForMonth (${userSuffix}): Ferdig. Tildelt: ${totalAllocated}, Gjenstående: ${totalRemaining} for ${targetMonthYear}.`);
    return createJsonResponse({ success: true, totalAllocated: totalAllocated, totalRemaining: totalRemaining }, params.callback);
  } catch (error) {
    Logger.log(`Feil i handleGetCustomerTotalsForMonth (${userSuffix}): ${error}\nStack: ${error.stack}`);
    return createJsonResponse({ success: false, message: `Feil ved henting av kundetotaler (${userSuffix}): ${error.message}` }, params.callback);
  }
}
function handleLogTime(params, userSuffix) { 
  const customerName = params.customerName;
  const timeSpent = parseFloat(params.timeSpent);
  const comment = params.comment || "";
  const dateStr = params.date ? params.date.split('T')[0] : new Date().toISOString().split('T')[0];
  const taskId = params.taskId || null; 

  if (!customerName || isNaN(timeSpent) || timeSpent < 0) {
    return createJsonResponse({ success: false, message: "Ugyldige data for logTime." });
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return createJsonResponse({ success: false, message: "Server opptatt, prøv igjen." });
  }
  Logger.log(`Starter SIMPLIFIED logTime for ${customerName} (${userSuffix}), ${timeSpent}t, Dato: ${dateStr}, OppgaveID: ${taskId}.`);
  try {
    const logSheetName = getUserSpecificSheetName(LOG_SHEET_BASE, userSuffix);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const logSheet = ss.getSheetByName(logSheetName);
    if (!logSheet) throw new Error(`Fant ikke arket: ${logSheetName}`);

    const logEntry = [];
    const lastLogCol = Math.max(LOG_DATE_COL, LOG_CUSTOMER_COL, LOG_SPENT_COL, LOG_SOLD_COL, LOG_REMAINING_COL, LOG_COMMENT_COL, LOG_TASKID_COL);
    logEntry[LOG_DATE_COL - 1] = dateStr;
    logEntry[LOG_CUSTOMER_COL - 1] = customerName;
    logEntry[LOG_SPENT_COL - 1] = timeSpent;
    logEntry[LOG_SOLD_COL - 1] = null;
    logEntry[LOG_REMAINING_COL - 1] = null;
    logEntry[LOG_COMMENT_COL - 1] = comment;
    if (LOG_TASKID_COL <= lastLogCol) { 
        logEntry[LOG_TASKID_COL - 1] = taskId;
    }
    while(logEntry.length < lastLogCol) logEntry.push(null);

    logSheet.appendRow(logEntry.slice(0, lastLogCol));
    Logger.log(`Simplified logTime (${userSuffix}): Loggføring lagt til i ${logSheetName}.`);
    SpreadsheetApp.flush(); 
    return createJsonResponse({ success: true, message: `Tid logget i ${logSheetName}.` });
  } catch (error) {
    Logger.log(`Kritisk Feil i Simplified handleLogTime (${userSuffix}): ${error}\nStack: ${error.stack}`);
    return createJsonResponse({ success: false, message: `Kritisk feil under logging (${userSuffix}): ${error.message}` });
  } finally {
    lock.releaseLock();
  }
}
function handleAddCustomer(params, userSuffix) { 
 const customerName = params.customerName ? params.customerName.trim() : null;
 const initialAvailableHours = parseFloat(params.initialAvailableHours);
 const timeSpent = parseFloat(params.timeSpent || 0); 
 const comment = params.comment || "";
 const dateStr = params.date ? params.date.split('T')[0] : new Date().toISOString().split('T')[0];

 if (!customerName || isNaN(initialAvailableHours) || initialAvailableHours < 0 || isNaN(timeSpent) || timeSpent < 0) {
   return createJsonResponse({ success: false, message: "Ugyldige data for ny kunde." });
 }
 const lock = LockService.getScriptLock();
 if (!lock.tryLock(15000)) {
   return createJsonResponse({ success: false, message: "Server opptatt." });
 }
 Logger.log(`Starter addCustomer for ${customerName} (${userSuffix}), Tildelt ${initialAvailableHours}t`);
 try {
   const customerSheetName = getUserSpecificSheetName(CUSTOMER_SHEET_BASE, userSuffix);
   const logSheetName = getUserSpecificSheetName(LOG_SHEET_BASE, userSuffix);
   const ss = SpreadsheetApp.openById(SHEET_ID);
   const customerSheet = ss.getSheetByName(customerSheetName);
   if (!customerSheet) throw new Error(`Fant ikke kundeark: ${customerSheetName}`);
   const logSheet = ss.getSheetByName(logSheetName); 

   const currentMonthYear = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM");

   if (findCustomerRowForMonth(customerSheet, customerName, currentMonthYear) !== -1) {
     return createJsonResponse({ success: false, message: `Kunde '${customerName}' finnes allerede for ${currentMonthYear} i ark ${customerSheetName}.` });
   }
   const remainingHoursAfterAdd = initialAvailableHours - timeSpent;
   const newRowData = [];
   const lastCustCol = Math.max(CUST_MONTH_COL, CUST_NAME_COL, CUST_ALLOC_COL, CUST_REMAIN_COL);
   newRowData[CUST_MONTH_COL - 1] = currentMonthYear;
   newRowData[CUST_NAME_COL - 1] = customerName;
   newRowData[CUST_ALLOC_COL - 1] = initialAvailableHours;
   newRowData[CUST_REMAIN_COL - 1] = remainingHoursAfterAdd;
   while(newRowData.length < lastCustCol) newRowData.push(null);

   customerSheet.appendRow(newRowData);
   Logger.log(`addCustomer (${userSuffix}): La til rad for ${customerName} i ${customerSheetName}.`);

   if (timeSpent > 0 && logSheet) {
       const logEntry = [];
       const lastLogCol = Math.max(LOG_DATE_COL, LOG_CUSTOMER_COL, LOG_SPENT_COL, LOG_SOLD_COL, LOG_REMAINING_COL, LOG_COMMENT_COL, LOG_TASKID_COL);
       logEntry[LOG_DATE_COL - 1] = dateStr;
       logEntry[LOG_CUSTOMER_COL - 1] = customerName;
       logEntry[LOG_SPENT_COL - 1] = timeSpent;
       logEntry[LOG_SOLD_COL - 1] = initialAvailableHours;
       logEntry[LOG_REMAINING_COL - 1] = remainingHoursAfterAdd;
       logEntry[LOG_COMMENT_COL - 1] = comment || "[Opprettelse av kunde]";
       if (LOG_TASKID_COL <= lastLogCol) logEntry[LOG_TASKID_COL - 1] = null;
       while(logEntry.length < lastLogCol) logEntry.push(null);
       logSheet.appendRow(logEntry.slice(0, lastLogCol));
       Logger.log(`addCustomer (${userSuffix}): Logget ${timeSpent}t for opprettelse i ${logSheetName}.`);
   } else if (timeSpent > 0 && !logSheet) {
       Logger.log(`Advarsel (${userSuffix}): Fant ikke ${logSheetName} for å logge tid ved kundeopprettelse.`);
   }
   SpreadsheetApp.flush();
   return createJsonResponse({
     success: true,
     message: `Kunde '${customerName}' lagt til i ${customerSheetName}.`,
     customer: { name: customerName, allocatedHours: initialAvailableHours, availableHours: remainingHoursAfterAdd }
   });
 } catch (error) {
   Logger.log(`Feil i handleAddCustomer (${userSuffix}): ${error}\nStack: ${error.stack}`);
   return createJsonResponse({ success: false, message: `Feil ved opprettelse av kunde (${userSuffix}): ${error.message}` });
 } finally {
   lock.releaseLock();
 }
}
function handleUpdateCustomer(params, userSuffix) { 
 const originalName = params.originalName;
 const newName = params.newName ? params.newName.trim() : null;
 const newAvailableHoursInput = params.newAvailableHours; 
 if (!originalName || (!newName && newAvailableHoursInput === undefined)) {
   return createJsonResponse({ success: false, message: "Ugyldige data for kundeoppdatering." });
 }
 const newAvailableHours = newAvailableHoursInput !== undefined ? parseFloat(newAvailableHoursInput) : undefined;
 if (newAvailableHours !== undefined && isNaN(newAvailableHours)) {
    return createJsonResponse({ success: false, message: "Timer gjenstående må være et gyldig tall." });
 }
 const lock = LockService.getScriptLock();
 if (!lock.tryLock(15000)) {
   return createJsonResponse({ success: false, message: "Server opptatt." });
 }
 Logger.log(`Starter updateCustomer for ${originalName} (${userSuffix})`);
 try {
   const customerSheetName = getUserSpecificSheetName(CUSTOMER_SHEET_BASE, userSuffix);
   const ss = SpreadsheetApp.openById(SHEET_ID);
   const customerSheet = ss.getSheetByName(customerSheetName);
   if (!customerSheet) throw new Error(`Fant ikke kundeark: ${customerSheetName}`);

   const currentMonthYear = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM");
   const customerRow = findCustomerRowForMonth(customerSheet, originalName, currentMonthYear);
   if (customerRow === -1) {
     return createJsonResponse({ success: false, message: `Fant ikke kunde '${originalName}' for ${currentMonthYear} i ${customerSheetName}.` });
   }
   let updated = false;
   const nameCell = customerSheet.getRange(customerRow, CUST_NAME_COL);
   const remainCell = customerSheet.getRange(customerRow, CUST_REMAIN_COL);
   const allocCell = customerSheet.getRange(customerRow, CUST_ALLOC_COL);
   const currentName = nameCell.getValue().toString();
   const currentRemaining = parseFloat(remainCell.getValue()) || 0;
   const currentAllocated = parseFloat(allocCell.getValue()) || 0; 
   let finalName = currentName;
   let finalRemaining = currentRemaining;

   if (newName && newName.toLowerCase() !== currentName.toLowerCase()) {
     const existingRowForNewName = findCustomerRowForMonth(customerSheet, newName, currentMonthYear);
     if (existingRowForNewName !== -1 && existingRowForNewName !== customerRow) {
       return createJsonResponse({ success: false, message: `En annen kunde med navnet '${newName}' finnes allerede for ${currentMonthYear} i ${customerSheetName}.` });
     }
     nameCell.setValue(newName);
     finalName = newName;
     updated = true;
     Logger.log(` (${userSuffix}) Oppdaterte kundenavn fra '${currentName}' til '${newName}'.`);
   }
   if (newAvailableHours !== undefined && newAvailableHours !== currentRemaining) {
     remainCell.setValue(newAvailableHours);
     finalRemaining = newAvailableHours;
     updated = true;
     Logger.log(` (${userSuffix}) Oppdaterte gjenstående timer fra ${currentRemaining} til ${newAvailableHours}.`);
   }
   if (!updated) {
     return createJsonResponse({ success: true, message: "Ingen endringer ble gjort." });
   }
   SpreadsheetApp.flush();
   return createJsonResponse({
     success: true,
     message: `Kunde '${finalName}' oppdatert i ${customerSheetName}.`,
     customer: { name: finalName, allocatedHours: currentAllocated, availableHours: finalRemaining }
   });
 } catch (error) {
   Logger.log(`Feil i handleUpdateCustomer (${userSuffix}): ${error}\nStack: ${error.stack}`);
   return createJsonResponse({ success: false, message: `Feil ved oppdatering av kunde (${userSuffix}): ${error.message}` });
 } finally {
   lock.releaseLock();
 }
}
function handleDeleteCustomer(params, userSuffix) { 
 const customerName = params.customerName;
 if (!customerName) {
   return createJsonResponse({ success: false, message: "Mangler kundenavn." });
 }
 const lock = LockService.getScriptLock();
 if (!lock.tryLock(15000)) {
   return createJsonResponse({ success: false, message: "Server opptatt." });
 }
 Logger.log(`Starter deleteCustomer for ${customerName} (${userSuffix}).`);
 try {
   const customerSheetName = getUserSpecificSheetName(CUSTOMER_SHEET_BASE, userSuffix);
   const ss = SpreadsheetApp.openById(SHEET_ID);
   const customerSheet = ss.getSheetByName(customerSheetName);
   if (!customerSheet) throw new Error(`Fant ikke kundeark: ${customerSheetName}`);

   const currentMonthYear = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM");
   const customerRow = findCustomerRowForMonth(customerSheet, customerName, currentMonthYear);
   if (customerRow === -1) {
     return createJsonResponse({ success: false, message: `Fant ikke kunde '${customerName}' for ${currentMonthYear} i ${customerSheetName}.` });
   }
   customerSheet.deleteRow(customerRow);
   Logger.log(` (${userSuffix}) Slettet rad ${customerRow} for kunde '${customerName}' fra ${customerSheetName}.`);
   SpreadsheetApp.flush();
   return createJsonResponse({ success: true, message: `Kunde '${customerName}' slettet for ${currentMonthYear} fra ${customerSheetName}.` });
 } catch (error) {
   Logger.log(`Feil i handleDeleteCustomer (${userSuffix}): ${error}\nStack: ${error.stack}`);
   return createJsonResponse({ success: false, message: `Feil ved sletting av kunde (${userSuffix}): ${error.message}` });
 } finally {
   lock.releaseLock();
 }
}
function handleGetTimeLog(params, userSuffix) { 
  const month = parseInt(params.month);
  const year = parseInt(params.year);
  Logger.log(`== handleGetTimeLog START (${userSuffix}) == | Måned: ${month}, År: ${year}`);
  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    return createJsonResponse({ success: false, message: "Ugyldig måned/år." }, params.callback);
  }
  try {
    const logSheetName = getUserSpecificSheetName(LOG_SHEET_BASE, userSuffix);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const logSheet = ss.getSheetByName(logSheetName);
    if (!logSheet) throw new Error(`Fant ikke arket: ${logSheetName}`);

    const spreadsheetTimezone = ss.getSpreadsheetTimeZone();
    const lastRow = logSheet.getLastRow();
    if (lastRow < 2) {
      return createJsonResponse({ success: true, timeLog: [] }, params.callback);
    }
    const lastLogCol = Math.max(LOG_DATE_COL, LOG_CUSTOMER_COL, LOG_SPENT_COL, LOG_SOLD_COL, LOG_REMAINING_COL, LOG_COMMENT_COL, LOG_TASKID_COL);
    const values = logSheet.getRange(2, 1, lastRow - 1, lastLogCol).getValues();
    Logger.log(` (${userSuffix}) Leste ${values.length} datarader fra ${logSheetName}`);
    const timeLogEntries = [];
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const dateValue = row[LOG_DATE_COL - 1];
      let entryDate;
      try {
          if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
              entryDate = dateValue;
          } else if (dateValue) {
              entryDate = new Date(dateValue);
              if (isNaN(entryDate.getTime()) && typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                  const parts = dateValue.split('-');
                  entryDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
              }
          }
          if (!entryDate || isNaN(entryDate.getTime())) {
              continue;
          }
      } catch(e) {
          continue;
      }
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth() + 1;
      if (entryYear === year && entryMonth === month) {
        const dateKey = Utilities.formatDate(entryDate, spreadsheetTimezone, "yyyy-MM-dd");
        timeLogEntries.push({
          date: dateKey,
          customer: row[LOG_CUSTOMER_COL - 1] || "Ukjent",
          timeSpent: parseFloat(row[LOG_SPENT_COL - 1]) || 0,
          comment: row[LOG_COMMENT_COL - 1] || "",
          taskId: (LOG_TASKID_COL <= lastLogCol) ? (row[LOG_TASKID_COL - 1] || null) : null
        });
      }
    }
    Logger.log(` (${userSuffix}) Fant ${timeLogEntries.length} oppføringer for ${month}/${year}.`);
    const dailySummary = {};
    timeLogEntries.forEach(entry => {
      const key = entry.date;
      if (!dailySummary[key]) {
        dailySummary[key] = { date: key, totalHours: 0, customers: [] };
      }
      dailySummary[key].totalHours += entry.timeSpent;
      dailySummary[key].customers.push({
        name: entry.customer,
        hours: entry.timeSpent,
        comment: entry.comment,
        taskId: entry.taskId
      });
    });
    const summaryArray = Object.values(dailySummary).sort((a, b) => a.date.localeCompare(b.date));
    Logger.log(` (${userSuffix}) Gruppert sammendrag (${summaryArray.length} dager)`);
    Logger.log(`== handleGetTimeLog SLUTT (${userSuffix}) ==`);
    return createJsonResponse({ success: true, timeLog: summaryArray }, params.callback);
  } catch (error) {
    Logger.log(`FEIL i handleGetTimeLog (${userSuffix}): ${error.message}\nStack: ${error.stack}`);
    return createJsonResponse({ success: false, message: `Feil ved henting av tidslogg (${userSuffix}): ${error.message}` }, params.callback);
  }
}

// --- Task Handlers (Oppdatert for Gjentakelse OG Planlagte Tider) ---
function handleGetTasks(params, userSuffix) {
 try {
   const taskSheetName = getUserSpecificSheetName(TASK_SHEET_BASE, userSuffix);
   const ss = SpreadsheetApp.openById(SHEET_ID);
   const taskSheet = ss.getSheetByName(taskSheetName);
   if (!taskSheet) throw new Error(`Fant ikke arket: ${taskSheetName}`);

   const lastRow = taskSheet.getLastRow();
   if (lastRow < 2) {
     return createJsonResponse({ success: true, tasks: [] }, params.callback);
   }
   // Sørg for at lastColIndex inkluderer de nye kolonnene
   const lastColIndex = Math.max(
       TASK_ID_COL, TASK_CUSTOMER_COL, TASK_NAME_COL, TASK_STATUS_COL,
       TASK_PRIORITY_COL, TASK_DUEDATE_COL, TASK_DESC_COL, TASK_CREATED_COL,
       TASK_COMPLETED_COL, TASK_ESTIMATED_TIME_COL, TASK_ENDDATE_COL, TASK_ASSIGNED_COL,
       TASK_RECURRENCE_RULE_COL, TASK_RECURRENCE_END_DATE_COL,
       TASK_NEXT_DUE_DATE_COL, TASK_IS_RECURRING_MASTER_COL, TASK_PARENT_TASK_ID_COL,
       TASK_SCHEDULED_START_COL, TASK_SCHEDULED_END_COL // NYE KOLONNER
   );
   const range = taskSheet.getRange(2, 1, lastRow - 1, lastColIndex);
   const values = range.getValues();
   const tasks = [];
   const spreadsheetTimezone = ss.getSpreadsheetTimeZone(); // Bruk spreadsheet-tidssonen for konsistens
   const filterCustomerLower = params.customer ? params.customer.trim().toLowerCase() : null;
   const filterStatusLower = params.status ? params.status.trim().toLowerCase() : null;
   Logger.log(`handleGetTasks (${userSuffix}) - Filter: Kunde=${filterCustomerLower}, Status=${filterStatusLower} fra ark ${taskSheetName}`);

   for (let i = 0; i < values.length; i++) {
     const row = values[i];
     const taskData = {
       id: row[TASK_ID_COL - 1],
       customer: row[TASK_CUSTOMER_COL - 1] || "",
       name: row[TASK_NAME_COL - 1] || "",
       status: row[TASK_STATUS_COL - 1] || "Ny",
       priority: row[TASK_PRIORITY_COL - 1] || null,
       dueDate: (row[TASK_DUEDATE_COL - 1] && !isNaN(new Date(row[TASK_DUEDATE_COL - 1]).getTime())) ? Utilities.formatDate(new Date(row[TASK_DUEDATE_COL - 1]), spreadsheetTimezone, "yyyy-MM-dd") : null,
       description: row[TASK_DESC_COL - 1] || null,
       createdDate: (row[TASK_CREATED_COL - 1] && !isNaN(new Date(row[TASK_CREATED_COL - 1]).getTime())) ? Utilities.formatDate(new Date(row[TASK_CREATED_COL - 1]), spreadsheetTimezone, "yyyy-MM-dd") : null,
       completedDate: (TASK_COMPLETED_COL <= lastColIndex && row[TASK_COMPLETED_COL - 1] && !isNaN(new Date(row[TASK_COMPLETED_COL - 1]).getTime())) ? Utilities.formatDate(new Date(row[TASK_COMPLETED_COL - 1]), spreadsheetTimezone, "yyyy-MM-dd") : null,
       estimatedTime: (TASK_ESTIMATED_TIME_COL <= lastColIndex) ? (parseFloat(String(row[TASK_ESTIMATED_TIME_COL - 1]).replace(',','.')) || null) : null, // Håndter komma
       endDate: (TASK_ENDDATE_COL <= lastColIndex && row[TASK_ENDDATE_COL - 1] && !isNaN(new Date(row[TASK_ENDDATE_COL - 1]).getTime())) ? Utilities.formatDate(new Date(row[TASK_ENDDATE_COL - 1]), spreadsheetTimezone, "yyyy-MM-dd") : null,
       isAssigned: (TASK_ASSIGNED_COL <= lastColIndex) ? (row[TASK_ASSIGNED_COL - 1] === "TRUE" || row[TASK_ASSIGNED_COL - 1] === true) : false,
       recurrenceRule: (TASK_RECURRENCE_RULE_COL <= lastColIndex) ? (row[TASK_RECURRENCE_RULE_COL - 1] || null) : null,
       recurrenceEndDate: (TASK_RECURRENCE_END_DATE_COL <= lastColIndex && row[TASK_RECURRENCE_END_DATE_COL-1] && !isNaN(new Date(row[TASK_RECURRENCE_END_DATE_COL-1]).getTime())) ? Utilities.formatDate(new Date(row[TASK_RECURRENCE_END_DATE_COL-1]), spreadsheetTimezone, "yyyy-MM-dd") : null,
       nextDueDate: (TASK_NEXT_DUE_DATE_COL <= lastColIndex && row[TASK_NEXT_DUE_DATE_COL-1] && !isNaN(new Date(row[TASK_NEXT_DUE_DATE_COL-1]).getTime())) ? Utilities.formatDate(new Date(row[TASK_NEXT_DUE_DATE_COL-1]), spreadsheetTimezone, "yyyy-MM-dd") : null,
       isRecurringMaster: (TASK_IS_RECURRING_MASTER_COL <= lastColIndex) ? (row[TASK_IS_RECURRING_MASTER_COL - 1] === "TRUE" || row[TASK_IS_RECURRING_MASTER_COL - 1] === true) : false,
       parentTaskID: (TASK_PARENT_TASK_ID_COL <= lastColIndex) ? (row[TASK_PARENT_TASK_ID_COL - 1] || null) : null,
       // NYE FELTER FOR PLANLAGT TID
       scheduledStart: (TASK_SCHEDULED_START_COL <= lastColIndex && row[TASK_SCHEDULED_START_COL - 1] && !isNaN(new Date(row[TASK_SCHEDULED_START_COL - 1]).getTime())) ? new Date(row[TASK_SCHEDULED_START_COL - 1]).toISOString() : null,
       scheduledEnd: (TASK_SCHEDULED_END_COL <= lastColIndex && row[TASK_SCHEDULED_END_COL - 1] && !isNaN(new Date(row[TASK_SCHEDULED_END_COL - 1]).getTime())) ? new Date(row[TASK_SCHEDULED_END_COL - 1]).toISOString() : null,
     };
     if (!taskData.id || !taskData.name) continue; // Hopp over rader uten ID eller navn
     
     let include = true;
     if (filterCustomerLower && (taskData.customer || "").trim().toLowerCase() !== filterCustomerLower) {
       include = false;
     }
     if (include && filterStatusLower && filterStatusLower !== 'all') {
       const currentStatusLower = (taskData.status || "").trim().toLowerCase();
       if (filterStatusLower === "open" && !(currentStatusLower === "ny" || currentStatusLower === "pågår" || currentStatusLower === "venter")) {
         include = false;
       } else if (filterStatusLower !== "open" && currentStatusLower !== filterStatusLower) {
         include = false;
       }
     }
     if (include) {
       tasks.push(taskData);
     }
   }
   Logger.log(`handleGetTasks (${userSuffix}) fant ${tasks.length} oppgaver etter filter.`);
   return createJsonResponse({ success: true, tasks: tasks }, params.callback);
 } catch (error) {
   Logger.log(`Feil i handleGetTasks (${userSuffix}): ${error}\nStack: ${error.stack}`);
   return createJsonResponse({ success: false, message: `Feil ved henting av oppgaver (${userSuffix}): ${error.message}` }, params.callback);
 }
}

function handleAddTask(params, userSuffix) { 
   const customer = params.customer ? params.customer.trim() : null;
   const name = params.name ? params.name.trim() : null;
   const status = params.status ? params.status.trim() : "Ny";
   const priority = params.priority || null;
   const dueDateStr = params.dueDate || null; 
   const description = params.description || null;
   const endDateStr = params.endDate || null; 
   let estimatedTime = parseFloat(String(params.estimatedTime).replace(',','.')); // Håndter komma
   if (isNaN(estimatedTime) || estimatedTime < 0) estimatedTime = null; 
   const source = params.source; 
   const recurrenceRule = params.recurrenceRule || null; 
   const recurrenceEndDateStr = params.recurrenceEndDate || null;

   // scheduledStart og scheduledEnd vil vanligvis være null ved opprettelse,
   // med mindre frontend sender dem med (f.eks. hvis man oppretter OG planlegger samtidig)
   const scheduledStartStr = params.scheduledStart || null;
   const scheduledEndStr = params.scheduledEnd || null;


   if (!customer || !name) {
     return createJsonResponse({ success: false, message: "Kunde og oppgavenavn må angis." });
   }
   if (recurrenceRule && recurrenceRule !== 'Aldri' && !dueDateStr) {
     return createJsonResponse({ success: false, message: "Frist (startdato) må settes for gjentakende oppgaver." });
   }

   const lock = LockService.getScriptLock();
   if (!lock.tryLock(15000)) {
     return createJsonResponse({ success: false, message: "Server opptatt." });
   }
   try {
       const taskSheetName = getUserSpecificSheetName(TASK_SHEET_BASE, userSuffix); 
       const ss = SpreadsheetApp.openById(SHEET_ID);
       const taskSheet = ss.getSheetByName(taskSheetName);
       if (!taskSheet) throw new Error(`Fant ikke Oppgaver-ark: ${taskSheetName}`);

       const taskId = "TASK_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
       const createdDate = new Date();
       let dueDateObj = null;
       if(dueDateStr) { try { dueDateObj = new Date(dueDateStr); if(isNaN(dueDateObj.getTime())) dueDateObj = null; } catch(e){ dueDateObj = null;} }
       let endDateObj = null; 
       if(endDateStr) { try { endDateObj = new Date(endDateStr); if(isNaN(endDateObj.getTime())) endDateObj = null; } catch(e){ endDateObj = null;} }
       let recurrenceEndDateObj = null;
       if(recurrenceEndDateStr) { try { recurrenceEndDateObj = new Date(recurrenceEndDateStr); if(isNaN(recurrenceEndDateObj.getTime())) recurrenceEndDateObj = null; } catch(e){ recurrenceEndDateObj = null;} }
       
       let scheduledStartObj = null;
       if(scheduledStartStr) { try { scheduledStartObj = new Date(scheduledStartStr); if(isNaN(scheduledStartObj.getTime())) scheduledStartObj = null; } catch(e){ scheduledStartObj = null;} }
       let scheduledEndObj = null;
       if(scheduledEndStr) { try { scheduledEndObj = new Date(scheduledEndStr); if(isNaN(scheduledEndObj.getTime())) scheduledEndObj = null; } catch(e){ scheduledEndObj = null;} }


       const lastTaskCol = Math.max(
           TASK_ID_COL, TASK_CUSTOMER_COL, TASK_NAME_COL, TASK_STATUS_COL, TASK_PRIORITY_COL,
           TASK_DUEDATE_COL, TASK_DESC_COL, TASK_CREATED_COL, TASK_COMPLETED_COL,
           TASK_ESTIMATED_TIME_COL, TASK_ENDDATE_COL, TASK_ASSIGNED_COL,
           TASK_RECURRENCE_RULE_COL, TASK_RECURRENCE_END_DATE_COL,
           TASK_NEXT_DUE_DATE_COL, TASK_IS_RECURRING_MASTER_COL, TASK_PARENT_TASK_ID_COL,
           TASK_SCHEDULED_START_COL, TASK_SCHEDULED_END_COL // NYE KOLONNER
       );
       const newRowData = [];
       newRowData[TASK_ID_COL - 1] = taskId;
       newRowData[TASK_CUSTOMER_COL - 1] = customer;
       newRowData[TASK_NAME_COL - 1] = name;
       newRowData[TASK_STATUS_COL - 1] = status;
       newRowData[TASK_PRIORITY_COL - 1] = priority;
       newRowData[TASK_DUEDATE_COL - 1] = dueDateObj; 
       newRowData[TASK_DESC_COL - 1] = description;
       newRowData[TASK_CREATED_COL - 1] = createdDate;
       
       // Fyll ut til siste kolonne med null som standard
       while(newRowData.length < lastTaskCol) newRowData.push(null);

       if (TASK_COMPLETED_COL <= lastTaskCol) newRowData[TASK_COMPLETED_COL - 1] = null;
       if (TASK_ESTIMATED_TIME_COL <= lastTaskCol) newRowData[TASK_ESTIMATED_TIME_COL - 1] = estimatedTime;
       if (TASK_ENDDATE_COL <= lastTaskCol) newRowData[TASK_ENDDATE_COL - 1] = endDateObj;
       if (TASK_ASSIGNED_COL <= lastTaskCol) {
         newRowData[TASK_ASSIGNED_COL - 1] = (source === 'manager') ? "TRUE" : null;
       }
       if (TASK_RECURRENCE_RULE_COL <= lastTaskCol) newRowData[TASK_RECURRENCE_RULE_COL - 1] = (recurrenceRule === 'Aldri' ? null : recurrenceRule);
       if (TASK_RECURRENCE_END_DATE_COL <= lastTaskCol) newRowData[TASK_RECURRENCE_END_DATE_COL - 1] = recurrenceEndDateObj;
       
       const isRecurring = recurrenceRule && recurrenceRule !== 'Aldri';
       if (TASK_IS_RECURRING_MASTER_COL <= lastTaskCol) newRowData[TASK_IS_RECURRING_MASTER_COL - 1] = isRecurring ? "TRUE" : "FALSE";
       if (TASK_NEXT_DUE_DATE_COL <= lastTaskCol) newRowData[TASK_NEXT_DUE_DATE_COL - 1] = isRecurring ? dueDateObj : null;
       if (TASK_PARENT_TASK_ID_COL <= lastTaskCol) newRowData[TASK_PARENT_TASK_ID_COL - 1] = null;

       // NYE FELTER
       if (TASK_SCHEDULED_START_COL <= lastTaskCol) newRowData[TASK_SCHEDULED_START_COL - 1] = scheduledStartObj;
       if (TASK_SCHEDULED_END_COL <= lastTaskCol) newRowData[TASK_SCHEDULED_END_COL - 1] = scheduledEndObj;


       taskSheet.appendRow(newRowData.slice(0, lastTaskCol));
       SpreadsheetApp.flush();

       const newTaskForResponse = {
         id: taskId, customer, name, status, priority,
         dueDate: dueDateStr, endDate: endDateStr, estimatedTime: estimatedTime,
         description, createdDate: Utilities.formatDate(createdDate, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd"),
         isAssigned: (source === 'manager'),
         recurrenceRule: (recurrenceRule === 'Aldri' ? null : recurrenceRule),
         recurrenceEndDate: recurrenceEndDateStr,
         isRecurringMaster: isRecurring,
         nextDueDate: isRecurring ? dueDateStr : null,
         scheduledStart: scheduledStartObj ? scheduledStartObj.toISOString() : null, // Send tilbake som ISO
         scheduledEnd: scheduledEndObj ? scheduledEndObj.toISOString() : null       // Send tilbake som ISO
       };
       Logger.log(`La til ny oppgave (${userSuffix}): ${newTaskForResponse.id} i ${taskSheetName}. Kilde: ${source}, Tildelt-kolonne satt til: ${newRowData[TASK_ASSIGNED_COL - 1]}, Gjentakelse: ${recurrenceRule}`);
       
       let emailMessage = "";
       if (source === 'manager') {
         try {
           sendNewTaskEmail(userSuffix, name, customer, dueDateStr, taskId);
           emailMessage = " og varsel sendt.";
         } catch (emailError) {
           Logger.log(`E-postvarsel feilet for oppgave ${taskId} til ${userSuffix}: ${emailError.message}`);
           emailMessage = ", men e-postvarsel feilet.";
         }
       }
       return createJsonResponse({ success: true, message: `Oppgave lagt til i ${taskSheetName}${emailMessage}`, task: newTaskForResponse });
   } catch (error) {
       Logger.log(`Feil i handleAddTask (${userSuffix}): ${error}\nStack: ${error.stack}`);
       return createJsonResponse({ success: false, message: `Feil ved lagring av oppgave (${userSuffix}): ${error.message}` });
   } finally {
       lock.releaseLock();
   }
}

function handleUpdateTask(params, userSuffix) { 
   const taskId = params.id;
   if (!taskId) {
     return createJsonResponse({ success: false, message: "Oppgave-ID mangler." });
   }
   const lock = LockService.getScriptLock();
   if (!lock.tryLock(15000)) {
     return createJsonResponse({ success: false, message: "Server opptatt." });
   }
   try {
       const taskSheetName = getUserSpecificSheetName(TASK_SHEET_BASE, userSuffix);
       const ss = SpreadsheetApp.openById(SHEET_ID);
       const taskSheet = ss.getSheetByName(taskSheetName);
       if (!taskSheet) throw new Error(`Fant ikke Oppgaver-ark: ${taskSheetName}`);

       const idColumnValues = taskSheet.getRange(2, TASK_ID_COL, Math.max(1, taskSheet.getLastRow() - 1), 1).getValues().map(r=>r[0].toString());
       let taskRowIndex = idColumnValues.indexOf(taskId.toString());
       if (taskRowIndex === -1) {
         return createJsonResponse({ success: false, message: `Fant ikke oppgave ID ${taskId} i ${taskSheetName}.` });
       }
       const actualRow = taskRowIndex + 2;
       Logger.log(`handleUpdateTask (${userSuffix}): Oppdaterer ${taskId} på rad ${actualRow} i ${taskSheetName}. Params: ${JSON.stringify(params)}`);
       
       let updatedFields = 0;
       // Sørg for at lastTaskCol inkluderer de nye kolonnene
       const lastTaskCol = Math.max(
           TASK_ID_COL, TASK_CUSTOMER_COL, TASK_NAME_COL, TASK_STATUS_COL, TASK_PRIORITY_COL,
           TASK_DUEDATE_COL, TASK_DESC_COL, TASK_CREATED_COL, TASK_COMPLETED_COL,
           TASK_ESTIMATED_TIME_COL, TASK_ENDDATE_COL, TASK_ASSIGNED_COL,
           TASK_RECURRENCE_RULE_COL, TASK_RECURRENCE_END_DATE_COL,
           TASK_NEXT_DUE_DATE_COL, TASK_IS_RECURRING_MASTER_COL, TASK_PARENT_TASK_ID_COL,
           TASK_SCHEDULED_START_COL, TASK_SCHEDULED_END_COL // NYE KOLONNER
       );
       const taskRange = taskSheet.getRange(actualRow, 1, 1, lastTaskCol);
       const currentValues = taskRange.getValues()[0];

       const updateCell = (colIndex, newValue, isDate = false, isNumber = false, isDateTime = false) => {
          if (colIndex > lastTaskCol || newValue === undefined) return; // Sjekk for undefined, ikke bare null/tom streng
          
          let valueToSet = (newValue === null || newValue === '') ? null : newValue;

          if ((isDate || isDateTime) && valueToSet !== null) { // isDateTime for scheduledStart/End
              try { 
                  valueToSet = new Date(valueToSet); 
                  if(isNaN(valueToSet.getTime())) valueToSet = null; 
              } catch(e){ 
                  Logger.log(`Ugyldig datoformat for kolonne ${colIndex}: ${newValue}`);
                  valueToSet = null; 
              }
          } else if((isDate || isDateTime) && valueToSet === null) { /* Keep as null */ }
          
          if (isNumber && valueToSet !== null) {
              valueToSet = parseFloat(String(valueToSet).replace(',','.')); // Håndter komma for tall også
              if (isNaN(valueToSet)) valueToSet = null;
              else if (valueToSet < 0 && colIndex === TASK_ESTIMATED_TIME_COL) valueToSet = 0; // Kun for estimert tid
          }

          let currentValInSheet = currentValues[colIndex - 1];
          let currentValFormatted = currentValInSheet;

          if (currentValInSheet instanceof Date && !isNaN(currentValInSheet.getTime())) {
              if (isDateTime) {
                  currentValFormatted = currentValInSheet.toISOString(); // Sammenlign ISO for datetime
              } else if (isDate) {
                  currentValFormatted = Utilities.formatDate(currentValInSheet, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
              }
          } else if (typeof currentValInSheet === 'number' && isNumber) {
              currentValFormatted = parseFloat(currentValInSheet);
          } else if (currentValInSheet === null || currentValInSheet === undefined) {
              currentValFormatted = null;
          } else {
              currentValFormatted = String(currentValInSheet);
          }
          
          let newValForComp = valueToSet;
          if (newValForComp instanceof Date && !isNaN(newValForComp.getTime())) {
              if (isDateTime) {
                  newValForComp = newValForComp.toISOString();
              } else if (isDate) {
                  newValForComp = Utilities.formatDate(newValForComp, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
              }
          } else if (newValForComp === null || newValForComp === undefined) {
              newValForComp = null;
          } else {
              newValForComp = String(newValForComp);
          }


          // Sammenlign verdier før skriving for å unngå unødvendige oppdateringer
          if (currentValFormatted === newValForComp) {
            // Logger.log(` (${userSuffix}) - Kolonne ${colIndex} ingen endring ('${currentValFormatted}' vs '${newValForComp}')`);
            return;
          }
          
          taskSheet.getRange(actualRow, colIndex).setValue(valueToSet);
          Logger.log(` (${userSuffix}) - Oppdaterte kolonne ${colIndex} fra '${currentValFormatted}' til '${newValForComp}' (rå verdi satt: ${valueToSet})`);
          updatedFields++;
        };

       updateCell(TASK_CUSTOMER_COL, params.customer);
       updateCell(TASK_NAME_COL, params.name);
       updateCell(TASK_STATUS_COL, params.status);
       updateCell(TASK_PRIORITY_COL, params.priority);
       updateCell(TASK_DUEDATE_COL, params.dueDate, true); // isDate = true
       updateCell(TASK_DESC_COL, params.description);
       updateCell(TASK_ENDDATE_COL, params.endDate, true); // isDate = true
       updateCell(TASK_ESTIMATED_TIME_COL, params.estimatedTime, false, true); // isNumber = true
       
       // NYE FELTER for planlagt tid
       updateCell(TASK_SCHEDULED_START_COL, params.scheduledStart, false, false, true); // isDateTime = true
       updateCell(TASK_SCHEDULED_END_COL, params.scheduledEnd, false, false, true);   // isDateTime = true

       if (params.recurrenceRule !== undefined) {
           const newRecRule = params.recurrenceRule === 'Aldri' ? null : params.recurrenceRule;
           updateCell(TASK_RECURRENCE_RULE_COL, newRecRule);
           const isNowRecurring = newRecRule && newRecRule !== 'Aldri';
           updateCell(TASK_IS_RECURRING_MASTER_COL, isNowRecurring ? "TRUE" : "FALSE");
           updateCell(TASK_NEXT_DUE_DATE_COL, isNowRecurring ? (params.dueDate ? new Date(params.dueDate) : null) : null, true);
       }
       if (params.recurrenceEndDate !== undefined) {
           updateCell(TASK_RECURRENCE_END_DATE_COL, params.recurrenceEndDate, true);
       }
       
       const currentStatusInSheet = (currentValues[TASK_STATUS_COL - 1] || "").toLowerCase();
       const newStatusFromParams = params.status ? params.status.toLowerCase() : null;
       if (TASK_COMPLETED_COL <= lastTaskCol) {
         if (newStatusFromParams && newStatusFromParams === "ferdig" && currentStatusInSheet !== "ferdig") {
           updateCell(TASK_COMPLETED_COL, new Date(), true);
         } else if (newStatusFromParams && newStatusFromParams !== "ferdig" && currentStatusInSheet === "ferdig") {
           updateCell(TASK_COMPLETED_COL, null); 
         }
       }

       if (updatedFields > 0) {
         SpreadsheetApp.flush();
         return createJsonResponse({ success: true, message: `Oppgave ${taskId} oppdatert i ${taskSheetName}. (${updatedFields} felt endret)` });
       } else {
         return createJsonResponse({ success: true, message: `Ingen endringer for oppgave ${taskId} i ${taskSheetName}.` });
       }
   } catch (error) {
       Logger.log(`Feil i handleUpdateTask (${userSuffix}): ${error}\nStack: ${error.stack}`);
       return createJsonResponse({ success: false, message: `Feil ved oppdatering av oppgave (${userSuffix}): ${error.message}` });
   } finally {
       lock.releaseLock();
   }
}

function handleDeleteTask(params, userSuffix) {
  const taskId = params.taskId;
  if (!taskId) {
    return createJsonResponse({ success: false, message: "Oppgave-ID mangler for sletting." });
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return createJsonResponse({ success: false, message: "Server opptatt, prøv igjen." });
  }
  try {
    const taskSheetName = getUserSpecificSheetName(TASK_SHEET_BASE, userSuffix);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const taskSheet = ss.getSheetByName(taskSheetName);
    if (!taskSheet) throw new Error(`Fant ikke Oppgaver-ark: ${taskSheetName}`);

    const idColumnValues = taskSheet.getRange(2, TASK_ID_COL, Math.max(1, taskSheet.getLastRow() - 1), 1).getValues().map(r => r[0].toString());
    let taskRowIndex = idColumnValues.indexOf(taskId.toString());

    if (taskRowIndex === -1) {
      return createJsonResponse({ success: false, message: `Fant ikke oppgave ID ${taskId} som skal slettes i ${taskSheetName}.` });
    }
    const actualRow = taskRowIndex + 2; // +1 for 0-indeksert, +1 for header
    
    taskSheet.deleteRow(actualRow);
    Logger.log(`Slettet oppgave ${taskId} (rad ${actualRow}) fra ${taskSheetName} for bruker ${userSuffix}.`);
    SpreadsheetApp.flush();
    return createJsonResponse({ success: true, message: `Oppgave ${taskId} slettet fra ${taskSheetName}.` });

  } catch (error) {
    Logger.log(`Feil i handleDeleteTask (${userSuffix}): ${error}\nStack: ${error.stack}`);
    return createJsonResponse({ success: false, message: `Feil ved sletting av oppgave (${userSuffix}): ${error.message}` });
  } finally {
    lock.releaseLock();
  }
}


function sendNewTaskEmail(assigneeSuffix, taskName, customerName, dueDateStr, taskId) { 
  try {
    const recipientEmail = USER_EMAILS[assigneeSuffix.toUpperCase()];
    if (!recipientEmail) {
      Logger.log(`Kunne ikke finne e-postadresse for bruker: ${assigneeSuffix}`);
      return; 
    }

    const assigneeName = assigneeSuffix.toUpperCase() === 'C' ? 'Cornelius' : 'William';
    const subject = `Ny oppgave tildelt: ${taskName}`;
    let body = `Hei ${assigneeName},\n\nDu har blitt tildelt en ny oppgave:\n`;
    body += `\nOppgave: ${taskName}`;
    body += `\nKunde: ${customerName}`;
    if (dueDateStr) {
      body += `\nFrist: ${new Date(dueDateStr).toLocaleDateString('no-NO')}`;
    } else {
      body += `\nFrist: Ikke satt`;
    }
    body += `\nOppgave ID: ${taskId}`;
    body += `\n\nVennligst se i Skar Timetracker for mer informasjon.`;
    body += `\n\nMed vennlig hilsen,\nSkar Timetracker System`;

    const emailQuotaRemaining = MailApp.getRemainingDailyQuota();
    Logger.log(`Gjenværende e-postkvote: ${emailQuotaRemaining}`);

    if (emailQuotaRemaining > 0) {
      MailApp.sendEmail({
        to: recipientEmail,
        subject: subject,
        body: body,
      });
      Logger.log(`E-post sendt til ${recipientEmail} for oppgave ${taskId}.`);
    } else {
      Logger.log(`E-postkvote oppbrukt. Kunne ikke sende varsel for oppgave ${taskId} til ${recipientEmail}.`);
    }
  } catch (e) {
    Logger.log(`Feil under sending av e-postvarsel for oppgave ${taskId}: ${e.toString()}\nStack: ${e.stack}`);
  }
}

function generateRecurringTaskInstances() {
  Logger.log("Starter generering av gjentakende oppgaveinstanser...");
  const userSuffixes = ['C', 'W'];
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  userSuffixes.forEach(userSuffix => {
    const taskSheetName = getUserSpecificSheetName(TASK_SHEET_BASE, userSuffix);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const taskSheet = ss.getSheetByName(taskSheetName);
    if (!taskSheet) {
      Logger.log(`Fant ikke oppgaveark: ${taskSheetName}. Hopper over for bruker ${userSuffix}.`);
      return;
    }

    const lastRow = taskSheet.getLastRow();
    if (lastRow < 2) return; 

    const lastColWithData = Math.max( // Sørg for å lese alle relevante kolonner
       TASK_ID_COL, TASK_CUSTOMER_COL, TASK_NAME_COL, TASK_STATUS_COL,
       TASK_PRIORITY_COL, TASK_DUEDATE_COL, TASK_DESC_COL, TASK_CREATED_COL,
       TASK_COMPLETED_COL, TASK_ESTIMATED_TIME_COL, TASK_ENDDATE_COL, TASK_ASSIGNED_COL,
       TASK_RECURRENCE_RULE_COL, TASK_RECURRENCE_END_DATE_COL,
       TASK_NEXT_DUE_DATE_COL, TASK_IS_RECURRING_MASTER_COL, TASK_PARENT_TASK_ID_COL,
       TASK_SCHEDULED_START_COL, TASK_SCHEDULED_END_COL
    );
    const range = taskSheet.getRange(2, 1, lastRow - 1, lastColWithData); 
    const values = range.getValues();
    
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const currentRowNum = i + 2; 

      const isMaster = row[TASK_IS_RECURRING_MASTER_COL - 1] === true || row[TASK_IS_RECURRING_MASTER_COL - 1] === "TRUE";
      const recurrenceRule = row[TASK_RECURRENCE_RULE_COL - 1];
      let nextDueDateVal = row[TASK_NEXT_DUE_DATE_COL - 1];
      let recurrenceEndDateVal = row[TASK_RECURRENCE_END_DATE_COL - 1];

      if (isMaster && recurrenceRule && recurrenceRule !== 'Aldri' && nextDueDateVal) {
        let nextDueDate = new Date(nextDueDateVal);
        nextDueDate.setHours(0,0,0,0);
        let recurrenceEndDate = recurrenceEndDateVal ? new Date(recurrenceEndDateVal) : null;
        if (recurrenceEndDate) recurrenceEndDate.setHours(0,0,0,0);

        if (nextDueDate <= today) {
          if (recurrenceEndDate && nextDueDate > recurrenceEndDate) {
            Logger.log(`Oppgave ID ${row[TASK_ID_COL - 1]} (${userSuffix}): Gjentakelse avsluttet (etter sluttdato).`);
            taskSheet.getRange(currentRowNum, TASK_IS_RECURRING_MASTER_COL).setValue("FALSE"); 
            continue;
          }

          const newInstanceId = "TASK_INST_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
          const newInstanceRow = [];
          // Kopier relevante felter fra master
          newInstanceRow[TASK_ID_COL - 1] = newInstanceId;
          newInstanceRow[TASK_CUSTOMER_COL - 1] = row[TASK_CUSTOMER_COL - 1];
          newInstanceRow[TASK_NAME_COL - 1] = row[TASK_NAME_COL - 1];
          newInstanceRow[TASK_STATUS_COL - 1] = "Ny"; // Ny instans er alltid "Ny"
          newInstanceRow[TASK_PRIORITY_COL - 1] = row[TASK_PRIORITY_COL - 1];
          newInstanceRow[TASK_DUEDATE_COL - 1] = new Date(nextDueDate); 
          newInstanceRow[TASK_DESC_COL - 1] = row[TASK_DESC_COL - 1];
          newInstanceRow[TASK_CREATED_COL - 1] = new Date(); // Opprettelsesdato for instansen
          newInstanceRow[TASK_COMPLETED_COL - 1] = null;
          newInstanceRow[TASK_ESTIMATED_TIME_COL - 1] = row[TASK_ESTIMATED_TIME_COL - 1];
          newInstanceRow[TASK_ENDDATE_COL - 1] = null; 
          newInstanceRow[TASK_ASSIGNED_COL - 1] = "TRUE"; 
          newInstanceRow[TASK_RECURRENCE_RULE_COL - 1] = null; 
          newInstanceRow[TASK_RECURRENCE_END_DATE_COL - 1] = null;
          newInstanceRow[TASK_NEXT_DUE_DATE_COL - 1] = null;
          newInstanceRow[TASK_IS_RECURRING_MASTER_COL - 1] = "FALSE";
          newInstanceRow[TASK_PARENT_TASK_ID_COL - 1] = row[TASK_ID_COL - 1]; 
          // NYE FELTER for planlagt tid settes til null for nye instanser
          newInstanceRow[TASK_SCHEDULED_START_COL - 1] = null;
          newInstanceRow[TASK_SCHEDULED_END_COL - 1] = null;

          const maxCol = taskSheet.getMaxColumns(); // Bruk faktisk antall kolonner i arket
          while(newInstanceRow.length < maxCol) newInstanceRow.push(null);
          
          taskSheet.appendRow(newInstanceRow.slice(0, maxCol));
          Logger.log(`Oppgave ID ${row[TASK_ID_COL - 1]} (${userSuffix}): Genererte ny instans ${newInstanceId} med frist ${Utilities.formatDate(nextDueDate, Session.getScriptTimeZone(), "yyyy-MM-dd")}.`);

          let newNextDueDate = new Date(nextDueDate);
          if (recurrenceRule === "Daglig") {
            newNextDueDate.setDate(newNextDueDate.getDate() + 1);
          } else if (recurrenceRule === "Ukentlig") {
            newNextDueDate.setDate(newNextDueDate.getDate() + 7);
          } else if (recurrenceRule === "Månedlig") {
            newNextDueDate.setMonth(newNextDueDate.getMonth() + 1);
          }
          taskSheet.getRange(currentRowNum, TASK_NEXT_DUE_DATE_COL).setValue(newNextDueDate);
          Logger.log(`Oppgave ID ${row[TASK_ID_COL - 1]} (${userSuffix}): Neste frist oppdatert til ${Utilities.formatDate(newNextDueDate, Session.getScriptTimeZone(), "yyyy-MM-dd")}.`);
        }
      }
    }
    SpreadsheetApp.flush();
  });
  Logger.log("Fullført generering av gjentakende oppgaveinstanser.");
}
