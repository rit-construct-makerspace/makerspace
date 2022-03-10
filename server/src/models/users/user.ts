import { Hold } from "../users/hold";
import { Privilege } from "../users/privilege";
import { TrainingModule } from "../training/trainingModule";

export interface User{
    id: number
    firstName: string
    lastName: string
    email: string
    isStudent: boolean
    privilege: Privilege
    registrationDate: Date
    holds: [Hold]
    trainingModules: [TrainingModule]
    year: number
    college: string
    major: string
    aboutMe: string
}
