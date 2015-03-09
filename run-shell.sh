JAR=service/target/scala-2.10/climate-service-assembly-0.1-SNAPSHOT.jar

zip -d $JAR META-INF/ECLIPSEF.RSA
zip -d $JAR META-INF/ECLIPSEF.SF

spark-shell \
--conf spark.executor.memory=8g --master local[4] \
--driver-library-path /usr/local/lib \
--jars $JAR


