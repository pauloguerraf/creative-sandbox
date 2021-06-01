import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default class SoundGraph {
  private elSection: HTMLElement;

  private elCanvas: HTMLCanvasElement;

  private elNeedle: HTMLOrSVGElement;

  private elTime: HTMLElement;

  private elSpeed: HTMLElement;

  private ctx2D: CanvasRenderingContext2D;

  private audioCtx: AudioContext;

  private analyser: any;

  private source: any;

  private dataArray: Uint8Array;

  private pressHoldDuration: number = 100;

  private counter: number = 0;

  private timerID: number;

  private bufferLength: number = 0;

  private numOfPoints: number = 0;

  private pointsDistance: number = 0;

  private graphMultiplier = 0.5;

  private sampleSource: AudioBufferSourceNode;

  private isEngineOn = false;

  private isSpeeding = false;

  private audioBuffer: AudioBuffer;

  constructor() {
    this.elSection = document.getElementById(
      "js-o-sound__section"
    ) as HTMLCanvasElement;
    this.elCanvas = document.getElementById(
      "js-o-sound__canvas"
    ) as HTMLCanvasElement;
    this.elSpeed = document.getElementById(
      "js-o-sound__speed-count"
    ) as HTMLElement;
    this.elTime = document.getElementById(
      "js-o-sound__time-count"
    ) as HTMLElement;
    this.elNeedle = document.getElementById(
      "js-o-sound__meter-needle"
    ) as HTMLOrSVGElement;
  }

  public bindings() {
    this.elSection.addEventListener(
      "mousedown",
      (e: MouseEvent | TouchEvent) => this.pressingDown(e),
      false
    );
    this.elSection.addEventListener(
      "mouseup",
      (e: MouseEvent | TouchEvent) => this.notPressingDown(e),
      false
    );
    this.elSection.addEventListener(
      "mouseleave",
      (e: MouseEvent) => this.notPressingDown(e),
      false
    );
    this.elSection.addEventListener(
      "touchstart",
      (e: MouseEvent | TouchEvent) => this.pressingDown(e),
      false
    );
    this.elSection.addEventListener(
      "touchend",
      (e: MouseEvent | TouchEvent) => this.notPressingDown(e),
      false
    );
  }

  public init() {
    this.elCanvas.width = window.innerWidth;
    this.elCanvas.height = window.innerHeight;
    this.ctx2D = this.elCanvas.getContext("2d") as CanvasRenderingContext2D;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.connect(this.audioCtx.destination);

    this.setupSample().then((audioBuffer) => {
      this.audioBuffer = audioBuffer;
      this.sampleSource = this.audioCtx.createBufferSource();
      this.sampleSource.buffer = this.audioBuffer;
      this.sampleSource.playbackRate.value = 1;
      this.sampleSource.connect(this.analyser);
      this.analyser.fftSize = 1024;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      window.addEventListener("resize", () => this.setDimensions());
      this.setDimensions();
    });
    // sampleSource.loopStart = 3.131;
    // sampleSource.loopEnd = 4.95;
  }

  private timer() {
    if (this.counter < this.pressHoldDuration) {
      this.timerID = requestAnimationFrame(() => this.timer());
      this.counter += 1;
      // this.elCursorCircle.style.transform = `scale(${1 + this.counter / 20})`;
    } else if (!this.isEngineOn && !this.isSpeeding) {
      this.sampleSource.loop = true;
      this.sampleSource.loopStart = 3.131;
      this.sampleSource.loopEnd = 4.95;
      this.sampleSource.start(1);
      this.isEngineOn = true;
      this.graphMultiplier = 0.5;
      this.updateGraph();
    } else if (this.isEngineOn && !this.isSpeeding) {
      this.sampleSource.loopEnd = 0;
      this.sampleSource.loop = false;
      this.sampleSource.addEventListener("ended", () => {
        this.isSpeeding = false;
        this.isEngineOn = false;
      });
      this.isSpeeding = true;
      this.graphMultiplier = 1;
      this.updateGraph();
    }
  }

  private pressingDown(e: any) {
    e.preventDefault();
    if (this.isEngineOn && !this.isSpeeding) {
      this.pressHoldDuration = 75;
      requestAnimationFrame(() => this.timer());
    } else if (!this.isEngineOn && !this.isSpeeding) {
      this.pressHoldDuration = 25;
      requestAnimationFrame(() => this.timer());
    }
  }

  private notPressingDown(e: any) {
    // this.elCursorCircle.style.transform = "scale(1)";
    // this.elCursorCircle.classList.remove("is-hovering");
    cancelAnimationFrame(this.timerID);
    this.counter = 0;
  }

  private setDimensions() {
    this.elCanvas.width = window.innerWidth;
    this.elCanvas.height = window.innerHeight;
    this.updateGraph();
  }

  updateGraph() {
    this.analyser.getByteFrequencyData(this.dataArray);
    this.ctx2D.clearRect(0, 0, this.elCanvas.width, this.elCanvas.height);
    this.ctx2D.save();
    this.ctx2D.translate(0, this.elCanvas.height / 2);
    this.ctx2D.beginPath();
    this.ctx2D.lineJoin = "miter";
    this.ctx2D.lineWidth = 2;
    this.ctx2D.strokeStyle = "#FCDB67";
    this.numOfPoints = 30;
    this.pointsDistance = this.elCanvas.width / this.numOfPoints;
    for (let i = 0; i < this.numOfPoints; i++) {
      const current = this.dataArray[i];
      if (i === 0) this.ctx2D.moveTo(0, 0);
      else if (i % 2 === 0) {
        // this.ctx2D.moveTo((i - 1) * this.pointsDistance, prev);
        this.ctx2D.lineTo(
          i * this.pointsDistance,
          -current * 0.5 * this.graphMultiplier
        );
      } else {
        // this.ctx2D.moveTo((i - 1) * this.pointsDistance, -prev);
        this.ctx2D.lineTo(
          i * this.pointsDistance,
          current * 0.5 * this.graphMultiplier
        );
      }
      this.ctx2D.stroke();
    }
    this.numOfPoints = 20;
    this.pointsDistance = this.elCanvas.width / this.numOfPoints;
    this.ctx2D.lineTo(this.elCanvas.width, 0);
    this.ctx2D.stroke();
    this.ctx2D.beginPath();
    this.ctx2D.lineJoin = "miter";
    this.ctx2D.lineWidth = 1;
    this.ctx2D.strokeStyle = "#FCDB67";
    this.ctx2D.moveTo(0, this.dataArray[0]);
    for (let i = 0; i < this.numOfPoints; i++) {
      const current = this.dataArray[i];
      if (i === 0) this.ctx2D.moveTo(-this.pointsDistance, 0);
      else if (i % 2 !== 0) {
        this.ctx2D.lineTo(
          i * this.pointsDistance,
          -current * 1.5 * this.graphMultiplier
        );
      } else {
        this.ctx2D.lineTo(
          i * this.pointsDistance,
          current * 1.5 * this.graphMultiplier
        );
      }
      this.ctx2D.stroke();
    }
    this.ctx2D.lineTo(this.elCanvas.width + this.pointsDistance, 0);
    this.ctx2D.stroke();
    this.numOfPoints = 15;
    this.pointsDistance = this.elCanvas.width / this.numOfPoints;
    this.ctx2D.lineTo(this.elCanvas.width, 0);
    this.ctx2D.stroke();
    this.ctx2D.beginPath();
    this.ctx2D.lineJoin = "miter";
    this.ctx2D.lineWidth = 1;
    this.ctx2D.strokeStyle = "#FCDB67";
    this.ctx2D.moveTo(0, this.dataArray[0]);
    for (let i = 0; i < this.numOfPoints; i += 1) {
      const current = this.dataArray[i];
      if (i === 0) this.ctx2D.moveTo(-this.pointsDistance * 1.5, 0);
      else if (i % 2 !== 0) {
        this.ctx2D.lineTo(
          i * this.pointsDistance,
          -current * 0.1 * this.graphMultiplier
        );
      } else {
        this.ctx2D.lineTo(
          i * this.pointsDistance,
          current * 0.1 * this.graphMultiplier
        );
      }
      this.ctx2D.stroke();
    }
    this.ctx2D.lineTo(this.elCanvas.width + this.pointsDistance * 1.5, 0);
    this.ctx2D.stroke();
    this.ctx2D.restore();
    requestAnimationFrame(() => {
      this.updateGraph();
    });
  }

  private async setupSample() {
    const filePath = "../src/audio/car_accelerate.mp3";
    const audioBuffer = await this.getFile(this.audioCtx, filePath);
    return audioBuffer;
  }

  private async getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }
}
