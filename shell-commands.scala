// Skip logs?
// import org.apache.log4j.Logger
// import org.apache.log4j.Level

// Logger.getLogger("org").setLevel(Level.OFF)
// Logger.getLogger("akka").setLevel(Level.OFF)

import geotrellis.raster._
import geotrellis.vector._
import geotrellis.spark._
import geotrellis.spark.io.accumulo._

import org.apache.accumulo.core.client.security.tokens.PasswordToken

implicit val _sc = sc

val accumulo = AccumuloInstance("gis", "localhost", "root", new PasswordToken("secret"))
def catalog = accumulo.catalog

val rcp45 = catalog.load[SpaceTimeKey](LayerId("ccsm4-rcp45", 5))
val rcp85 = catalog.load[SpaceTimeKey](LayerId("ccsm4-rcp85", 5))

// Find the difference

import geotrellis.spark.op.local._

val diff = rcp85 - rcp45
val absDiff = diff.localAbs

// Find the count of cells that are above vs the count of cells that are below

val hotter = diff.localIf({z: Int => isData(z) && z > 0}, 1, 0).map { case (key, tile) => tile.toArrayDouble.sum }.sum
val colder = diff.localIf({z: Int => isData(z) && z < 0}, 1, 0).map { case (key, tile) => tile.toArrayDouble.map { z => if(isData(z)) z else 0 }.sum }.sum

// Find min and max difference
diff.minMax

// Save it off
catalog.save(LayerId("diff", 5), "calc_table", absDiff)

// Find the tile with the most variance
import geotrellis.raster.op.local._

val diffsums = 
  absDiff.map { case (tileId, tile) =>
    val sum = tile.toArrayDouble.map { z => if(isData(z)) z else 0.0 }.sum
    (tileId, (tile, sum))
  }

val (key, (tile, sum)) = diffsums.max()(Ordering.by { case (tileId, (tile, sum)) => sum })

// Write json for Extent
import geotrellis.vector.reproject._
import geotrellis.vector.json._
import geotrellis.proj4._

def write_json(txt: String): Unit = {
  import java.nio.file.{Paths, Files}
  import java.nio.charset.StandardCharsets
 
  Files.write(Paths.get("/Users/rob/proj/climate/climate-viewer/layer.json"), txt.getBytes(StandardCharsets.UTF_8))
}

val extent = diff.metaData.mapTransform(key).reproject(WebMercator, LatLng)

write_json(extent.toPolygon.toGeoJson)

// Find color ramp breaks for each rdd
import geotrellis.spark.op.stats._

val h45 = rcp45.histogram
val h85 = rcp85.histogram

h45.getQuantileBreaks(12)
h84.getQuantileBreaks(12)

// Calculate the isochromes.

import geotrellis.raster.stats._

val classBreaks = tile.classBreaks(12)

def getBucket(v: Double): Double = { 
  val i = java.util.Arrays.binarySearch(classBreaks, v.toInt)
  if(i < 0) (-i - 1).toDouble
  else i.toDouble
}

val classified = tile.mapDouble { z => getBucket(z) }

import geotrellis.raster.render.ColorRamps._

val colorRamp = ClassificationBoldLandUse.interpolate(classBreaks.size)
//val colorRamp = BlueToRed.interpolate(classBreaks.size)
val colors = colorRamp.colors

def hexColor(i: Int) = Integer.toHexString((colors(i) >> 8) & 0xFFFFFF)
val isos = classified.toVector(extent).map { feature => PolygonFeature(feature.geom, hexColor(feature.data)) }

write_json(isos.toGeoJson)
