package climate.ingest

import geotrellis.spark._
import geotrellis.spark.io.hadoop._
import geotrellis.spark.ingest._
import geotrellis.raster._
import geotrellis.raster.io.geotiff.reader._
import geotrellis.vector.Extent
import geotrellis.proj4._

import org.apache.hadoop.fs.Path
import org.apache.hadoop.fs.FSDataInputStream

import org.apache.hadoop.mapreduce.InputSplit
import org.apache.hadoop.mapreduce.JobContext
import org.apache.hadoop.mapreduce.RecordReader
import org.apache.hadoop.mapreduce.TaskAttemptContext
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat
import org.apache.hadoop.mapreduce.lib.input.FileSplit

import java.nio.ByteBuffer

import com.github.nscala_time.time.Imports._

case class SpaceTimeInputKey(extent: Extent, crs: CRS, time: DateTime)
object SpaceTimeInputKey {
  implicit def ingestKey: IngestKey[SpaceTimeInputKey] =
    KeyLens[SpaceTimeInputKey, ProjectedExtent](band => ProjectedExtent(band.extent, band.crs), (band, pe) => SpaceTimeInputKey(pe.extent, pe.crs, band.time))

}

class SourceTileInputFormat extends FileInputFormat[SpaceTimeInputKey, Tile] {
  override def isSplitable(context: JobContext, fileName: Path) = false

  override def createRecordReader(
    split: InputSplit,
    context: TaskAttemptContext): RecordReader[SpaceTimeInputKey, Tile] = new InputTileRecordReader

}

class InputTileRecordReader extends RecordReader[SpaceTimeInputKey, Tile] {
  private var tup: (SpaceTimeInputKey, Tile) = null
  private var hasNext: Boolean = true

  def initialize(split: InputSplit, context: TaskAttemptContext) = {
    val path = split.asInstanceOf[FileSplit].getPath()
    val conf = context.getConfiguration()
    val bytes = HdfsUtils.readBytes(path, conf)

    val geoTiff = GeoTiffReader(bytes)

    val imageDirectory = GeoTiffReader(bytes).read().imageDirectories.head
    val meta = imageDirectory.metadata
    val isoString = meta("ISO_TIME")
    val dateTime = DateTime.parse(isoString)
    val (tile, extent, crs) =
      GeoTiffReader(bytes).read().imageDirectories.head.toRaster

    tup = (SpaceTimeInputKey(extent, crs, dateTime), tile)
  }

  def close = {}
  def getCurrentKey = tup._1
  def getCurrentValue = { hasNext = false ; tup._2 }
  def getProgress = 1
  def nextKeyValue = hasNext
}
