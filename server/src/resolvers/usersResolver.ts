import {UserRepository} from "../repositories/Users/UserRepository";

//TODO: Update all "args" parameters upon implementation
const UsersResolvers = {
    Query: {
      user: async (_: any, args: any, context: any) => {
        try {
          const ur = new UserRepository();
          return await ur.getUserByID(args.id);
          //multiple users?
        } catch (e) {
          console.log("Error:", e);
        }
      },
    },

    Mutation: {
        addStudentUser: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            return await ur.addUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },
        addFacultyUser: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            return await ur.addUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },

        updateFacultyUser: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.updateUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },

        updateStudentUser: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.updateUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },
    
        addTraining: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.addTrainingToUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },

        removeTraining: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.removeTrainingFromUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },

        addHold: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.addTrainingToUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },

        removeHold: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.addTrainingToUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },

        addDescription: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.addDescriptionToUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        }
      }
        
        
};

export default UsersResolvers;
