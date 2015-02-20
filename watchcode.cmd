@echo off
:loop
call grunt screeps
echo  
watch dist\*.js
goto loop;
