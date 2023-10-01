
export class AudioService {
  private bg1Element: HTMLAudioElement;
  private shootSounds: HTMLAudioElement[] = [];
  private deathSounds: HTMLAudioElement[] = [];

  constructor() {
    this.bg1Element = document.getElementById('bg1') as HTMLAudioElement;
    this.bg1Element.volume = 0.5;

    this.shootSounds.push(
      document.getElementById('shoot1') as HTMLAudioElement,
      document.getElementById('shoot2') as HTMLAudioElement,
      document.getElementById('shoot3') as HTMLAudioElement,
    );

    this.deathSounds.push(
      document.getElementById('enemy_death1') as HTMLAudioElement,
      document.getElementById('enemy_death2') as HTMLAudioElement,
      document.getElementById('enemy_death3') as HTMLAudioElement,
    );
  }

  public startBackground() {
    this.bg1Element.play();
  }

  public playShootSound() {
    const index = Math.round(Math.random() * (this.shootSounds.length - 1));
    this.shootSounds[index].play();
  }

  public playEnemyDeathSound() {
    const index = Math.round(Math.random() * (this.deathSounds.length - 1));
    this.deathSounds[index].play();
  }

  public destroy() {
    this.bg1Element.pause();
  }
}
