# 🎬 Assane Downloader - Dépôt GitHub Complet

## 📋 Structure du Projet

```
AssaneDownloader/
├── frontend/
│   ├── index.html          # Page HTML principale
│   ├── style.css           # Feuille de styles CSS
│   ├── script.js           # JavaScript côté client
│   ├── manifest.json       # PWA manifest
│   └── .env.production     # Variables d'environnement production
├── backend/
│   ├── server.js           # Serveur Express
│   ├── package.json        # Dépendances Node.js
│   ├── Dockerfile          # Configuration Docker
│   ├── validator.js        # Validation des URLs (optionnel)
│   ├── downloader.js       # Logique de téléchargement (optionnel)
│   └── history.js          # Gestion de l'historique (optionnel)
├── docs/
│   ├── API.md              # Documentation API
│   ├── INSTALLATION.md     # Guide d'installation
│   ├── DEPLOYMENT.md       # Guide de déploiement
│   └── FEATURES.md         # Liste des fonctionnalités
├── .github/
│   └── workflows/          # GitHub Actions workflows (optionnel)
├── .gitignore              # Fichiers à ignorer
├── README.md               # Documentation principale
├── LICENSE                 # Licence MIT
├── docker-compose.yml      # Docker Compose (optionnel)
└── render.yaml             # Configuration Render
```

## 🚀 Démarrage Rapide

### Frontend
```bash
cd frontend
# Ouvrir dans le navigateur
open index.html
# Ou utiliser un serveur local
python -m http.server 8000
```

### Backend
```bash
cd backend
npm install
node server.js
```

## 📦 Installation Complète

### Prérequis
- Node.js 14+
- npm ou yarn
- Python 3.6+ (optionnel, pour yt-dlp)

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/assanediop9074-boop/Ttfff.git
   cd Ttfff
   git checkout assanedown
   ```

2. **Installer les dépendances backend**
   ```bash
   cd backend
   npm install
   ```

3. **Démarrer le développement**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   python -m http.server 8000
   ```

4. **Accéder à l'application**
   - Frontend: http://localhost:8000
   - API: http://localhost:5000/api/health

## 🌐 Déploiement sur Render

### Backend
1. Aller sur [render.com](https://render.com)
2. Créer un nouveau Web Service
3. Connecter le dépôt GitHub
4. Configuration:
   - **Branch**: assanedown
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js

### Frontend
1. Déployer sur Vercel/Netlify:
   - Connecter le dépôt
   - Base directory: `frontend`
   - Mettre à jour l'API_BASE_URL

## 🎨 Fonctionnalités

### ✅ Téléchargement
- 📥 Support multi-plateforme (YouTube, TikTok, Instagram, Facebook, Twitter, etc.)
- 🎵 Téléchargement en MP3 et MP4
- 🎞️ Sélection de qualité (360p, 720p, 1080p+)
- ⚡ Barre de progression avec pourcentage, vitesse et temps restant
- ⏸️ Pause, reprise et annulation des téléchargements

### 🎨 Interface
- 🌙 Mode sombre et clair avec persistance
- 📋 Collage automatique du lien (Clipboard API)
- ✖️ Bouton effacer pour supprimer le champ
- 🖼️ Affichage de la miniature et des informations
- 📱 Design responsive (mobile-first)

### 📊 Gestion
- 📜 Historique des téléchargements (localStorage)
- 📂 Accès au dossier Downloads
- 📤 Partage des fichiers (Share API)
- 🔎 Vérification automatique du lien
- 📞 Notifications en temps réel (Toast)

## 🔧 Configuration

### Variables d'environnement Backend
```env
NODE_ENV=production
PORT=10000
```

### Variables d'environnement Frontend
```env
REACT_APP_API_BASE_URL=https://assanedown-api.onrender.com
```

## 📚 Documentation

- [📖 API Documentation](./docs/API.md)
- [🔧 Installation Guide](./docs/INSTALLATION.md)
- [🚀 Deployment Guide](./docs/DEPLOYMENT.md)
- [✨ Features List](./docs/FEATURES.md)

## 🐛 Troubleshooting

### Le téléchargement ne démarre pas?
- Vérifiez que le lien est valide
- Assurez-vous que le backend fonctionne
- Vérifiez les logs du navigateur (F12)

### CORS Errors?
- Vérifiez la configuration CORS dans `backend/server.js`
- Assurez-vous que l'URL du frontend est autorisée

### Les notifications ne s'affichent pas?
- Autorisez les notifications du navigateur
- Vérifiez les paramètres du système

## 🤝 Contribution

Les contributions sont les bienvenues! Veuillez:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Assane Diop** - [@assanediop9074-boop](https://github.com/assanediop9074-boop)

## 🙏 Remerciements

- Inspiré par SnapTik et d'autres applications de téléchargement vidéo
- Merci à la communauté open source
- Merci aux utilisateurs pour leurs retours!

## 📞 Support

- 📧 Email: [your-email@example.com]
- 💬 Issues: [GitHub Issues](https://github.com/assanediop9074-boop/Ttfff/issues)
- 🌐 Site Web: [À venir]

---

**Fait avec ❤️ pour les amateurs de vidéos**

⭐ N'oubliez pas de star le projet si vous l'aimez!
