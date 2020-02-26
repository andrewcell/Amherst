@echo off
TITLE Amherst Starter
set CLASSPATH=.;dist\*;dist\lib\*

:gogo
java -version
java -Xms1500m -Xmx3000m -Dorg.whitestar.gateway_ip="10.0.0.1" -Dfile.encoding="UTF8" -Dwhitestar.servertype="old" -server server.Start
ping 10.0.0.1 -n 2 > nul
goto gogo
