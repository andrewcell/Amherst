@echo off
TITLE Amherst Starter
set CLASSPATH=.;dist\*;dist\lib\*

:gogo
java -version
java -Xms1500m -Xmx3000m -Dnashorn.args="--no-deprecation-warning" -Dfile.encoding="UTF8" -server server.Start
ping 10.0.0.1 -n 2 > nul
goto gogo
