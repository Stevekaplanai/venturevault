@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME is: %JAVA_HOME%
echo.
echo Building APK...
pushd "C:\claude_code\ideabrowser-replica\android"
call "C:\claude_code\ideabrowser-replica\android\gradlew.bat" assembleDebug
echo.
echo Build complete! APK location:
dir /s /b "C:\claude_code\ideabrowser-replica\android\app\build\outputs\apk\debug\*.apk" 2>nul
popd
