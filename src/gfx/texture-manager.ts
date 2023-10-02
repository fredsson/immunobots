import { Assets, Texture } from "pixi.js";

export class TextureManager {

  private textureByAssetPath: Record<string, Texture> = {};
  private animationsByAssetPath: Record<string, Texture[]> = {}

  private loaded = false;

  constructor() {
  }

  public loadAll(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve();
    }

    this.loaded = true;
    return new Promise(async resolve => {
      await Assets.load('/assets/gfx/bacteria.png').then(b => this.textureByAssetPath['assets/gfx/bacteria.png'] = b);
      await Assets.load('/assets/gfx/bullet_1.json').then((b: { data: { animations: Record<string, string[]> } }) => {
        const animations = b.data.animations['default'].map(textureName => {
          return Texture.from(textureName);
        });
        this.animationsByAssetPath['assets/gfx/bullet_1.json'] = animations;

        resolve();
      });
    })
  }

  public getByPath(path: string): Texture {
    return this.textureByAssetPath[path];
  }

  public getAnimationByPath(path: string): Texture[] {
    return this.animationsByAssetPath[path];
  }



}
