@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%
cd /d C:\claude_code\ideabrowser-replica\android
call gradlew.bat assembleDebug
echo.
echo APK Location:
dir /s /b app\build\outputs\apk\debug\*.apk 2>nul
pause
