@echo off
set GIT_EXE=C:\Users\AHMED\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe
"%GIT_EXE%" init
"%GIT_EXE%" add .
"%GIT_EXE%" config user.name "Ahmed"
"%GIT_EXE%" config user.email "ahmed@example.com"
"%GIT_EXE%" commit -m "Initial commit with project files"
"%GIT_EXE%" branch -M main
"%GIT_EXE%" remote add origin https://github.com/ahmed-wdhdz/lamsadz-platform.git
"%GIT_EXE%" push -u origin main --force
