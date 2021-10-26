import { AggregateRoot } from "../AggregateRoot";
import { Option } from "./option";
import { Question } from "./question";

export class Module extends AggregateRoot {
  
  id: number | undefined;
  name: string;
  items: Question[];

  private constructor (name: string, items: Question[], id?: number) {
    super()
    this.id = id
    this.name = name
    this.items = items
  }

  public updateName(name: string) {
    this.name = name
    this.addDomainEvent({name:'NAME_CHANGE', param: name})
  }

  public addQuestion(question: Question) {
    this.items.push(question);
    this.addDomainEvent({name: 'NEW_QUESTION', param: question})
  }

  public removeQuestion(question: Question) {
    if (question.id == undefined) throw 'Question does not have a valid id'    
    this.items = this.items.filter((e) => {return e.id !== question.id})
    this.addDomainEvent({name: 'DELETE_QUESTION', param: question})
  }

  public addOptionToQuestion(question: Question, option: Option) {
    if (question.id == undefined) throw 'Question does not have a valid id' 
    let index = this.items.findIndex(q => q.id === question.id);
    if (index === -1) throw 'Question id does not appear in question list' 
    this.items[index].options.push(option)
    this.addDomainEvent({name:'NEW_OPTION', param: {question: question, option: option}})
  }

  public removeOptionFromQuestion(question: Question, option: Option) {
    if (question.id == undefined) throw 'Question does not have a valid id' 
    let index = this.items.findIndex(q => q.id === question.id);
    if (index === -1) throw 'Question id does not appear in question list' 
    this.items[index].options = this.items[index].options.filter((e) => {return e.id !== option.id})
    this.addDomainEvent({name:'DELETE_OPTION', param: {question: question, option: option}})
  }

}
