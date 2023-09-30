
export type Subscription = () => void;

export interface Observable<T> {
  subscribe(callback: (data: T) => void): Subscription
}

type EventCallback<T> = (event: T) => void;
interface Listener<T> {
  callbacks: Record<number, EventCallback<T>>;
  latestValue?: T;
}

export class EventPublisher {
  public static nextEventId = 0;
  listeners: Record<string, Listener<any>> = {
  };

  public define<T>(eventName: string): Observable<T> {
    return {
      subscribe: (callback) => {
        const sub = this.on(eventName, callback);

        const listener = this.listeners[eventName];
        if (listener.latestValue) {
          callback(listener.latestValue);
        }

        return sub;
      }
    }
  }

  public on<T>(eventName: string, callback: (event: T) => void): Subscription {
    this.ensureListener(eventName);

    const eventId = ++EventPublisher.nextEventId;
    this.listeners[eventName].callbacks[eventId] = callback;

    return () => {
      delete this.listeners[eventName].callbacks[eventId];
    }
  }

  public emit<T>(eventName: string, event: T) {
    this.ensureListener(eventName);

    const listener: Listener<T> = this.listeners[eventName];
    listener.latestValue = event;

    Object.values(listener.callbacks).forEach(callback => {
      callback(event);
    });
  }

  private ensureListener(eventName: string) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = {
        callbacks: {}
      }
    }
  }
}
