import * as THREE from "three";


export default class Smoke {
    private time: number;
    private width: number;
    private height: number;

    private container: HTMLElement;
    
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.MeshNormalMaterial;
    private mesh: THREE.Mesh;

  constructor(options:any) {
    this.time = 0;
    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.OrthographicCamera( this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 0 );
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
  }
  private setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  private resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  private addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.x = this.width / 2;
      this.mesh.position.y = this.height / 2;
    this.scene.add(this.mesh);
  }
  private render() {
    this.time += 0.05;
    this.mesh.rotation.z += 0.01;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}
