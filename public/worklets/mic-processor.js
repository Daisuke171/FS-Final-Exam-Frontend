class MicProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.sampleRate = sampleRate;       // 48000 típicamente
    this.frameMs = 20;                  // 20 ms
    this.frameSamples = (this.sampleRate * this.frameMs) / 1000; // 960
    this.acc = new Float32Array(0);
    this.port.start();
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    // input[0] es Float32Array con el canal mono
    const chunk = input[0];
    // acumular
    const tmp = new Float32Array(this.acc.length + chunk.length);
    tmp.set(this.acc, 0);
    tmp.set(chunk, this.acc.length);
    this.acc = tmp;

    // enviar de a 960 samples
    while (this.acc.length >= this.frameSamples) {
      const frame = this.acc.slice(0, this.frameSamples);
      this.acc = this.acc.slice(this.frameSamples);
      // transferir el buffer para evitar copia
      this.port.postMessage({ type: 'frame', data: frame.buffer }, [frame.buffer]);
    }

    return true;
  }
}

registerProcessor('mic-processor', MicProcessor);
