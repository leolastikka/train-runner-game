import * as THREE from 'three';
import { Player } from './player';
import { Level } from './level';
import { Input } from './input';
import { Asset } from './asset';
import { Time } from './time';
import { UI } from './ui';

class Main {
  private static renderer: THREE.WebGLRenderer;
  private static camera: THREE.PerspectiveCamera;

  private static scene: THREE.Scene;
  private static score: number;
  private static player: Player;
  private static level: Level;

  public static init() {
    UI.init();
    UI.showLoadScreen(true);

    Input.init();
    Time.init();
    Asset.init(
      this.onLoad.bind(this),
      this.onProgress.bind(this),
      this.onError.bind(this)
    );
  }

  public static onSelectLevel(name: string) {
    UI.showMenuScreen(false, null);
    UI.showGameScreen(
      true,
      this.onGameMenu.bind(this),
      this.onGameRetry.bind(this),
      this.onGameLeft.bind(this),
      this.onGameRight.bind(this)
    );
    this.startLevel(name);
  }

  private static loop() {
    Time.update();

    if(!this.player) {
      return;
    }

    if (Input.isKeyPressed('ArrowLeft') || Input.isKeyPressed('a')) {
      this.player.moveLeft();
    }
    else if (Input.isKeyPressed('ArrowRight') || Input.isKeyPressed('d')) {
      this.player.moveRight();
    }

    // update player movement
    this.player.update();
  
    // check collisions
    if (this.player.isMoving()) {
      this.score = this.level.checkCollisions(this.score, this.player);

      // check points
      if (this.score <= 0) {
        // stop player inputs
        this.player.stop();
        // retry or return to menu
        UI.showGameOver(true);
      }   
    }
    UI.updateGameScore(this.score.toString());

    // render frame
    this.renderer.render(this.scene, this.camera);
  }

  private static startLevel(name: string) {
    this.camera.position.set(0, 8, 7);  

    this.scene = new THREE.Scene();
    this.player = new Player();
    let levelData = Asset.getLevelData(name);
    if (levelData) {
      this.level = new Level(levelData);
    }

    this.score = 1;
    UI.updateGameScore(this.score.toString());

    this.player.group.add(this.camera);
    this.scene.add(this.player.group);
    this.scene.add(this.level.group);

    this.renderer.setAnimationLoop(this.loop.bind(this));
  }

  private static onLoad() {
    UI.showLoadScreen(false);
    UI.showMenuScreen(true, this.onSelectLevel.bind(this));

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setClearColor(new THREE.Color(0x00bee4));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.rotation.x -= THREE.MathUtils.degToRad(25);  

    window.addEventListener('resize', this.onResize.bind(this));
    document.body.appendChild(this.renderer.domElement);
  }

  private static onProgress(_url: string, loaded: number, total: number) {
    const loadingText = `Loading assets ${loaded}/${total}`;
    UI.updateLoadProgress(loadingText);
  }

  private static onError(url: string) {
    console.log('Main.onError', url)
  }

  private static onGameMenu() {
    UI.showGameScreen(false, null, null, null, null);
    UI.showMenuScreen(true, this.onSelectLevel.bind(this));
  }

  private static onGameRetry() {
    UI.showGameOver(false);
    this.startLevel(this.level.name);
  }

  private static onGameLeft() {
    this.player.moveLeft();
  }

  private static onGameRight() {
    this.player.moveRight();
  }

  private static onResize() {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

Main.init();