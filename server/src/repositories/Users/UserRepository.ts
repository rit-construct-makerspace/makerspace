import { TrainingModule } from "../../models/training/trainingModule";
import { User } from "../../models/users/user";

/*
todo
get users by room,
search/get users by name
get users by module
*/

export interface IUserRepo {
  getUserById(userID: number): Promise<User>;
  createUser(args: any): Promise<User>;
  updateUser(args: any): Promise<User>;
  addTrainingToUser(userID: number, trainingModuleID: number): Promise<User>;
  removeTrainingFromUser(userID: number, trainingModuleID: number): Promise<void>;
  addHoldToUser(userID: number, holdID: number): Promise<User>;
  removeHoldFromUser(userID: number, holdID: number): Promise<void>;
  updateAboutMe(userID: number, aboutMe: String): Promise<User>;

}

export class UserRepository{
  getUserByID(userID: number): Promise<User> {
    throw new Error("Method not implemented.");
  }
  createUser(args: any) {
    throw new Error("Method not implemented.");
  }
  updateUser(args: any) {
    throw new Error("Method not implemented.");
  }
  addTrainingToUser(userID: number, trainingModuleID: number) {
    throw new Error("Method not implemented.");
  }
  removeTrainingFromUser(userID: number, trainingModuleID: number) {
    throw new Error("Method not implemented.");
  }
  addHoldToUser(userID: number, holdID: number){
    throw new Error("Method not implemented.");
  }
  removeHoldFromUser(userID: number, holdID: number){
    throw new Error("Method not implemented.");
  }
  updateAboutMe(userID: number, aboutMe: String) {
    throw new Error("Method not implemented.");
  }
    
}
