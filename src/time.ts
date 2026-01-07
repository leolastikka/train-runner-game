import * as THREE from 'three';

export class Time {
  private static clock: THREE.Clock;

  private static deltaTime: number;
  private static totalTime: number;

  public static getDeltaTime(): number {
    return this.deltaTime;
  }

  public static getTotalTime(): number {
    return this.totalTime;
  }

  public static init() {
    this.clock = new THREE.Clock();
  }

  /**
   * Must be called only once every main loop update.
   */
  public static update() {
    this.deltaTime = this.clock.getDelta();
    this.totalTime = this.clock.getElapsedTime();
  }
}