package com.nyctron.platformservices;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Bounded metadata reads; no sample-table expansion or media-payload copying.
 * Android 15 exposes mdhd duration in MediaFormat, while Android 16 uses tkhd.
 * Read the authored track timeline instead of subtracting encoder delay twice
 * on newer extractors. Track IDs match MediaFormat.KEY_TRACK_ID.
 * AOSP MPEG4Extractor.cpp: Android 15 at 1863cb0ea5a9e1340f11a435618ff863e017da29,
 * Android 16 at 4b2111885ff934799e70eddae2527a9848c3be29.
 */
final class IsoBmffTimeline {
  private static final double MAX_MICROS = 9_007_199_254_740_991.0;
  private final long movieScale;
  private final Map<Integer, Track> tracks;

  private IsoBmffTimeline(long movieScale, Map<Integer, Track> tracks) {
    this.movieScale = movieScale;
    this.tracks = tracks;
  }

  /** Null means the container or its duration is unspecified, not zero-length. */
  static IsoBmffTimeline read(FileChannel channel, long base, long length, Runnable check) throws IOException {
    if (base < 0 || length < 0 || base > Long.MAX_VALUE - length) throw invalid("Invalid source range");
    if (length < 8) return null;
    Reader reader = new Reader(channel, check);
    String first = reader.type(base + 4);
    if (!first.equals("ftyp") && !first.equals("moov") && !first.equals("wide") &&
        !first.equals("free") && !first.equals("skip") && !first.equals("mdat")) return null;
    Box moov = reader.find(reader.boxes(base, base + length), "moov");
    if (moov == null) throw invalid("MP4 movie header is missing");
    List<Box> children = reader.boxes(moov.start, moov.end);
    Box mvhd = reader.find(children, "mvhd");
    if (mvhd == null) throw invalid("MP4 movie timescale is missing");
    ByteBuffer header = reader.fields(mvhd, 32);
    int version = version(header);
    long movieScale = unsigned(header.getInt(version == 1 ? 20 : 12));
    if (movieScale == 0) throw invalid("MP4 movie timescale is zero");
    Map<Integer, Track> tracks = new LinkedHashMap<>();
    for (Box box : children) if (box.type.equals("trak")) {
      if (tracks.size() >= 256) throw invalid("MP4 track limit exceeded");
      Track track = reader.track(box);
      if (tracks.put(track.id, track) != null) throw invalid("MP4 track IDs are duplicated");
    }
    return new IsoBmffTimeline(movieScale, tracks);
  }

  /** Keeps fractional microseconds until the PCM writer compares sample times. */
  Double durationUs(int trackId, boolean audio) {
    Track track = tracks.get(trackId);
    if (track == null) throw invalid("Native MP4 track ID was not found in its movie header");
    double end = track.duration > 0 ? micros(track.duration, movieScale) : Double.POSITIVE_INFINITY;
    double offset = 0;
    long mediaStart = 0;
    if (!track.edits.isEmpty()) {
      int position = 0;
      if (track.edits.get(0).mediaTime == -1) {
        offset = micros(track.edits.get(0).duration, movieScale);
        position++;
      }
      if (position != track.edits.size() - 1) throw invalid("Multiple MP4 media edits are unsupported");
      Edit edit = track.edits.get(position);
      if (edit.mediaTime < 0) throw invalid("MP4 edit has no media interval");
      mediaStart = edit.mediaTime;
      if (edit.duration > 0) end = Math.min(end, offset + micros(edit.duration, movieScale));
    }
    // Audio has no B-frame composition reordering. A coarser movie clock must
    // not extend a fractional-sample media endpoint into codec packet padding.
    if (audio && track.mediaDuration > 0) {
      if (track.audioCompositionOffsets) throw invalid("Audio composition offsets require an edit-aware decoder");
      if (mediaStart > track.mediaDuration) throw invalid("MP4 edit begins past its media duration");
      end = Math.min(end, offset + micros(track.mediaDuration - mediaStart, track.mediaScale));
    }
    if (end == Double.POSITIVE_INFINITY) return null;
    if (!Double.isFinite(end) || end < 0 || end > MAX_MICROS) throw invalid("MP4 duration exceeds its supported range");
    return end;
  }

  private static double micros(long ticks, long scale) {
    if (ticks < 0 || scale <= 0) throw invalid("Invalid MP4 time");
    return (ticks / scale) * 1_000_000.0 + (ticks % scale) * 1_000_000.0 / scale;
  }
  private static long unsigned(int value) { return value & 0xffffffffL; }
  private static long duration(ByteBuffer value, int version, int offset) {
    long result = version == 1 ? value.getLong(offset) : unsigned(value.getInt(offset));
    if (result == (version == 1 ? -1 : 0xffffffffL)) return 0;
    if (result < 0) throw invalid("MP4 duration is out of range");
    return result;
  }
  private static int version(ByteBuffer value) {
    int version = value.get(0) & 0xff;
    if (version != 0 && version != 1) throw invalid("Unsupported MP4 time-box version");
    return version;
  }
  private static IllegalArgumentException invalid(String message) { return new IllegalArgumentException(message); }

  private static final class Box {
    final String type;
    final long start, end;
    Box(String type, long start, long end) { this.type = type; this.start = start; this.end = end; }
  }
  private static final class Edit {
    final long duration, mediaTime;
    Edit(long duration, long mediaTime) { this.duration = duration; this.mediaTime = mediaTime; }
  }
  private static final class Track {
    int id;
    long duration, mediaScale, mediaDuration;
    boolean audioCompositionOffsets;
    final List<Edit> edits = new ArrayList<>();
  }
  private static final class Reader {
    private final FileChannel channel;
    private final Runnable check;
    private int boxes;
    Reader(FileChannel channel, Runnable check) { this.channel = channel; this.check = check; }

    ByteBuffer bytes(long offset, int count) throws IOException {
      check.run();
      ByteBuffer bytes = ByteBuffer.allocate(count).order(ByteOrder.BIG_ENDIAN);
      while (bytes.hasRemaining()) {
        int read = channel.read(bytes, offset + bytes.position());
        if (read <= 0) throw invalid("MP4 metadata is truncated");
      }
      // Keep the Java 8 Buffer signature used on supported Android runtimes.
      ((java.nio.Buffer)bytes).flip(); return bytes;
    }
    String type(long offset) throws IOException {
      return new String(bytes(offset, 4).array(), StandardCharsets.ISO_8859_1);
    }
    ByteBuffer fields(Box box, int count) throws IOException {
      if (box.end - box.start < count) throw invalid("MP4 time box is truncated");
      return bytes(box.start, count);
    }
    List<Box> boxes(long start, long end) throws IOException {
      List<Box> result = new ArrayList<>();
      while (start < end) {
        if (++boxes > 8192 || end - start < 8) throw invalid("Invalid or excessive MP4 boxes");
        ByteBuffer header = bytes(start, 8);
        long size = unsigned(header.getInt(0)), headerSize = 8;
        String type = new String(header.array(), 4, 4, StandardCharsets.ISO_8859_1);
        if (size == 1) {
          if (end - start < 16) throw invalid("MP4 extended box is truncated");
          size = bytes(start + 8, 8).getLong(); headerSize = 16;
        } else if (size == 0) size = end - start;
        if (size < headerSize || size > end - start) throw invalid("MP4 box escapes its source range");
        result.add(new Box(type, start + headerSize, start + size));
        start += size;
      }
      return result;
    }
    Box find(List<Box> boxes, String type) {
      Box found = null;
      for (Box box : boxes) if (box.type.equals(type)) {
        if (found != null) throw invalid("MP4 metadata box is duplicated");
        found = box;
      }
      return found;
    }
    Track track(Box box) throws IOException {
      Track track = new Track();
      List<Box> children = boxes(box.start, box.end);
      Box tkhd = find(children, "tkhd"), mdia = find(children, "mdia");
      if (tkhd == null || mdia == null) throw invalid("MP4 track header is missing");
      ByteBuffer header = fields(tkhd, 36);
      int version = version(header);
      long id = unsigned(header.getInt(version == 1 ? 20 : 12));
      if (id == 0 || id > Integer.MAX_VALUE) throw invalid("MP4 track ID is out of range");
      track.id = (int)id;
      track.duration = duration(header, version, version == 1 ? 28 : 20);
      List<Box> media = boxes(mdia.start, mdia.end);
      Box mdhd = find(media, "mdhd");
      if (mdhd == null) throw invalid("MP4 media header is missing");
      // Version zero is 24 bytes; version one is 36 bytes including language.
      header = fields(mdhd, 24); version = version(header);
      if (version == 1) header = fields(mdhd, 36);
      track.mediaScale = unsigned(header.getInt(version == 1 ? 20 : 12));
      if (track.mediaScale == 0) throw invalid("MP4 media timescale is zero");
      track.mediaDuration = duration(header, version, version == 1 ? 24 : 16);
      Box minf = find(media, "minf");
      if (minf != null) {
        Box stbl = find(boxes(minf.start, minf.end), "stbl");
        if (stbl != null) track.audioCompositionOffsets = find(boxes(stbl.start, stbl.end), "ctts") != null;
      }
      Box edts = find(children, "edts");
      if (edts != null) {
        Box elst = find(boxes(edts.start, edts.end), "elst");
        if (elst != null) {
          header = fields(elst, 8); version = version(header);
          long count = unsigned(header.getInt(4));
          if (count > 2) throw invalid("Multiple MP4 media edits are unsupported");
          int size = version == 1 ? 20 : 12;
          if (elst.end - elst.start != 8 + count * size) throw invalid("MP4 edit list has invalid bounds");
          for (int i = 0; i < count; i++) {
            ByteBuffer entry = bytes(elst.start + 8 + (long)i * size, size);
            long segment = version == 1 ? entry.getLong(0) : unsigned(entry.getInt(0));
            if (segment < 0) throw invalid("MP4 edit duration is out of range");
            long time = version == 1 ? entry.getLong(8) : entry.getInt(4);
            int rate = version == 1 ? 16 : 8;
            if (entry.getShort(rate) != 1 || entry.getShort(rate + 2) != 0)
              throw invalid("Non-unit MP4 edit rates are unsupported");
            track.edits.add(new Edit(segment, time));
          }
        }
      }
      return track;
    }
  }
}
