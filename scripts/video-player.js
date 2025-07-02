const videoPlayer = document.getElementById('videoPlayer');
const btnPlayVideo = videoPlayer.querySelector('.m-video-control');
const video = videoPlayer.querySelector('.m-video');
const videoDuration = videoPlayer.querySelector('.m-video-duration');


btnPlayVideo.addEventListener('click', () => {
    video.play();
    video.setAttribute('controls', '');
    btnPlayVideo.classList.add('is-hidden')
});
video.addEventListener('ended', () => {
    video.removeAttribute('controls');
    btnPlayVideo.classList.remove('is-hidden')
    video.currentTime = 0;
});

video.addEventListener('loadedmetadata', function () {
    formatTime(video.duration)
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    videoDuration.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
