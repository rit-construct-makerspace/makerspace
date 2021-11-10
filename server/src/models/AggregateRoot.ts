
import { IDomainEvent } from "./events/DomainEvents";

export abstract class AggregateRoot {

  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent (domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
  }

  public clearEvents (): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

}