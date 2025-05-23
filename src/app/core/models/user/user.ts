import { Account } from "../account/account";
import { Room } from "../room/room";

export class User {
    userId: string;
    fullName: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;

    accounts: Account[];
    notifications: Notification[];
    rooms: Room[];

    constructor(
        userId: string = "",
        fullName: string = "",
        profilePicture: string = "",
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
        accounts: Account[] = [],
        notifications: Notification[] = [],
        rooms: Room[] = []
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.profilePicture = profilePicture;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.accounts = accounts;
        this.notifications = notifications;
        this.rooms = rooms;
    }
}
