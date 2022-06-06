import { Application, BitmapFont, BitmapText, DisplayObject, Ticker } from 'pixi.js';

BitmapFont.from('arial', {
  fill: '#ffffff',
  fontFamily: 'Arial',
  fontSize: 10,
});

export class Manager {
  static app: Application;
  private static currentScene: IScene;

  private static _width: number;
  private static _height: number;

  public static get width(): number {
    return Manager._width;
  }
  public static get height(): number {
    return Manager._height;
  }

  private static fpsCounter: BitmapText;

  public static initialize(width: number, height: number): void {
    Manager._width = width;
    Manager._height = height;

    Manager.app = new Application({
      view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0xaa00aa,
      width: width,
      height: height,
    });

    Manager.fpsCounter = new BitmapText('0', {
      fontName: 'arial',
      fontSize: 15,
      tint: 0x000000,
    });

    Manager.app.stage.addChild(Manager.fpsCounter);

    Ticker.shared.add(() => {
      Manager.fpsCounter.text = `${Math.round(Ticker.shared.FPS)} FPS`;
    });
  }

  // Call this function when you want to go to a new scene
  public static changeScene(newScene: IScene): void {
    // Remove and destroy old scene... if we had one..
    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene);
      Manager.currentScene.destroy();
    }

    // Add the new one
    Manager.currentScene = newScene;
    Manager.app.stage.addChildAt(Manager.currentScene, 0);
  }
}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export interface IScene extends DisplayObject {
  application: Application;
}
