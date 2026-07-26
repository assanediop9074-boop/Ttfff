# 🚀 Guide de Déploiement Complet

## 1. Déploiement sur Render

### A. Backend (API Node.js)

#### Étape 1: Préparer le projet
1. Vérifiez que `backend/package.json` existe
2. Assurez-vous que `backend/server.js` est le fichier principal
3. Vérifiez le `Dockerfile` est correct

#### Étape 2: Créer le service sur Render
1. Allez sur [render.com](https://render.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New +" → "Web Service"
4. Sélectionnez le dépôt `Ttfff`

#### Étape 3: Configurer le service
```
Name: Assane-Downloader-API
Environment: Node
Region: Ohio (ou votre préférence)
Branch: assanedown
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Plan: Free
```

#### Étape 4: Variables d'environnement
```
NODE_ENV = production
PORT = 10000
```

#### Étape 5: Attendre le déploiement
- Consultez les logs pour les erreurs
- Une fois déployé, notez l'URL (ex: https://assanedown-api.onrender.com)

### B. Frontend (Application Web)

#### Option 1: Deployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez le dépôt `Ttfff`
5. Configuration:
   - Root Directory: `frontend`
   - Framework: None (HTML/CSS/JS)
   - Build Command: (laisser vide)

#### Option 2: Deployer sur Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New site from Git"
4. Sélectionnez le dépôt
5. Configuration:
   - Base directory: `frontend`
   - Build command: (laisser vide)
   - Publish directory: `frontend`

#### Option 3: Deployer sur Render (Static)
1. Allez sur [render.com](https://render.com)
2. Cliquez sur "New +" → "Static Site"
3. Configuration:
   - Build Command: (laisser vide)
   - Publish Directory: `frontend`

### C. Configurer l'URL de l'API

Après le déploiement du backend, mettez à jour le frontend:

**Option 1: Variable d'environnement**
```bash
REACT_APP_API_BASE_URL=https://assanedown-api.onrender.com
```

**Option 2: Modifier directement dans le code**
Dans `frontend/script.js`:
```javascript
const API_BASE_URL = 'https://assanedown-api.onrender.com';
```

## 2. Déploiement avec Docker

### A. Build l'image Docker
```bash
docker build -f backend/Dockerfile -t assanedown-api .
```

### B. Lancer le conteneur
```bash
docker run -p 5000:10000 -e NODE_ENV=production assanedown-api
```

### C. Docker Compose (optionnel)
```bash
docker-compose up
```

## 3. Configuration des domaines personnalisés

### Sur Render
1. Allez dans les paramètres du service
2. Allez à "Custom Domain"
3. Entrez votre domaine
4. Suivez les instructions DNS

## 4. Monitoring et Maintenance

### Vérifier l'état de l'API
```bash
curl https://assanedown-api.onrender.com/api/health
```

### Logs
- **Render**: Dashboard → Logs
- **Vercel**: Deployments → View Logs
- **Netlify**: Deploys → View deploy log

### Redémarrer les services
- **Render**: Manual Restart dans les paramètres
- **Vercel/Netlify**: Redéployer le projet

## 5. Optimisations

### Performance
- Activer gzip compression dans Express
- Utiliser un CDN pour les assets statiques
- Implémenter le caching

### Sécurité
- Activer HTTPS (automatique sur Render/Vercel)
- Configurer CORS correctement
- Valider tous les inputs
- Implémenter rate limiting (déjà activé)

### Scalabilité
- Passer du plan Free au plan Paid si nécessaire
- Utiliser une base de données (MongoDB/PostgreSQL)
- Implémenter le caching (Redis)

## 6. Troubleshooting

### Le service ne démarre pas
```bash
# Vérifiez les logs
render logs --service-id=YOUR_SERVICE_ID

# Vérifiez que package.json existe
ls -la backend/package.json

# Testez localement
cd backend && npm install && npm start
```

### CORS Errors
Assurez-vous que `backend/server.js` contient:
```javascript
app.use(cors());
```

### Les téléchargements ne fonctionnent pas
- Vérifiez que yt-dlp est installé dans le Dockerfile
- Vérifiez que FFmpeg est disponible
- Vérifiez les logs du backend

## 7. Mise à jour du code

1. Faites un commit sur la branche `assanedown`
2. Push les changements:
   ```bash
   git push origin assanedown
   ```
3. Render/Vercel/Netlify redéploient automatiquement

## 8. Checklist de déploiement

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel/Netlify/Render
- [ ] URL de l'API configurée correctement
- [ ] Tests de téléchargement fonctionnent
- [ ] Notifications s'affichent
- [ ] Mode sombre fonctionne
- [ ] Historique est persistant
- [ ] Téléchargement des fichiers fonctionne
