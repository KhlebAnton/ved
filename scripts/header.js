const humburgerBtn = document.querySelector('.m-humburger');
const closeMenuBtn = document.querySelector('.m-menu-close');
const menuMobile = document.querySelector('.l-menu-mobile');
const menuMobileContent = document.querySelector('.m-menu');

humburgerBtn.addEventListener('click', openMenu);

closeMenuBtn.addEventListener('click', closeMenu);
function openMenu() {
    menuMobile.classList.add('is-open');
    menuMobileContent.classList.add('is-open');
    toggleNoScroll()
}
function closeMenu() {
    menuMobile.classList.remove('is-open');
    menuMobileContent.classList.remove('is-open');
    toggleNoScroll()
}

function toggleNoScroll() {
    const body = document.body;
    const html = document.documentElement;

    body.classList.toggle('is-no-scrolled');
    html.classList.toggle('is-no-scrolled');
}