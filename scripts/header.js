const humburgerBtn = document.querySelector('.m-humburger');
const closeMenuBtn = document.querySelector('.m-menu-close');
const menuMobile = document.querySelector('.l-menu-mobile');
const menuMobileContent = document.querySelector('.m-menu');
const menuLinks = menuMobileContent.querySelectorAll('a');
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
menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu)
})
// Устанавливаем CSS-переменную с актуальной высотой
function setRealVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}

// Инициализация
setRealVH();

// Обновляем при ресайзе и изменении ориентации
window.addEventListener('resize', setRealVH);
window.addEventListener('orientationchange', setRealVH);