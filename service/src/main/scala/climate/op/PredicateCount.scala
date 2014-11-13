package climate.op

import geotrellis.raster._
import geotrellis.raster.op.local._
import geotrellis.spark._
import org.apache.spark.rdd.PairRDDFunctions

import scala.reflect.ClassTag

object PredicateCount {
  def apply[K: ClassTag](cellType: CellType, predicate: Double=>Double, keyBin: K=>K)(rdd: RasterRDD[K]): RasterRDD[K] = 
  asRasterRDD(rdd.metaData) {    
    val bins = rdd.mapTiles{ case (key, tile) => keyBin(key) -> tile.convert(TypeByte).mapDouble(predicate) }
    new PairRDDFunctions(bins).reduceByKey{ (t1, t2) => t1.localAdd(t2) }
  }  
}