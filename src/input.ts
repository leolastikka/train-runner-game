export class Input {
  private static keys: Set<string>;

  public static init() {
    this.keys = new Set<string>();
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.key);
    });
    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key);
    });
  }

  public static isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }  
}