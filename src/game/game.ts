import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Player } from "./player";
import { Zone } from "./zone";

export class Game {
  private player: Player = new Player();
  private zone?: Zone;

  private eventPublisher = new EventPublisher();

  public playerPositionChanged: Observable<Vec2> = this.player.positionChanged;
  public zoneLoaded: Observable<Zone> = this.eventPublisher.define('zoneLoaded');

  constructor() {
    Zone.load('demo').then(z => {
      this.zone = z;
      this.player.init(this.zone.playerStartPosition);
      this.eventPublisher.emit('zoneLoaded', this.zone);
    })

  }

  public destroy() {
    this.player.destroy();
    this.zone?.destroy();
  }

  public update(dt: number) {
    this.player.update(dt);
  }

}
