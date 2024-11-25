const API_KEY = 'AIzaSyCrSfHphwwh_8XEyttvgD1NlH9eHEpCF3Y'; // Reemplázalo con tu API Key válida
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const videoList = document.getElementById('video-list');
const player = document.getElementById('player');
const playlistList = document.getElementById('playlist-list');
const clearPlaylistBtn = document.getElementById('clear-playlist');

// Cargar playlist desde el almacenamiento
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

// Buscar videos
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    videoList.innerHTML = '<li>Cargando resultados...</li>'; // Indicador de carga

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la solicitud a la API');
            return response.json();
        })
        .then(data => {
            if (data.items.length === 0) {
                videoList.innerHTML = '<li>No se encontraron resultados.</li>';
                return;
            }

            videoList.innerHTML = '';
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const li = document.createElement('li');
                li.textContent = item.snippet.title;
                li.onclick = () => {
                    playVideo(videoId);
                    saveToPlaylist({ title: item.snippet.title, id: videoId });
                };
                videoList.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Error al buscar videos:', err);
            alert('Hubo un problema al buscar videos. Revisa tu clave API.');
        });
});

// Reproducir video
function playVideo(videoId) {
    player.src = `https://www.youtube.com/embed/${videoId}`;
}

// Guardar en playlist
function saveToPlaylist(video) {
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    if (playlist.some(v => v.id === video.id)) return;
    playlist.push(video);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    loadPlaylist();
}

// Limpiar playlist
clearPlaylistBtn.addEventListener('click', () => {
    localStorage.removeItem('playlist');
    loadPlaylist();
});

// Inicializar
loadPlaylist();
