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
        createStudentUser: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            return await ur.createUser(args)
          } catch (e) {
            console.log("Error", e)
          }
        },
        createFacultyUser: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            return await ur.createUser(args)
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
            await ur.addTrainingToUser(args.userID, args.trainingModuleID)
          } catch (e) {
            console.log("Error", e)
          }
        },

        removeTraining: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.removeTrainingFromUser(args.userID, args.trainingModuleID)
          } catch (e) {
            console.log("Error", e)
          }
        },

        addHold: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.addHoldToUser(args.userID, args.holdID)
          } catch (e) {
            console.log("Error", e)
          }
        },

        removeHold: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.removeHoldFromUser(args.userID, args.holdID)
          } catch (e) {
            console.log("Error", e)
          }
        },

        updateAboutMe: async (_: any, args: any) => {
          try {
            const ur = new UserRepository();
            await ur.updateAboutMe(args.userID, args.aboutMe)
          } catch (e) {
            console.log("Error", e)
          }
        }
      }
        
        
};

export default UsersResolvers;
