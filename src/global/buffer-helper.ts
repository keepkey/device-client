import ByteBuffer = require('bytebuffer');

export class BufferHelper {
  public static pad(buffer: ByteBuffer, padSize: number) {
    var bufferLength = buffer.limit - buffer.offset;
    if (bufferLength % padSize) {
      var newBufferLength = Math.ceil(bufferLength / padSize) * padSize;
      var padded = ByteBuffer.allocate(newBufferLength).fill(0).reset();
      buffer.copyTo(padded);
      return padded.reset();
    } else {
      return buffer;
    }
  }
}
