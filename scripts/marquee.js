const track = document.getElementById('marqueeTrack');
const content = track.querySelector('.m-marquee-content');

// Клонируем контент один раз
const clone = content.cloneNode(true);
track.appendChild(clone);
