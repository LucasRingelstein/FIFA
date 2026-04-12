param(
    [switch]$BackendOnly
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiPath = Join-Path $root 'LeagueManager.Api'
$webPath = Join-Path $root 'League-manager-web'

Write-Host '== League Manager: Dev Launcher ==' -ForegroundColor Cyan

if (-not (Test-Path $apiPath)) {
    throw "No se encontró carpeta backend: $apiPath"
}

# Backend
Write-Host 'Iniciando backend (.NET API)...' -ForegroundColor Green
Start-Process -FilePath 'powershell' -ArgumentList @('-NoExit','-Command',"Set-Location '$apiPath'; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet restore; dotnet run --launch-profile https") | Out-Null


if ($BackendOnly) {
    Write-Host 'BackendOnly activo: no se intentará levantar frontend.' -ForegroundColor Yellow
    exit 0
}

# Frontend opcional
if ((Test-Path $webPath) -and (Test-Path (Join-Path $webPath 'package.json'))) {
    Write-Host 'Frontend detectado. Iniciando Vite...' -ForegroundColor Green
    Start-Process -FilePath 'powershell' -ArgumentList @('-NoExit','-Command',"Set-Location '$webPath'; npm install; npm run dev") | Out-Null
}
else {
    Write-Host 'Frontend no encontrado. Solo backend iniciado.' -ForegroundColor Yellow
}

Write-Host 'Listo. Revisá las dos terminales nuevas.' -ForegroundColor Cyan
