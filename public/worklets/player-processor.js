class PlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];
    this.readPos = 0;
    this.channelCount = 1;
    this.frameSamples = (sampleRate * 20) / 1000; // 960
    this.port.onmessage = (ev) => {
      if (ev.data?.type === 'enqueue' && ev.data?.data) {
        // data es ArrayBuffer de Float32
        const f32 = new Float32Array(ev.data.data);
        this.queue.push(f32);
      }
    };
    this.port.start();
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    const out = output[0]; // mono

    if (!out) return true;

    let written = 0;
    while (written < out.length) {
      if (this.queue.length === 0) {
        // si no hay datos, rellenar con silencio
        out.fill(0, written);
        break;
      }
      const frame = this.queue[0];
      const need = Math.min(out.length - written, frame.length - this.readPos);
      out.set(frame.subarray(this.readPos, this.readPos + need), written);
      written += need;
      this.readPos += need;
      if (this.readPos >= frame.length) {
        this.queue.shift();
        this.readPos = 0;
      }
    }

    // copiar al resto de canales (si fuese estéreo)
    for (let ch = 1; ch < outputs[0].length; ch++) {
      outputs[0][ch].set(out);
    }
    return true;
  }
}

registerProcessor('player-processor', PlayerProcessor);
