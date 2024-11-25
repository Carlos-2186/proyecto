const API_KEY = 'AIzaSyDYxd04tdCsrfIMJIvKLOAGVCdEhofL2DI';
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const videoList = document.getElementById('video-list');
const player = document.getElementById('player');
const playlistList = document.getElementById('playlist-list');
const clearPlaylistBtn = document.getElementById('clear-playlist');


function loadPlaylist() {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    playlistList.innerHTML = '';
    savedPlaylist.forEach(video => {
        const li = document.createElement('li');
        li.textContent = video.title;
        li.onclick = () => playVideo(video.id);
        playlistList.appendChild(li);
    });
}


searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('ingrese titulo');
        return;
    }

    fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY")
        .then(response => {
            if (!response.ok) throw new Error('Error en la solicitud a la API');
            return response.json();
        })
        .then(data => {
            videoList.innerHTML = '';
            data.items.forEach(item => {
                const videoId = item.id?.videoId;
                if (!videoId) return;

                const li = document.createElement('li');
                li.textContent = item.snippet.title;
                li.onclick = () => {
                    playVideo(videoId);
                    saveToPlaylist({ title: item.snippet.title, id: videoId });
                };
                videoList.appendChild(li);
            });
        })
});

// Reproducir 
function playVideo(videoId) {
    player.src = "https://www.youtube.com/";
}

// Guardar 
function saveToPlaylist(video) {
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    if (playlist.some(v => v.id === video.id)) return; 
    playlist.push(video);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    loadPlaylist();
}

//Limpiar
clearPlaylistBtn.addEventListener('click', () => {
    localStorage.removeItem('playlist');
    loadPlaylist();
});
