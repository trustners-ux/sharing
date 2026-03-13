/**
 * VJ Infosoft Data Extraction Scripts
 * Run these in the browser console on trustner.co.in/backend/ pages
 * All data is stored in localStorage from the scraping session
 */

// 1. Extract Client Master CSV
function downloadClientMaster() {
  var csv = localStorage.getItem('clientScrapeCSV');
  if (!csv) { alert('No client data in localStorage'); return; }
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vj_infosoft_client_master.csv';
  a.click();
  console.log('Downloaded client master: ' + csv.length + ' bytes');
}

// 2. Extract POS Master CSV
function downloadPOSMaster() {
  var csv = localStorage.getItem('posScrapeCSV');
  if (!csv) { alert('No POS data in localStorage'); return; }
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vj_infosoft_pos_master.csv';
  a.click();
  console.log('Downloaded POS master: ' + csv.length + ' bytes');
}

// 3. Extract POS Payout Report CSV
function downloadPOSPayout() {
  var csv = localStorage.getItem('posPayoutCSV');
  if (!csv) { alert('No payout data in localStorage'); return; }
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vj_infosoft_pos_payout_report.csv';
  a.click();
  console.log('Downloaded POS payout report: ' + csv.length + ' bytes');
}

// 4. Extract Renewal Due Report CSV
function downloadRenewalDue() {
  var csv = localStorage.getItem('renewalDueCSV');
  if (!csv) { alert('No renewal data in localStorage'); return; }
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vj_infosoft_renewal_due_report.csv';
  a.click();
  console.log('Downloaded renewal due report: ' + csv.length + ' bytes');
}

// Download all at once
function downloadAll() {
  downloadClientMaster();
  setTimeout(downloadPOSMaster, 500);
  setTimeout(downloadPOSPayout, 1000);
  setTimeout(downloadRenewalDue, 1500);
}

// Run: downloadAll()
console.log('VJ Infosoft extraction scripts loaded. Run downloadAll() to download all CSVs.');
