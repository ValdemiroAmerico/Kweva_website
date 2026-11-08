// Submission uses the form action; the receiving service handles verification and confirmation.
(() => {
 const form = document.getElementById('academy-enrollment-form');
 if (!form) return;
 const course = form.querySelector('#en-course');
 const selectedCourse = new URLSearchParams(window.location.search).get('curso');
 if (selectedCourse === 'excel') course.value = 'Excel para Análise de Dados';
 if (selectedCourse === 'r') course.value = 'Programação em R';
})();
