import * as THREE from 'three';
import { Player } from './player';
import { Level } from './level';
import { Input } from './input';
import { Level1 } from './levels/level-1';

class Main {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private input: Input;

  private score: number;
  private player: Player;
  private level: Level;

  constructor() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0x00bee4));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.score = 1;
    this.player = new Player();
    this.level = new Level(Level1);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // this.camera.position.set(0, 4, 5);
    this.camera.position.set(0, 5, 5);
    this.camera.rotation.x -= THREE.MathUtils.degToRad(20);

    this.clock = new THREE.Clock();
    this.input = new Input();

    window.addEventListener('resize', this.onResize.bind(this));
    document.body.appendChild(this.renderer.domElement);
    this.updatePointsDiv(this.score.toString());
  }

  public async start() {
    this.scene.add(this.level.group);

    this.player.group.add(this.camera);
    this.scene.add(this.player.group);

    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private animate() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if(!this.player) {
      return;
    }

    if (this.input.isKeyPressed('ArrowLeft') || this.input.isKeyPressed('a')) {
      this.player.moveLeft(time);
    }
    else if (this.input.isKeyPressed('ArrowRight') || this.input.isKeyPressed('d')) {
      this.player.moveRight(time);
    }

    // move
    this.player.group.position.z -= this.player.speed * delta;
    this.player.update(time);
  
    // check collisions
    if (this.player.isMoving()) {
      this.score = this.level.checkCollisions(this.score, this.player);
    }

    // check points
    this.updatePointsDiv(this.score.toString());

    this.renderer.render(this.scene, this.camera);
  }

  private onResize() {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private updatePointsDiv(value: string) {
    var element = document.getElementById('points');
    if (element) {
      element.innerHTML = value;
    }
  }
}

const main = new Main();
main.start();