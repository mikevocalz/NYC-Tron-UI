package com.nyctron.platformservices;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;

/** JVM checks of the actual native metadata reader, independent of Android mocks. */
public final class IsoBmffTimelineTest {
  private static Path temporary;
  private static int tests;
  private interface Work { void run() throws Exception; }

  public static void main(String[] args) throws Exception {
    temporary = Paths.get(args[1]);
    byte[] fixture = Files.readAllBytes(Paths.get(args[0]));
    IsoBmffTimeline real = read(fixture);
    equal(real.durationUs(1, false), 2_000_000.0, "B-frame video follows its edit, not mdhd minus composition offset");
    equal(real.durationUs(2, true), 2_000_000.0, "AAC priming must not extend the real fixture beyond two seconds");
    tests++;

    // Header units are milliseconds, but actual audio ends on a 48 kHz sample.
    // The four-second video must neither lengthen nor truncate the audio track.
    IsoBmffTimeline separate = read(movie(0, 1000,
      track(0, 1, 4000, 10000, 40000),
      track(0, 2, 1001, 48000, 49025, edit(0, 1001, 1024))));
    equal(separate.durationUs(1, false), 4_000_000.0, "longer video endpoint");
    equal(separate.durationUs(2, true), 1_000_000.0 + 1_000_000.0 / 48000, "fractional-microsecond audio endpoint");
    tests++;

    // A finer movie clock can author a shorter edit than the encoded content.
    IsoBmffTimeline fine = read(movie(0, 48000,
      track(0, 2, 96000, 48000, 97024, edit(0, 4001, 1024))));
    equal(fine.durationUs(2, true), 4001 * 1_000_000.0 / 48000, "sub-millisecond edit endpoint");
    tests++;

    IsoBmffTimeline wide = read(movie(1, 48000,
      track(1, 2, 96000, 48000, 97024, edit(1, 96000, 1024))));
    equal(wide.durationUs(2, true), 2_000_000.0, "version-one 64-bit time fields");
    IsoBmffTimeline delayed = read(movie(0, 1000,
      track(0, 2, 750, 48000, 25024, edit(0, 250, -1), edit(0, 500, 1024))));
    equal(delayed.durationUs(2, true), 750_000.0, "initial empty edit remains on the media timeline");
    tests++;

    byte[] wrapped = new byte[fixture.length + 173];
    System.arraycopy(fixture, 0, wrapped, 123, fixture.length);
    Path slice = Files.createTempFile(temporary, "provider-slice-", ".bin");
    Files.write(slice, wrapped);
    try (FileChannel channel = FileChannel.open(slice, StandardOpenOption.READ)) {
      IsoBmffTimeline timeline = IsoBmffTimeline.read(channel, 123, fixture.length, () -> {});
      equal(timeline.durationUs(2, true), 2_000_000.0, "content-provider descriptor range");
    }
    tests++;

    invalid(() -> read(Arrays.copyOf(fixture, fixture.length - 1)), "truncated media box");
    byte[] escaped = fixture.clone(); ByteBuffer.wrap(escaped).putInt(0, -2);
    invalid(() -> read(escaped), "unsigned box exceeds the file");
    invalid(() -> real.durationUs(99, true), "unknown native track ID");
    invalid(() -> read(movie(0, 0, track(0, 1, 1, 48000, 1))), "zero timescale");
    tests++;

    byte[] wrongRate = edit(0, 96000, 1024); ByteBuffer.wrap(wrongRate).putShort(8, (short)2);
    invalid(() -> read(movie(0, 48000, track(0, 2, 96000, 48000, 97024, wrongRate))), "time-stretching edit");
    IsoBmffTimeline many = read(movie(0, 48000,
      track(0, 2, 96000, 48000, 97024, edit(0, 48000, 1024), edit(0, 48000, 49024))));
    invalid(() -> many.durationUs(2, true), "multiple active media edits");
    invalid(() -> read(movie(0, 48000, track(0, 1, 96000, 48000, 96000), track(0, 1, 96000, 48000, 96000))), "duplicate track IDs");
    tests++;

    ByteArrayOutputStream excessive = new ByteArrayOutputStream();
    for (int i = 0; i < 8193; i++) excessive.write(box("free", new byte[0]));
    invalid(() -> read(excessive.toByteArray()), "metadata work budget");
    Path cancel = Files.createTempFile(temporary, "cancel-", ".mp4"); Files.write(cancel, fixture);
    try (FileChannel channel = FileChannel.open(cancel, StandardOpenOption.READ)) {
      int[] reads = {0};
      try {
        IsoBmffTimeline.read(channel, 0, fixture.length, () -> {
          if (++reads[0] == 3) throw new IllegalStateException("cancelled native owner");
        });
        throw new AssertionError("reader ignored cancellation");
      } catch (IllegalStateException expected) {
        if (!expected.getMessage().equals("cancelled native owner")) throw expected;
      }
    }
    if (read(new byte[]{'R','I','F','F',1,0,0,0,'W','A','V','E'}) != null)
      throw new AssertionError("non-MP4 source was assigned an MP4 timeline");
    tests++;
    System.out.println("Passed " + tests + " native MP4 timeline groups (real fixture, precise tracks, bounds, cancellation).");
  }

  private static IsoBmffTimeline read(byte[] bytes) throws Exception {
    Path file = Files.createTempFile(temporary, "timeline-", ".mp4"); Files.write(file, bytes);
    try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {
      return IsoBmffTimeline.read(channel, 0, bytes.length, () -> {});
    }
  }
  private static void equal(Double actual, double expected, String message) {
    if (actual == null || Math.abs(actual - expected) > 0.000001) throw new AssertionError(message + ": " + actual + " != " + expected);
  }
  private static void invalid(Work work, String label) throws Exception {
    try { work.run(); } catch (IllegalArgumentException expected) { return; }
    throw new AssertionError("Accepted " + label);
  }
  private static byte[] box(String type, byte[]... payloads) throws Exception {
    int size = 8; for (byte[] bytes : payloads) size += bytes.length;
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    output.write(ByteBuffer.allocate(4).putInt(size).array()); output.write(type.getBytes("ISO-8859-1"));
    for (byte[] bytes : payloads) output.write(bytes);
    return output.toByteArray();
  }
  private static byte[] movie(int version, long scale, byte[]... tracks) throws Exception {
    ByteBuffer header = ByteBuffer.allocate(version == 1 ? 112 : 100).order(ByteOrder.BIG_ENDIAN);
    header.put(0, (byte)version); header.putInt(version == 1 ? 20 : 12, (int)scale);
    ByteArrayOutputStream content = new ByteArrayOutputStream(); content.write(box("mvhd", header.array()));
    for (byte[] track : tracks) content.write(track);
    return concat(box("ftyp", new byte[]{'i','s','o','m',0,0,0,0}), box("moov", content.toByteArray()));
  }
  private static byte[] track(int version, int id, long duration, long mediaScale, long mediaDuration, byte[]... edits) throws Exception {
    ByteBuffer header = ByteBuffer.allocate(version == 1 ? 96 : 84).order(ByteOrder.BIG_ENDIAN);
    header.put(0, (byte)version); header.putInt(version == 1 ? 20 : 12, id);
    if (version == 1) header.putLong(28, duration); else header.putInt(20, (int)duration);
    ByteBuffer media = ByteBuffer.allocate(version == 1 ? 36 : 24).order(ByteOrder.BIG_ENDIAN);
    media.put(0, (byte)version); media.putInt(version == 1 ? 20 : 12, (int)mediaScale);
    if (version == 1) media.putLong(24, mediaDuration); else media.putInt(16, (int)mediaDuration);
    byte[] edts = new byte[0];
    if (edits.length != 0) {
      ByteArrayOutputStream list = new ByteArrayOutputStream();
      list.write(ByteBuffer.allocate(8).putInt(version << 24).putInt(edits.length).array());
      for (byte[] edit : edits) list.write(edit);
      edts = box("edts", box("elst", list.toByteArray()));
    }
    return box("trak", box("tkhd", header.array()), edts, box("mdia", box("mdhd", media.array())));
  }
  private static byte[] edit(int version, long duration, long time) {
    ByteBuffer buffer = ByteBuffer.allocate(version == 1 ? 20 : 12).order(ByteOrder.BIG_ENDIAN);
    if (version == 1) buffer.putLong(duration).putLong(time); else buffer.putInt((int)duration).putInt((int)time);
    return buffer.putShort((short)1).putShort((short)0).array();
  }
  private static byte[] concat(byte[] a, byte[] b) {
    byte[] result = Arrays.copyOf(a, a.length + b.length); System.arraycopy(b, 0, result, a.length, b.length); return result;
  }
}
