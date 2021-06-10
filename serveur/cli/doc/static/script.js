/* eslint-env browser */

document.querySelectorAll('.categorie h2').forEach((cate) => {
  cate.addEventListener('click', (e) => {
    e.target.parentNode
      .querySelector('.categorieContent')
      .classList.toggle('hidden');
  });
});

document.querySelectorAll('.route h3').forEach((cate) => {
  cate.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') return;

    e.target.parentNode
      .querySelector('.routeContent')
      .classList.toggle('hidden');
  });
});

const bddTitle = document.querySelector('.bddTitle');
bddTitle.addEventListener('click', () => {
  document.querySelector('.bdd').classList.toggle('hidden');
  bddTitle.classList.toggle('opened');
});

const permissionsTitle = document.querySelector('.permissionsTitle');
permissionsTitle.addEventListener('click', () => {
  document.querySelector('.permissions').classList.toggle('hidden');
  permissionsTitle.classList.toggle('opened');
});

document.querySelectorAll('.copyIcon').forEach((icon) => {
  icon.addEventListener('click', (e) => {
    copyToClipboard(e.target.getAttribute('urlValue'));
    // eslint-disable-next-line no-undef
    Toastify({
      text: 'URL Copiée dans le Presse Papier',
      duration: 3000,
      close: true,
      gravity: 'bottom', // `top` or `bottom`
      position: 'center', // `left`, `center` or `right`
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
  });
});

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
