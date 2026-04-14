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
- Siempre intenta levantar primero `LeagueManager.Api` con:
  - `ASPNETCORE_ENVIRONMENT=Development`
  - `dotnet restore`
  - `dotnet run --launch-profile https`
- Si encuentra `League-manager-web/package.json`, también levanta frontend con `npm install && npm run dev`.
- Si no hay frontend, continúa únicamente con backend.

## Nota HTTPS
- Se agregó `LeagueManager.Api/Properties/launchSettings.json` con perfiles `https` y `http`.
- El launcher usa el perfil `https` para evitar el warning de `Failed to determine the https port for redirect`.
