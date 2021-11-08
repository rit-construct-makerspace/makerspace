import { ModuleRepo } from "../../repositories/Training/ModuleRepository";
import { AggregateRoot } from "../AggregateRoot";
import { ModuleChanges } from "../events/DomainEvents";
import { Option } from "./option";
import { Question } from "./question";

// follows aggreate root pattern. Idea is that you can make a number of
// changes to a module instance (add options to questions, change name, etc.) 
// and then save the changes in a single unit of work using the module repoe
export class Module extends AggregateRoot {
  id: number | undefined;
  name: string;
  items: Question[];

  public constructor(name: string, items: Question[], id?: number) {
    super();
    this.id = id;
    this.name = name;
    this.items = items;
  }

  public static async create(name: string, items: Question[]): Promise<Module> {
    let mr = new ModuleRepo();
    const module = new Module(name, items);
    return await mr.addModule(module);
  }

  public updateName(name: string) {
    this.name = name;
    this.addDomainEvent({ name: ModuleChanges.NAME_CHANGE, param: name });
  }

  public addQuestion(question: Question) {
    this.items.push(question);
    this.addDomainEvent({ name: ModuleChanges.NEW_QUESTION, param: question });
  }

  public removeQuestion(question: Question) {
    if (question.id == undefined) throw "Question does not have a valid id";
    this.items = this.items.filter((e) => {
      return e.id !== question.id;
    });
    this.addDomainEvent({
      name: ModuleChanges.DELETE_QUESTION,
      param: question,
    });
  }

  public addOptionToQuestion(question: Question, option: Option) {
    if (question.id == undefined) throw "Question does not have a valid id";
    let index = this.items.findIndex((q) => q.id === question.id);
    if (index === -1) throw "Question id does not appear in question list";
    this.items[index].options.push(option);
    this.addDomainEvent({
      name: ModuleChanges.NEW_OPTION,
      param: { question: question, option: option },
    });
  }

  public removeOptionFromQuestion(question: Question, option: Option) {
    if (question.id == undefined) throw "Question does not have a valid id";
    let index = this.items.findIndex((q) => q.id === question.id);
    if (index === -1) throw "Question id does not appear in question list";
    this.items[index].options = this.items[index].options.filter((e) => {
      return e.id !== option.id;
    });
    this.addDomainEvent({
      name: ModuleChanges.DELETE_OPTION,
      param: { question: question, option: option },
    });
  }
}
