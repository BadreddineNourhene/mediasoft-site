# Installe le nouveau site Mediasoft et son chatbot sur ce serveur IIS.
# Le site est un site IIS à part (« mediasoft-site », dossier C:\mediasoft-site) qui reprend les liaisons du domaine
# (http et https) du site actuel, arrêté au préalable : les fichiers de ce dernier (C:\publish) ne sont pas touchés.
# A lancer dans PowerShell ouvert « en tant qu'administrateur », depuis le dossier du paquet :
#     Set-ExecutionPolicy -Scope Process Bypass -Force
#     .\installer.ps1
# Relancer le même script installe une nouvelle version.
param(
    [string]$Domaine = "mediasoft.helpdesk-ms.com",
    [string]$NomSite = "mediasoft-site",
    [string]$DossierSite = "C:\mediasoft-site",
    [string]$DossierChatbot = "C:\mediasoft-chatbot"
)
$ErrorActionPreference = "Stop"
$ici = Split-Path -Parent $MyInvocation.MyCommand.Path
$tache = "Mediasoft Chatbot"
Import-Module WebAdministration
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Etape($texte) { Write-Host "`n=== $texte" -ForegroundColor Cyan }
function Arret($texte) { Write-Host "`nARRÊT : $texte" -ForegroundColor Red; exit 1 }

# ---------------------------------------------------------------- 1. Vérifications (rien n'est encore modifié)
Etape "1/7 Vérifications"
$inetsrv = "$env:windir\System32\inetsrv"
if (-not (Test-Path "$inetsrv\rewrite.dll")) {
    Arret "module IIS « URL Rewrite » absent. Installez-le : https://www.iis.net/downloads/microsoft/url-rewrite puis relancez."
}
# ARR s'installe dans %ProgramFiles%\IIS\Application Request Routing : on demande à IIS s'il est chargé
if (-not (Get-WebGlobalModule | Where-Object Name -like "*RequestRouting*")) {
    Arret "module IIS « Application Request Routing » absent (relais du chatbot). Installez-le (voir LISEZMOI.txt) puis relancez."
}
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python -or $python.Source -like "*WindowsApps*") {
    Arret "Python absent. Installez Python 3.12 ou plus récent (https://www.python.org/downloads/windows/, « Windows installer 64-bit ») en cochant « Add python.exe to PATH » et « Install for all users », puis rouvrez PowerShell et relancez."
}
& python -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"
if ($LASTEXITCODE -ne 0) { Arret "Python trop ancien ($(& python --version)) : version 3.10 ou plus récente requise." }
Write-Host "Modules IIS et $(& python --version) : OK"

# Site qui porte aujourd'hui le domaine (hors le nôtre) : il doit être arrêté, ses liaisons sont reprises
$ancien = Get-Website | Where-Object { $_.Name -ne $NomSite -and ($_.Bindings.Collection.bindingInformation -like "*:$Domaine") }
$ancien | ForEach-Object {
    if ($_.State -eq "Started") { Arret "le site IIS « $($_.Name) » est démarré et utilise $Domaine. Arrêtez-le dans le Gestionnaire IIS puis relancez." }
}
$liaisons = @()
foreach ($s in @($ancien) + @(Get-Website | Where-Object Name -eq $NomSite)) {
    foreach ($b in $s.Bindings.Collection) {
        if ($b.bindingInformation -like "*:$Domaine" -and -not ($liaisons | Where-Object { $_.bindingInformation -eq $b.bindingInformation -and $_.protocol -eq $b.protocol })) {
            $liaisons += @{ protocol = $b.protocol; bindingInformation = $b.bindingInformation; sslFlags = $b.sslFlags }
        }
    }
}
if (-not $liaisons) { $liaisons = @(@{ protocol = "http"; bindingInformation = "*:80:$Domaine"; sslFlags = 0 }) }
Write-Host "Ancien site arrêté : $(($ancien | ForEach-Object Name) -join ', ')"
Write-Host "Liaisons reprises : $(($liaisons | ForEach-Object { "$($_.protocol) $($_.bindingInformation)" }) -join ' ; ')"
if (-not ($liaisons | Where-Object protocol -eq "https")) {
    Write-Host "ATTENTION : aucune liaison https pour $Domaine (le site sera en http). Ajoutez le certificat ensuite dans IIS > Liaisons." -ForegroundColor Yellow
}

# ---------------------------------------------------------------- 2. Chatbot : fichiers et dépendances Python
Etape "2/7 Chatbot : copie et dépendances (premier lancement : quelques minutes)"
Stop-ScheduledTask -TaskName $tache -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8010 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
robocopy "$ici\chatbot" $DossierChatbot /MIR /XD venv logs /R:1 /W:1 /NFL /NDL /NJH /NP | Out-Null
if ($LASTEXITCODE -ge 8) { Arret "copie du chatbot impossible (robocopy $LASTEXITCODE)." }
$venv = "$DossierChatbot\venv\Scripts\python.exe"
if (-not (Test-Path $venv)) { & python -m venv "$DossierChatbot\venv" }
& $venv -m pip install --quiet --upgrade pip
& $venv -m pip install --quiet -r "$DossierChatbot\requirements.txt"
if ($LASTEXITCODE -ne 0) { Arret "installation des dépendances Python impossible (le serveur a-t-il accès à Internet ?)." }

# ---------------------------------------------------------------- 3. Chatbot : démarrage automatique (tâche planifiée)
Etape "3/7 Chatbot : démarrage automatique avec Windows"
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$DossierChatbot\demarrer-chatbot.cmd`"" -WorkingDirectory $DossierChatbot
$reglages = New-ScheduledTaskSettingsSet -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit ([TimeSpan]::Zero) -StartWhenAvailable -AllowStartIfOnBatteries
Register-ScheduledTask -TaskName $tache -Action $action -Trigger (New-ScheduledTaskTrigger -AtStartup) -Settings $reglages `
    -User "SYSTEM" -RunLevel Highest -Force | Out-Null
Enable-ScheduledTask -TaskName $tache | Out-Null
Start-ScheduledTask -TaskName $tache
$pret = $false
for ($i = 0; $i -lt 60 -and -not $pret; $i++) {
    Start-Sleep -Seconds 3
    try { $pret = (Invoke-WebRequest "http://127.0.0.1:8010/api/health" -UseBasicParsing -TimeoutSec 5).StatusCode -eq 200 } catch {}
}
if (-not $pret) { Arret "le chatbot ne démarre pas. Voir le journal : $DossierChatbot\logs\chatbot.log (aucun site n'a encore été modifié)." }
Write-Host "Chatbot en marche sur 127.0.0.1:8010"

# ---------------------------------------------------------------- 4. IIS : relais /api vers le chatbot
Etape "4/7 IIS : relais /api vers le chatbot"
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/proxy" -Name "enabled" -Value $true
# Article détaillé : jusqu'à 2 minutes de rédaction
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/proxy" -Name "timeout" -Value "00:03:00"

# ---------------------------------------------------------------- 5. Fichiers du site
Etape "5/7 Fichiers du site ($DossierSite)"
robocopy "$ici\site" $DossierSite /MIR /R:2 /W:2 /NFL /NDL /NJH /NP | Out-Null
if ($LASTEXITCODE -ge 8) { Arret "copie du site incomplète (robocopy $LASTEXITCODE)." }

# ---------------------------------------------------------------- 6. Site IIS (création au premier lancement)
Etape "6/7 Site IIS « $NomSite »"
if (-not (Test-Path "IIS:\AppPools\$NomSite")) {
    New-WebAppPool -Name $NomSite | Out-Null
    Set-ItemProperty "IIS:\AppPools\$NomSite" -Name managedRuntimeVersion -Value ""  # site statique : pas de .NET
}
if (-not (Get-Website | Where-Object Name -eq $NomSite)) {
    New-Item "IIS:\Sites\$NomSite" -PhysicalPath $DossierSite -Bindings $liaisons | Out-Null
} else {
    Set-ItemProperty "IIS:\Sites\$NomSite" -Name physicalPath -Value $DossierSite
    Set-ItemProperty "IIS:\Sites\$NomSite" -Name bindings -Value $liaisons
}
Set-ItemProperty "IIS:\Sites\$NomSite" -Name applicationPool -Value $NomSite
Start-Website -Name $NomSite
Set-Content -Path "$ici\ancien-site.txt" -Value (($ancien | ForEach-Object Name) -join "|") -Encoding UTF8
Write-Host "Site « $NomSite » démarré"

$php = Get-WebHandler -PSPath "IIS:\Sites\$NomSite" | Where-Object { $_.Path -like "*.php" }
if (-not $php) {
    Write-Host "ATTENTION : PHP n'est pas installé dans IIS. Le site fonctionne, mais le formulaire de contact (/site/send.php) n'enverra pas de message tant que PHP n'est pas installé." -ForegroundColor Yellow
}

# ---------------------------------------------------------------- 7. Contrôle final
Etape "7/7 Contrôle"
$schema = if ($liaisons | Where-Object protocol -eq "https") { "https" } else { "http" }
foreach ($url in @("${schema}://$Domaine/", "${schema}://$Domaine/api/health")) {
    try {
        $code = (Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 20).StatusCode
        Write-Host "$url : $code" -ForegroundColor Green
    } catch {
        Write-Host "$url : ÉCHEC ($($_.Exception.Message))" -ForegroundColor Red
    }
}
Write-Host "`nTerminé. Ouvrez ${schema}://$Domaine/ (Ctrl+F5). Revenir à l'ancien site : .\restaurer.ps1" -ForegroundColor Cyan
