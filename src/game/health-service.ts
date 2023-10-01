import { EventPublisher } from "../utils/event-publisher";

export class HealthService {
  private health = 100;
  private eventPublisher = new EventPublisher();

  public healthChanged = this.eventPublisher.define<number>('healthChanged');

  constructor() {
    this.eventPublisher.emit('healthChanged', this.health);
  }

  public remove(amount: number): void {
    this.health -= amount;
    this.eventPublisher.emit('healthChanged', this.health);
  }

}
