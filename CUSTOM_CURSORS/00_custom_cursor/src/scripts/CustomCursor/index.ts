import gsap from "gsap";
import { Ticker } from "../Ticker";

export default class CustomCursor {
  private element;

  private t;

  private ticker;

  private mousePos;

  private lastMousePos;

  private lastVelocityPos;

  private innerPos;

  private outerPos;

  private velocity;

  private mouseAngle;

  private mouseVelocityRate;

  private mouseResetTimer;

  private mousePosInterval;

  private cursorMoved;

  private innerCircle;

  private innerWrapper;

  private outerCircle;

  private outerCircleInner;

  private outerWrapper;

  constructor(el) {
    this.element = el;
    this.t = 10;
    this.ticker = new Ticker();
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.lastVelocityPos = { x: 0, y: 0 };
    this.innerPos = { x: 0, y: 0 };
    this.outerPos = { x: 0, y: 0 };
    this.velocity = { x: 1, y: 1 };
    this.mouseAngle = 0;
    this.mouseVelocityRate = 50;
    this.mouseResetTimer = 0;
    this.mousePosInterval = 0;
    this.cursorMoved = !1;
    this.innerCircle = this.element.querySelector(".inner-circle");
    this.innerWrapper = this.element.querySelector(".inner-wrapper");
    this.outerCircle = this.element.querySelector(".outer-circle");
    this.outerCircleInner = this.element.querySelector(".outer-circle-inner");
    this.outerWrapper = this.element.querySelector(".outer-wrapper");
    this.initListeners();
  }

  initListeners() {
    this.t = 1;
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.ticker.add(() => this.handleTick(this.t));
    this.mousePosInterval = setInterval(() => {
      this.lastVelocityPos.x = this.mousePos.x;
      this.lastVelocityPos.y = this.mousePos.y;
    }, this.mouseVelocityRate);
  }

  handleTick(t: number) {
    this.updateRotation();
    this.updatePositions(t);
    this.updateTranslationAndBlur();
  }

  handleMouseMove(e: MouseEvent) {
    this.cursorMoved = true;
    this.lastMousePos.x = this.mousePos.x;
    this.lastMousePos.y = this.mousePos.y;
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;
    this.updateVelocity();
    clearTimeout(this.mouseResetTimer);
    this.mouseResetTimer = setTimeout(
      () => this.updateVelocity(),
      this.mouseVelocityRate
    );
  }

  updatePositions(t: number) {
    this.innerPos.x = this.lerp(this.innerPos.x, this.mousePos.x, 0.95 * t);
    this.innerPos.y = this.lerp(this.innerPos.y, this.mousePos.y, 0.95 * t);
    this.outerPos.x = this.lerp(this.outerPos.x, this.mousePos.x, 0.1 * t);
    this.outerPos.y = this.lerp(this.outerPos.y, this.mousePos.y, 0.1 * t);
  }

  lerp(t: number, e: number, i: number) {
    return t * (1 - i) + e * i;
  }

  clamp(t: number, e: number, i: number) {
    return Math.min(Math.max(t, e), i);
  }

  updateVelocity() {
    const t = this.lastVelocityPos.x - this.mousePos.x;
    const e = this.lastVelocityPos.y - this.mousePos.y;
    const i = this.clamp(t / this.mouseVelocityRate, -10, 10);
    const s = this.clamp(e / this.mouseVelocityRate, -10, 10);
    gsap.fromTo(
      this.velocity,
      { x: i, y: s },
      { duration: 1000, ease: "none" }
    );
  }

  updateRotation() {
    const t = this.mousePos.x - this.lastMousePos.x;
    const e = this.mousePos.y - this.lastMousePos.y;
    const i = Math.atan2(e, t);
    const s = (Math.abs(i - this.mouseAngle) / Math.PI) * 180 < 145 ? 0.2 : 1;
    this.mouseAngle = this.lerp(this.mouseAngle, i, s);
  }

  updateTranslationAndBlur() {
    const t = this.innerPos;
    const e = this.outerPos;
    this.innerWrapper.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
    this.outerWrapper.style.transform = `translate3d(${e.x}px, ${e.y}px,0)`;
    const i = Math.min(
      Math.max(
        Math.abs(0.4 * this.velocity.x),
        Math.abs(0.4 * this.velocity.y)
      ),
      1
    );
    this.outerCircle.style.transform = `rotate(${this.mouseAngle}rad)`;
    this.outerCircleInner.style.transform = `scaleX(${1 + i * 2.5})`;
    this.outerCircleInner.style.filter = `blur(${i * 2.2}px)`;
  }

  onDestroy() {
    clearInterval(this.mousePosInterval);
    clearTimeout(this.mouseResetTimer);
    this.ticker.kill();
  }
}
