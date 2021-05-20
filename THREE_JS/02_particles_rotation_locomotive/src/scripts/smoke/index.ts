import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import smokeTex from "../../images/smoke_texture.png";

export default class Smoke {
  private time: number;

  private rotation: any;

  private width: number;

  private height: number;

  private frustumSize: number;

  private container: HTMLElement;

  private scene: THREE.Scene;

  private camera: THREE.OrthographicCamera;
  // private camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;

  private geometry: THREE.PlaneBufferGeometry;

  private material: THREE.MeshBasicMaterial;

  private smokeTexture: THREE.Texture;

  private smokeParticles: Array<THREE.Mesh>;

  private smokeAnim: GSAPTimeline;

  constructor(options: any) {
    this.rotation = { x: 0, y: 0, z: 0 };
    this.time = 0;
    this.frustumSize = 1000;
    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    const aspect = this.width / this.height;
    this.camera = new THREE.OrthographicCamera(
      (this.frustumSize * aspect) / -2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      1,
      0
    );
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);

    this.container.appendChild(this.renderer.domElement);

    this.resize();
    this.setupResize();
    this.addObjects();
    this.render();
    this.setupAnim();
  }

  private setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  private setupAnim() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({
      immediateRender: false,
      ease: "power5.out",
    });
    gsap.to("#section1", {
      scrollTrigger: {
        trigger: "#section1",
        scrub: true,
        pin: true,
        start: "top top",
        end: "bottom top",
        scroller: ".loco-scroll",
      },
    });
    this.smokeAnim = gsap.timeline({
      scrollTrigger: {
        trigger: "#section2",
        start: "top top",
        end: "bottom top",
        markers: true,
        scroller: ".loco-scroll",
        scrub: 2,
      },
    });
    this.smokeAnim.to("#section2", {
      y: document.getElementById("section2")?.offsetHeight * -1,
    });
    this.smokeAnim.fromTo(this.rotation, { z: 0 }, { z: 1 }, 0);
  }

  private resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);

    this.camera.left = -this.width / 2;
    this.camera.right = this.width / 2;
    this.camera.top = this.height / 2;
    this.camera.bottom = -this.height / 2;
    this.camera.updateProjectionMatrix();
  }

  private addObjects() {
    this.light = new THREE.DirectionalLight(0xffffff, 0.6);
    this.light.position.set(0, 0, 1000);
    this.scene.add(this.light);
    this.smokeTexture = new THREE.TextureLoader().load(smokeTex);
    this.material = new THREE.MeshLambertMaterial({
      map: this.smokeTexture,
      transparent: true,
      color: 0xffffff,
    });
    this.geometry = new THREE.PlaneBufferGeometry(500, 500);
    this.addParticles();
  }

  private addParticles() {
    this.smokeParticles = [];
    for (let p = 0; p < 15; p += 1) {
      const particle = new THREE.Mesh(this.geometry, this.material);
      particle.position.set(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        0
      );
      particle.rotation.z = Math.random() * 360;
      this.scene.add(particle);
      this.smokeParticles.push(particle);
    }
  }

  private rotateSmoke() {
    for (let p = this.smokeParticles.length - 1; p >= 0; p -= 1) {
      this.smokeParticles[p].rotation.z = this.rotation.z;
    }
  }

  private render() {
    this.time += 0.05;
    this.rotateSmoke();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}
