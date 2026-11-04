# Revient à l'ancien site : arrête le site « mediasoft-site » et le chatbot, redémarre le site arrêté par installer.ps1.
# A lancer dans PowerShell « en tant qu'administrateur », depuis le dossier du paquet : .\restaurer.ps1
param([string]$NomSite = "mediasoft-site")
$ErrorActionPreference = "Stop"
$ici = Split-Path -Parent $MyInvocation.MyCommand.Path
Import-Module WebAdministration
Stop-Website -Name $NomSite -ErrorAction SilentlyContinue
Stop-ScheduledTask -TaskName "Mediasoft Chatbot" -ErrorAction SilentlyContinue
Disable-ScheduledTask -TaskName "Mediasoft Chatbot" -ErrorAction SilentlyContinue | Out-Null
Get-NetTCPConnection -LocalPort 8010 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
if (Test-Path "$ici\ancien-site.txt") {
    foreach ($s in (Get-Content "$ici\ancien-site.txt" -Encoding UTF8).Split("|")) {
        if ($s) { Start-Website -Name $s; Write-Host "Site « $s » redémarré" -ForegroundColor Green }
    }
}
Write-Host "Site « $NomSite » et chatbot arrêtés." -ForegroundColor Green
