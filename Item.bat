@echo off
@color E
@title 아이템 덤프기
set CLASSPATH=.;dist\WhiteStar.jar;dist\lib\*
java -server -Dnet.sf.odinms.wzpath=wz/ tools.wztosql.DumpItems
pause