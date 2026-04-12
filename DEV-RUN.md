# Levantar entorno de desarrollo (backend + frontend opcional)

## Windows (PowerShell)
```powershell
./start-dev.ps1
```

Si querés solo backend:
```powershell
./start-dev.ps1 -BackendOnly
```

## Linux/macOS (bash)
```bash
./start-dev.sh
```

## Comportamiento
- Siempre intenta levantar primero `LeagueManager.Api` con `dotnet restore && dotnet run`.
- Si encuentra `League-manager-web/package.json`, también levanta frontend con `npm install && npm run dev`.
- Si no hay frontend, continúa únicamente con backend.
