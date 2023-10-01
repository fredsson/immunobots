import { EventPublisher } from "../utils/event-publisher";

export class HealthService {
  private health = 100;
  private healthDecreasePerEnemy: number;
  private eventPublisher = new EventPublisher();

  public healthChanged = this.eventPublisher.define<number>('healthChanged');

  constructor(totalNoOfEnemies: number) {
    this.healthDecreasePerEnemy = totalNoOfEnemies / 1000;

    this.eventPublisher.emit('healthChanged', this.health);
  }

  public remove(amount: number): void {
    this.health -= amount;
    this.health = Math.max(this.health, 0);
    this.eventPublisher.emit('healthChanged', this.health);
  }

  public removeBasedOnEnemies(enemiesAlive: number, dt: number): void {
    const amount = enemiesAlive * this.healthDecreasePerEnemy * dt;
    this.health -= amount;
    this.health = Math.max(this.health, 0);
    console.log(this.health);

    this.eventPublisher.emit('healthChanged', this.health);
  }

}
