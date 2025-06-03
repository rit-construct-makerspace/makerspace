import { CurrentUser } from "./CurrentUserProvider";

export function isAdmin(user: CurrentUser) {
    return user.admin;
}

export function isManager(user: CurrentUser, makerspaceID: number) {
    if (isAdmin(user)) {
        return true;
    }

    return user.manager.includes(makerspaceID);
}

export function isStaff(user: CurrentUser, makerspaceID: number) {
    if (isManager(user, makerspaceID)) {
        return true;
    }

    return user.staff.includes(makerspaceID);
}

export function isTrainer(user: CurrentUser, equipmentID: number, makerspaceID: number) {
    if (isManager(user, makerspaceID)) {
        return true;
    }

    return user.trainer.includes(equipmentID);
}