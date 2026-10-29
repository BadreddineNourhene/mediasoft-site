@echo off
title Site Mediasoft - version creative
cd /d "%~dp0"
set NODE=C:\Users\NOURHENE\AppData\Local\Programs\node-v24.20.0-win-x64\node.exe
if not exist "%NODE%" set NODE=node
start "" http://127.0.0.1:3300/
echo Site Mediasoft (version creative) : http://127.0.0.1:3300/
echo Fermez cette fenetre pour arreter le site.
"%NODE%" scripts\serve-out.mjs 3300
pause
