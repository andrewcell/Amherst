export JAR=dist/Amherst.jar
java -Xms1500m -Xmx3000m -cp $JAR -Dnashorn.args="--no-deprecation-warning" -Dfile.encoding="UTF8" -server server.Start

