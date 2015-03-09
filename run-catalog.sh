JAR=service/target/scala-2.10/climate-service-assembly-0.1-SNAPSHOT.jar

zip -d $JAR META-INF/ECLIPSEF.RSA
zip -d $JAR META-INF/ECLIPSEF.SF

spark-submit \
--class climate.rest.CatalogService \
--conf spark.executor.memory=8g --master local[4] --driver-memory=2g \
$JAR \
--instance gis --user root --password secret --zookeeper localhost \

