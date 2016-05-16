@echo off
set CLASSPATH=%classpath%;%muduscompile%

setlocal

::----------------------------------
::@file-type: bat 
::@author: Ifeora Okechukwu
::@create_at: 2015/09/04
::----------------------------------


:: flag for cli initilization
set /a ISREADY=0
set TARGET=%~nx0

:: OPTIONS set via arithmetic switch /a
set OPTIONS=nul



if /I "%~1" == "--generate" GOTO compiler
if /I "%~1" == "create" GOTO shellinstance
if    "%~1" == "" GOTO info
if /I "%~1" == "--help" GOTO help
if /I "%~1" == "-help" GOTO help
if /I "%~1" == "--?" GOTO help
if /I "%~1" == "\?" GOTO help
if /I "%~1" == "--clear" GOTO clear
if /I "%~1" == "--options" GOTO options


:compiler
  set compilr="%~dp0MudusCompiler.class"
      if exist %compilr% (
           ::echo %compilr%
           :: java -cp %~dp0 MudusCompiler < %*
           java MudusCompiler < %2 %2 %3 %4
         
      ) else (
           echo %TARGET%: [error] - compilation file not found.
           call :options "-"
      )
goto end

:info
  echo No commmand recieved by Mudus Generator 
  echo.
  echo Run Help for more details: mudus --help
goto end

:clear
  set CLEAR="--clear"
goto end

:options
  set /p OPTIONS=Enter Options for Script Generation: 
  if "%OPTIONS%" == "#clear" goto clear
  ::echo %*
goto end

:help
 echo.
 echo Mudus is a simple JavaScript module compiler built for ease.
 echo.
 echo USAGE:
 echo mudus [--generate [source-file] -o [destination-file]] [--help -help] [--clear] [--options]
 echo.
 echo --generate :This compiles all your JavaScript module files into a transport format following all require paths
 echo.
 echo --help -help :This lists out the HELP details.
 echo.
 echo --clear :This clears the state of the compiler stack in processsing.
 echo.
 echo --options :This is used to pass off processing options.
 echo.
goto end


:shellinstance
  if "%ISREADY%" EQU "0" (
     set ISREADY=1
     cls 
     title Mudus Generator command prompt
     color 09
     echo.
     echo  Mudus Generator Command Line Interface [v1.0.0.0]
     for /f "tokens=*": %%g in ( 'date /T' ) do (
       set date=%%g
     )
     echo  %date%
     echo  %USERNAME% @%COMPUTERNAME%
     pushd %USERPROFILE% :: cd command previously used
     echo.
  ) 
goto end

:end

 ::cd /d %cd%\docl
 ::echo.echo %cd%
 ::pushd %lpath%
 ::for /L %%i in (1,1,20) do (
 ::   echo %%i
 ::)
 ::for %%r in (%*) do (
 ::   echo %%r
 ::)
 ::echo %* >> %~dp0%6.txt
 ::if "%errorlevel%" EQU "0" echo Jaloo!
 exit /B %errorlevel%

endlocal
