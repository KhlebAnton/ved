function toggleNoScroll() {
    const body = document.body;
    const html = document.documentElement;

    body.classList.toggle('is-no-scrolled');
    html.classList.toggle('is-no-scrolled');
}