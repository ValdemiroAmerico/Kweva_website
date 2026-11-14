// The form posts the CV directly to FormSubmit; no local storage of applications.
(() => {
 // Preserve incoming bookmarks created before the pages were separated.
 const legacyPages = { '#vagas': 'vagas.html', '#candidatura': 'candidatura.html' };
 if (location.pathname.endsWith('/carreiras.html') && legacyPages[location.hash]) {
  location.replace(new URL(legacyPages[location.hash], location.href).href);
  return;
 }
 const cv = document.getElementById('career-cv');
 if (!cv) return;
 function validate() {
  const file = cv.files[0];
  const english = document.documentElement.lang === 'en';
  let message = '';
  if (file && !/\.pdf$/i.test(file.name)) message = english ? 'Choose a PDF file.' : 'Selecione um ficheiro PDF.';
  else if (file && file.size > 5 * 1024 * 1024) message = english ? 'The PDF must be no larger than 5 MB.' : 'O PDF deve ter no máximo 5 MB.';
  cv.setCustomValidity(message);
 }
 cv.addEventListener('change', validate);
 document.addEventListener('kweva:languagechange', validate);
})();
