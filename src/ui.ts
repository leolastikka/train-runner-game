import { Asset } from "./asset";

export class UI {
  private static root: HTMLElement;

  public static init() {
    const root = document.createElement('div');
    root.id = 'ui';
    document.body.appendChild(root);
    this.root = root;
  }

  public static showLoadScreen(show: boolean) {
    if (show) {
      const element = document.createElement('div');
      element.id = 'load';
      element.innerHTML = `Loading assets`;
      this.root.appendChild(element);
    }
    else {
      const element = document.getElementById('load');
      if (element) {
        this.root.removeChild(element);
      }
    }
  }

  public static showMenuScreen(
    show: boolean,
    onSelectLevel: ((name: string) => void) | null
  ) {
    if (show) {
      const element = document.createElement('div');
      element.id = 'menu';
      const top = document.createElement('div');
      top.id = 'menu-top';
      top.innerHTML = 'Train Runner'
      const bottom = document.createElement('div');
      bottom.id = 'menu-bottom';
      element.appendChild(top);
      element.appendChild(bottom);

      const levelNames = Asset.getLevelNames();
      for (let name of levelNames) {
        const level = document.createElement('div');
        level.classList.add('menu-level');
        level.innerHTML = name;
        level.addEventListener('click', (event: Event) => {
          if (event instanceof PointerEvent) {
            const target = event.target as HTMLElement;
            const levelName = target.innerHTML;
            if (onSelectLevel) {
              onSelectLevel(levelName);
            }
          }
        });
        bottom.appendChild(level);
      }

      this.root.appendChild(element);
    }
    else {
      const element = document.getElementById('menu');
      if (element) {
        this.root.removeChild(element);
      }
    }
  }

  public static showGameScreen(
    show: boolean,
    onMenu: (() => void) | null,
    onRetry: (() => void) | null,
    onLeft: (() => void) | null,
    onRight: (() => void) | null
  ) {
    if (show) {
      const element = document.createElement('div');
      element.id = 'game';
      const score = document.createElement('div');
      score.id = 'game-score';
      const top = document.createElement('div');
      top.id = 'game-top';
      const bottom = document.createElement('div');
      bottom.id = 'game-bottom';
      const menuButton = document.createElement('div');
      menuButton.id = 'game-menu-button';
      menuButton.innerHTML = 'Menu';
      menuButton.addEventListener('click', (event: Event) => {
        if (onMenu) {
          onMenu();
        }
      });
      const retryButton = document.createElement('div');
      retryButton.id = 'game-retry-button';
      retryButton.innerHTML = 'Retry';
      retryButton.addEventListener('click', (event: Event) => {
        if (onRetry) {
          onRetry();
        }
      });
      const leftButton = document.createElement('div');
      leftButton.id = 'game-left-button';
      leftButton.addEventListener('pointerdown', (event: Event) => {
        if (onLeft) {
          onLeft();
        }
      });
      const rightButton = document.createElement('div');
      rightButton.id = 'game-right-button';
      rightButton.addEventListener('pointerdown', (event: Event) => {
        if (onRight) {
          onRight();
        }
      });
      top.appendChild(menuButton);
      top.appendChild(retryButton);
      bottom.appendChild(leftButton);
      bottom.appendChild(rightButton);
      element.appendChild(score);
      element.appendChild(top);
      element.appendChild(bottom);
      this.root.appendChild(element);
    }
    else {
      const element = document.getElementById('game');
      if (element) {
        this.root.removeChild(element);
      }
    } 
  }

  public static showGameOver(show: boolean) {
    if (show) {
      const game = document.getElementById('game');
      if (game) {
        const element = document.createElement('div');
        element.id = 'game-over';
        element.innerHTML = 'Game Over';
        game.appendChild(element);
      }
    }
    else {
      const element = document.getElementById('game-over');
      if (element) {
        element.parentElement?.removeChild(element);
      }
    }
  }

  public static updateLoadProgress(value: string) {
    var element = document.getElementById('load');
    if (element) {
      element.innerHTML = value;
    }
  }

  public static updateGameScore(value: string) {
    var element = document.getElementById('game-score');
    if (element) {
      element.innerHTML = value;
    }
  }
}