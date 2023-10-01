
export class AudioService {
  private bg1Element: HTMLAudioElement;

  constructor() {
    this.bg1Element = document.getElementById('bg1') as HTMLAudioElement;
    this.bg1Element.volume = 0.5;
  }

  public startBackground() {
    this.bg1Element.play();
  }

  public destroy() {
    this.bg1Element.pause();
  }
}
