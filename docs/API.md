# 📖 Documentation API

## Base URL
```
http://localhost:5000/api
Prod: https://assanedown-api.onrender.com/api
```

## Endpoints

### 1. Health Check
**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok",
  "message": "AssaneDown API is running",
  "environment": "production",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Valider un Lien
**Endpoint**: `POST /api/validate`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Lien valide",
  "supported": true
}
```

### 3. Obtenir les Informations Vidéo
**Endpoint**: `GET /api/info?url={URL}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Video Title",
    "duration": 320,
    "thumbnail": "https://...",
    "formats": [
      {
        "format_id": "22",
        "format": "720p",
        "ext": "mp4",
        "filesize": 52428800
      }
    ],
    "uploader": "Channel Name",
    "upload_date": "20240101"
  }
}
```

### 4. Démarrer un Téléchargement
**Endpoint**: `POST /api/download`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "720"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Téléchargement démarré",
  "downloadId": "uuid",
  "data": {
    "id": "uuid",
    "status": "downloading",
    "progress": 0,
    "filename": "video_uuid.mp4"
  }
}
```

### 5. Obtenir l'État du Téléchargement
**Endpoint**: `GET /api/download/{id}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "downloading",
    "progress": 45,
    "speed": 1024000,
    "eta": 120,
    "filename": "video_uuid.mp4",
    "downloadedSize": 45000000,
    "fileSize": 100000000
  }
}
```

### 6. Mettre en Pause
**Endpoint**: `POST /api/download/{id}/pause`

### 7. Reprendre
**Endpoint**: `POST /api/download/{id}/resume`

### 8. Annuler
**Endpoint**: `POST /api/download/{id}/cancel`

### 9. Obtenir l'Historique
**Endpoint**: `GET /api/history?limit=50&offset=0`

**Response**:
```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

### 10. Supprimer un Historique
**Endpoint**: `DELETE /api/history/{id}`

### 11. Vider tout l'Historique
**Endpoint**: `DELETE /api/history`

## Codes d'Erreur

- `200`: OK
- `400`: Bad Request
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Server Error

## Rate Limiting

- Limit: 100 requêtes par 15 minutes
- Header: `X-RateLimit-Limit`
