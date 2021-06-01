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
    this.innerPos.x = this.d(this.innerPos.x, this.mousePos.x, 0.95 * t);
    this.innerPos.y = this.d(this.innerPos.y, this.mousePos.y, 0.95 * t);
    this.outerPos.x = this.d(this.outerPos.x, this.mousePos.x, 0.1 * t);
    this.outerPos.y = this.d(this.outerPos.y, this.mousePos.y, 0.1 * t);
  }

  d(t: number, e: number, i: number) {
    return t * (1 - i) + e * i;
  }

  u(t: number, e: number, i: number) {
    return Math.min(Math.max(t, e), i);
  }

  updateVelocity() {
    const t = this.lastVelocityPos.x - this.mousePos.x;
    const e = this.lastVelocityPos.y - this.mousePos.y;
    const i = this.u(t / this.mouseVelocityRate, -10, 10);
    const s = this.u(e / this.mouseVelocityRate, -10, 10);
    gsap.fromTo(this.velocity, { x: i, y: s }, { duration: 500, ease: "none" });
  }

  updateRotation() {
    const t = this.mousePos.x - this.lastMousePos.x;
    const e = this.mousePos.y - this.lastMousePos.y;
    const i = Math.atan2(e, t);
    const s = (Math.abs(i - this.mouseAngle) / Math.PI) * 180 < 145 ? 0.2 : 1;
    this.mouseAngle = this.d(this.mouseAngle, i, s);
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
    this.unlisten && this.unlisten();
    this.ticker.kill();
  }
}

// const we = class {
//   constructor(t) {
//     (this.element = t),
//       (this._state = fe.DEFAULT),
//       (this.ticker = new _()),
//       (this.mousePos = {
//         x: 0,
//         y: 0,
//       }),
//       (this.lastMousePos = {
//         x: 0,
//         y: 0,
//       }),
//       (this.lastVelocityPos = {
//         x: 0,
//         y: 0,
//       }),
//       (this.innerPos = {
//         x: 0,
//         y: 0,
//       }),
//       (this.outerPos = {
//         x: 0,
//         y: 0,
//       }),
//       (this.velocity = {
//         x: 1,
//         y: 1,
//       }),
//       (this.mouseAngle = 0),
//       (this.mouseVelocityRate = 50),
//       (this.mouseResetTimer = 0),
//       (this.mousePosInterval = 0),
//       (this.cursorMoved = !1),
//       ve(this),
//       document.documentElement.classList.add("hide-cursor"),
//       (this.innerCircle = t.querySelector(".inner-circle")),
//       (this.innerWrapper = t.querySelector(".inner-wrapper")),
//       (this.outerCircle = t.querySelector(".outer-circle")),
//       (this.outerCircleInner = t.querySelector(".outer-circle-inner")),
//       (this.outerWrapper = t.querySelector(".outer-wrapper")),
//       this.initListeners();
//   }

//   async initListeners() {
//     sl
//     (this.unlisten = h(
//       n(window, "mousemove", this.handleMouseMove.bind(this)),
//       t.on(A.NAVIGATION_START, () => {
//         setTimeout(() => (this.state = fe.DEFAULT));
//       }),
//       t.on(A.NAVIGATION_END, () => {
//         setTimeout(() => (this.state = fe.DEFAULT));
//       })
//     )),
//       this.ticker.add((t) => this.handleTick(t)),
//       (this.mousePosInterval = setInterval(() => {
//         (this.lastVelocityPos.x = this.mousePos.x),
//           (this.lastVelocityPos.y = this.mousePos.y);
//       }, this.mouseVelocityRate));
//   }

//   set state(t) {
//     this._state = t;
//     const e = `state-${t}`;
//     this.element.classList.forEach((t) => {
//       t.startsWith("state-") && t !== e && this.element.classList.remove(t);
//     }),
//       t !== "" && this.element.classList.add(e);
//   }

//   get state() {
//     return this._state;
//   }

//   handleTick(t) {
//     this.updateRotation(), this.updatePositions(t), this.updateTranslation();
//   }

//   handleMouseMove(t) {
//     const e = document.documentElement;
//     e.classList.contains("hide-cursor") && !this.cursorMoved &&
//       setTimeout(() => e.classList.remove("hide-cursor"), 200),
//       (this.cursorMoved = !0),
//       (this.lastMousePos.x = this.mousePos.x),
//       (this.lastMousePos.y = this.mousePos.y),
//       (this.mousePos.x = t.clientX),
//       (this.mousePos.y = t.clientY),
//       this.updateVelocity(),
//       clearTimeout(this.mouseResetTimer),
//       (this.mouseResetTimer = setTimeout(
//         () => this.updateVelocity(),
//         this.mouseVelocityRate
//       ));
//   }

//   updateTranslation() {
//     const t = this.innerPos;
//     const e = this.outerPos;
//     (this.innerWrapper.style.transform = `\n      translate3d(\n        ${t.x}px,\n        ${t.y}px,\n        0\n      )\n    `),
//       (this.outerWrapper.style.transform = `\n      translate3d(\n        ${e.x}px,\n        ${e.y}px,\n        0\n      )\n    `);
//     const i = Math.min(
//       Math.max(
//         Math.abs(0.4 * this.velocity.x),
//         Math.abs(0.4 * this.velocity.y)
//       ),
//       1
//     );
//     (this.outerCircle.style.transform = `rotate(${this.mouseAngle}rad)`),
//       (this.outerCircleInner.style.transform = `scaleX(${1 + i})`);
//   }

//   onDestroy() {
//     clearInterval(this.mousePosInterval),
//       clearTimeout(this.mouseResetTimer),
//       this.unlisten && this.unlisten(),
//       this.ticker.kill();
//   }
// };
