// ========== CONFIGURATION ==========
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : window.location.origin;

const STORAGE_KEY = 'assanedown_history';
const THEME_KEY = 'assanedown_theme';

// ========== STATE MANAGEMENT ==========
const state = {
  currentVideo: null,
  currentDownload: null,
  downloads: new Map(),
  history: [],
  theme: localStorage.getItem(THEME_KEY) || 'light',
  isValidating: false,
  isDownloading: false
};

// ========== DOM ELEMENTS ==========
const elements = {
  // Theme
  themeToggle: document.getElementById('themeToggle'),
  
  // Input
  videoUrl: document.getElementById('videoUrl'),
  pasteBtn: document.getElementById('pasteBtn'),
  clearBtn: document.getElementById('clearBtn'),
  validateBtn: document.getElementById('validateBtn'),
  urlStatus: document.getElementById('urlStatus'),
  
  // Video Info
  videoInfoSection: document.getElementById('videoInfoSection'),
  videoThumbnail: document.getElementById('videoThumbnail'),
  videoTitle: document.getElementById('videoTitle'),
  videoDuration: document.getElementById('videoDuration'),
  videoUploader: document.getElementById('videoUploader'),
  
  // Download Options
  downloadSection: document.getElementById('downloadSection'),
  formatSelect: document.getElementById('formatSelect'),
  qualitySelect: document.getElementById('qualitySelect'),
  downloadBtn: document.getElementById('downloadBtn'),
  
  // Downloads List
  downloadsSection: document.getElementById('downloadsSection'),
  downloadsList: document.getElementById('downloadsList'),
  
  // History
  historySection: document.querySelector('.history-section'),
  historyList: document.getElementById('historyList'),
  toggleHistoryBtn: document.getElementById('toggleHistoryBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  
  // Templates
  downloadItemTemplate: document.getElementById('downloadItemTemplate'),
  historyItemTemplate: document.getElementById('historyItemTemplate'),
  
  // Other
  spinner: document.getElementById('spinner'),
  notification: document.getElementById('notification'),
  notificationText: document.getElementById('notificationText')
};

// ========== THEME MANAGEMENT ==========
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem(THEME_KEY, state.theme);
}

// ========== NOTIFICATION ==========
function showNotification(message, duration = 3000) {
  elements.notificationText.textContent = message;
  elements.notification.classList.add('show');
  
  setTimeout(() => {
    elements.notification.classList.remove('show');
  }, duration);
}

// ========== CLEAR INPUT ==========
function clearInput() {
  elements.videoUrl.value = '';
  elements.urlStatus.textContent = '';
  elements.videoInfoSection.style.display = 'none';
  elements.downloadSection.style.display = 'none';
  showNotification('Champ effacé');
}

// ========== URL VALIDATION ==========
async function validateUrl() {
  const url = elements.videoUrl.value.trim();
  
  if (!url) {
    showUrlStatus('Veuillez entrer une URL', 'error');
    return;
  }

  state.isValidating = true;
  elements.validateBtn.disabled = true;
  showSpinner(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showUrlStatus('✓ Lien valide', 'success');
      await fetchVideoInfo(url);
    } else {
      showUrlStatus('✗ Plateforme non supportée', 'error');
    }
  } catch (error) {
    console.error('Erreur de validation:', error);
    showUrlStatus('✗ Erreur de validation', 'error');
    showNotification('Erreur: Impossible de valider le lien');
  } finally {
    state.isValidating = false;
    elements.validateBtn.disabled = false;
    showSpinner(false);
  }
}

function showUrlStatus(message, type) {
  elements.urlStatus.textContent = message;
  elements.urlStatus.className = `url-status ${type}`;
}

// ========== FETCH VIDEO INFO ==========
async function fetchVideoInfo(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/info?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (data.success) {
      state.currentVideo = data.data;
      displayVideoInfo(data.data);
      elements.videoInfoSection.style.display = 'block';
      elements.downloadSection.style.display = 'block';
      elements.downloadsSection.style.display = 'block';
    } else {
      showNotification('Impossible de récupérer les informations vidéo');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('Erreur: Impossible de récupérer les informations');
  }
}

function displayVideoInfo(video) {
  elements.videoThumbnail.src = video.thumbnail || 'https://via.placeholder.com/320x180';
  elements.videoTitle.textContent = video.title || 'Titre inconnu';
  elements.videoDuration.textContent = `⏱️ ${formatDuration(video.duration || 0)}`;
  elements.videoUploader.textContent = `👤 ${video.uploader || 'Auteur inconnu'}`;
}

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// ========== PASTE FROM CLIPBOARD ==========
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    elements.videoUrl.value = text;
    showNotification('Lien collé');
  } catch (error) {
    console.error('Erreur de collage:', error);
    showNotification('Impossible de coller depuis le presse-papiers');
  }
}

// ========== DOWNLOAD MANAGEMENT ==========
async function startDownload() {
  const url = elements.videoUrl.value.trim();
  const format = elements.formatSelect.value;
  const quality = elements.qualitySelect.value;
  
  if (!url) {
    showNotification('Veuillez entrer une URL');
    return;
  }
  
  state.isDownloading = true;
  elements.downloadBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format, quality })
    });
    
    const data = await response.json();
    
    if (data.success) {
      const downloadId = data.downloadId;
      state.downloads.set(downloadId, data.data);
      
      // Ajouter à l'historique
      addToHistory(data.data);
      
      // Démarrer le suivi
      trackDownload(downloadId);
      
      showNotification('Téléchargement démarré');
      elements.videoUrl.value = '';
      elements.videoInfoSection.style.display = 'none';
      elements.downloadSection.style.display = 'none';
    } else {
      showNotification('Erreur: ' + data.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('Erreur lors du démarrage du téléchargement');
  } finally {
    state.isDownloading = false;
    elements.downloadBtn.disabled = false;
  }
}

function trackDownload(downloadId) {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/download/${downloadId}`);
      const data = await response.json();
      
      if (data.success) {
        const download = data.data;
        state.downloads.set(downloadId, download);
        
        // Mettre à jour l'affichage
        updateDownloadDisplay(downloadId, download);
        
        // Arrêter si le téléchargement est terminé
        if (download.status === 'completed' || download.status === 'cancelled') {
          clearInterval(interval);
          
          if (download.status === 'completed') {
            showNotification(`✓ ${download.filename} téléchargé`);
          }
        }
      }
    } catch (error) {
      console.error('Erreur de suivi:', error);
      clearInterval(interval);
    }
  }, 1000);
}

function updateDownloadDisplay(downloadId, download) {
  let item = document.querySelector(`[data-id="${downloadId}"]`);
  
  if (!item) {
    item = createDownloadItem(downloadId, download);
    elements.downloadsList.insertBefore(item, elements.downloadsList.firstChild);
  }
  
  // Mettre à jour les valeurs
  item.querySelector('.download-filename').textContent = download.filename;
  item.querySelector('.download-status').textContent = capitalizeStatus(download.status);
  item.querySelector('.download-status').className = `download-status status-${download.status}`;
  item.querySelector('.download-progress-fill').style.width = `${download.progress}%`;
  item.querySelector('.download-percentage').textContent = `${download.progress}%`;
  item.querySelector('.download-speed').textContent = `${formatSpeed(download.speed)}`;
  item.querySelector('.download-eta').textContent = `${formatEta(download.eta)}`;
  
  // Mettre à jour les boutons
  const pauseBtn = item.querySelector('.btn-pause');
  const resumeBtn = item.querySelector('.btn-resume');
  
  if (download.status === 'paused') {
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'block';
  } else if (download.status === 'downloading') {
    pauseBtn.style.display = 'block';
    resumeBtn.style.display = 'none';
  }
}

function createDownloadItem(downloadId, download) {
  const template = elements.downloadItemTemplate.content.cloneNode(true);
  const item = template.querySelector('.download-item');
  
  item.setAttribute('data-id', downloadId);
  
  // Event listeners
  template.querySelector('.btn-pause').addEventListener('click', () => pauseDownload(downloadId));
  template.querySelector('.btn-resume').addEventListener('click', () => resumeDownload(downloadId));
  template.querySelector('.btn-cancel').addEventListener('click', () => cancelDownload(downloadId));
  template.querySelector('.btn-share').addEventListener('click', () => shareDownload(downloadId));
  
  return item;
}

function capitalizeStatus(status) {
  const statuses = {
    'downloading': '⬇️ Téléchargement',
    'completed': '✓ Terminé',
    'paused': '⏸️ En pause',
    'cancelled': '✖️ Annulé'
  };
  return statuses[status] || status;
}

function formatSpeed(speed) {
  if (!speed) return '0 MB/s';
  if (speed > 1024 * 1024) {
    return `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
  } else if (speed > 1024) {
    return `${(speed / 1024).toFixed(1)} KB/s`;
  } else {
    return `${speed.toFixed(0)} B/s`;
  }
}

function formatEta(seconds) {
  if (!seconds || seconds < 0) return 'Calcul...';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
}

async function pauseDownload(downloadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${downloadId}/pause`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.success) {
      showNotification('Téléchargement en pause');
    }
  } catch (error) {
    showNotification('Erreur lors de la mise en pause');
  }
}

async function resumeDownload(downloadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${downloadId}/resume`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.success) {
      showNotification('Téléchargement repris');
    }
  } catch (error) {
    showNotification('Erreur lors de la reprise');
  }
}

async function cancelDownload(downloadId) {
  if (!confirm('Êtes-vous sûr de vouloir annuler ce téléchargement?')) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${downloadId}/cancel`, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.success) {
      showNotification('Téléchargement annulé');
      // Retirer de la liste
      const item = document.querySelector(`[data-id="${downloadId}"]`);
      if (item) item.remove();
    }
  } catch (error) {
    showNotification('Erreur lors de l\'annulation');
  }
}

function shareDownload(downloadId) {
  const download = state.downloads.get(downloadId);
  if (!download) return;
  
  if (navigator.share) {
    navigator.share({
      title: 'Assane Downloader',
      text: `J\'ai téléchargé: ${download.filename}`,
      url: window.location.href
    }).catch(err => console.error('Erreur de partage:', err));
  } else {
    showNotification('Partage non supporté sur ce navigateur');
  }
}

// ========== HISTORY MANAGEMENT ==========
function addToHistory(download) {
  const historyItem = {
    id: download.id,
    filename: download.filename,
    format: download.format,
    quality: download.quality,
    timestamp: new Date().toLocaleString('fr-FR')
  };
  
  state.history.unshift(historyItem);
  
  // Limiter à 100 éléments
  if (state.history.length > 100) {
    state.history.pop();
  }
  
  saveHistory();
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
}

function loadHistory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state.history = JSON.parse(saved);
    } catch (error) {
      console.error('Erreur de chargement de l\'historique:', error);
      state.history = [];
    }
  }
}

function displayHistory() {
  elements.historyList.innerHTML = '';
  
  if (state.history.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-state"><p>Aucun téléchargement encore</p></div>';
    return;
  }
  
  state.history.forEach(item => {
    const template = elements.historyItemTemplate.content.cloneNode(true);
    const historyItem = template.querySelector('.history-item');
    
    historyItem.setAttribute('data-id', item.id);
    template.querySelector('.history-filename').textContent = `📁 ${item.filename}`;
    template.querySelector('.history-time').textContent = item.timestamp;
    
    template.querySelector('.btn-delete').addEventListener('click', () => deleteHistory(item.id));
    
    elements.historyList.appendChild(template);
  });
}

function deleteHistory(id) {
  state.history = state.history.filter(item => item.id !== id);
  saveHistory();
  displayHistory();
  showNotification('Historique supprimé');
}

function clearAllHistory() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique?')) return;
  
  state.history = [];
  saveHistory();
  displayHistory();
  showNotification('Historique vidé');
}

// ========== UTILITIES ==========
function showSpinner(show) {
  elements.spinner.style.display = show ? 'block' : 'none';
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.pasteBtn.addEventListener('click', pasteFromClipboard);
  elements.clearBtn.addEventListener('click', clearInput);
  elements.validateBtn.addEventListener('click', validateUrl);
  elements.downloadBtn.addEventListener('click', startDownload);
  elements.toggleHistoryBtn.addEventListener('click', () => {
    const isHidden = elements.historyList.style.display === 'none';
    elements.historyList.style.display = isHidden ? 'block' : 'none';
    elements.toggleHistoryBtn.textContent = isHidden ? 'Masquer' : 'Afficher';
  });
  elements.clearHistoryBtn.addEventListener('click', clearAllHistory);
  
  // Enter pour valider
  elements.videoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validateUrl();
  });
}

// ========== INITIALIZATION ==========
function initialize() {
  initializeTheme();
  loadHistory();
  displayHistory();
  setupEventListeners();
  
  console.log('🚀 Assane Downloader initialized');
}

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
