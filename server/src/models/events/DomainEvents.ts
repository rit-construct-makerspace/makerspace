export interface IDomainEvent {
    name: ModuleChanges;
    param: any;
  }

export enum ModuleChanges {
  NAME_CHANGE,
  NEW_QUESTION,
  DELETE_QUESTION,
  NEW_OPTION,
  DELETE_OPTION
}