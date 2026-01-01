export class Input {
  private keys: Set<string>;

  constructor() {
    this.keys = new Set<string>();
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.key);
    });
    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key);
    });
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }  
}