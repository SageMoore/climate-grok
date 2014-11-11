package climate.op

import com.quantifind.sumac.ArgMain
import geotrellis.raster.op.local._
import geotrellis.raster._

import geotrellis.spark._
import geotrellis.spark.cmd.args._
import geotrellis.spark.io.accumulo._
import geotrellis.spark.io.hadoop._
import geotrellis.spark.io.hadoop.formats.NetCdfBand
import geotrellis.spark.tiling._
import org.apache.accumulo.core.client.security.tokens.PasswordToken
import org.apache.hadoop.fs.Path
import org.apache.spark._
import org.apache.spark.rdd.PairRDDFunctions
import org.joda.time.DateTime

class CalcArgs extends SparkArgs with AccumuloArgs

/**
 * Ingests raw multi-band NetCDF tiles into a re-projected and tiled RasterRDD
 */
object Calculate extends ArgMain[CalcArgs] with Logging {
  def running[B](rdd: RasterRDD[SpaceTimeKey], predicate: Double => Double ) = {
    val r1 = rdd.mapTiles{ case (key, tile) =>
      key.updateTemporalComponent(key.temporalKey.time.withDayOfMonth(1).withMonthOfYear(1).withHourOfDay(0)) ->
        tile.mapDouble(predicate)
    }
    new PairRDDFunctions(r1)
      .reduceByKey{ (t1, t2) => t1.localAdd(t2) }
  }


  def main(args: CalcArgs): Unit = {
    System.setProperty("com.sun.media.jai.disableMediaLib", "true")

    implicit val sparkContext = args.sparkContext("Ingest")
    val accumulo = AccumuloInstance(args.instance, args.zookeeper, args.user, new PasswordToken(args.password))
    val catalog = accumulo.catalog
    
//    val catalog = HadoopCatalog(sparkContext, new Path("hdfs://localhost/catalog"))

    val rdd = catalog.load[SpaceTimeKey](LayerId("rcp45",1)).get


    val ret = asRasterRDD(rdd.metaData) { running(rdd, {temp =>
      if (temp == Double.NaN)
        Double.NaN
      else if (temp > 0)
        1
      else
        0
    })
    }

    catalog.save[SpaceTimeKey](LayerId("over-0-daily",1), ret, "results").get
  }
}
