JAR=target/scala-2.10/climate-service-assembly-0.1-SNAPSHOT.jar

zip -d $JAR META-INF/ECLIPSEF.RSA
zip -d $JAR META-INF/ECLIPSEF.SF

spark-submit \
--class climate.ingest.NEXIngest \
--conf spark.executor.memory=2g --master local[3] --driver-memory=4g \
--driver-library-path /usr/local/lib \
$JAR \
--instance gis --user root --password secret --zookeeper localhost \
--crs EPSG:3857 \
--input file:/Users/rob/proj/climate/data/fossdem/tile_export/ensemble-rcp85/import \
--clobber true \
--pyramid false \
--layerName ensemble-rcp85 \
--table fossdem_ensemble

