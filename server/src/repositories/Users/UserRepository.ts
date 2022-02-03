import { User } from "../../models/users/user";

export interface IUserRepo {
  getUserById(userID: number): Promise<User>;
}

export class UserRepository{
  getUserByID(userID: number): Promise<User> {
    throw new Error("Method not implemented.");
  }
  addUser(args: any) {
    throw new Error("Method not implemented.");
  }
  updateUser(args: any) {
    throw new Error("Method not implemented.");
  }
  removeTrainingFromUser(args: any) {
    throw new Error("Method not implemented.");
  }
  addTrainingToUser(args: any) {
    throw new Error("Method not implemented.");
  }
  addDescriptionToUser(args: any) {
    throw new Error("Method not implemented.");
  }
    
}
