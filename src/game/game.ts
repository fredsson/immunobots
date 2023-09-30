import { Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Player } from "./player";

export class Game {
  private player: Player = new Player();

  public playerPositionChanged: Observable<Vec2> = this.player.positionChanged;

  constructor() {
  }
}
