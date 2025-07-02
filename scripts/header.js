const humburgerBtn = document.querySelector('.m-humburger');
const closeMenuBtn = document.querySelector('.m-menu-close');
const menuMobile = document.querySelector('.l-menu-mobile');
const menuMobileContent = document.querySelector('.m-menu');

humburgerBtn.addEventListener('click', ()=> {
    menuMobile.classList.add('is-open');
    menuMobileContent.classList.add('is-open');
});

closeMenuBtn.addEventListener('click', ()=> {
    menuMobile.classList.remove('is-open');
    menuMobileContent.classList.remove('is-open');
});