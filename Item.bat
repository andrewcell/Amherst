@echo off
@color E
@title ������ ������
set CLASSPATH=.;dist\WhiteStar.jar;dist\lib\*
java -server -Dnet.sf.odinms.wzpath=wz/ tools.wztosql.DumpItems
pause