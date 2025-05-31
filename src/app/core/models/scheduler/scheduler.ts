import { Classroom } from "../classroom/classroom";
import { Room } from "../room/room";
import { User } from "../user/user";

export class Scheduler {
    schedulerID: string;
    roomID: string;
    userID: string;
    classID: string|null;
    startTime: string;
    title:string;
    description:string;
    createdAt: Date;
    updatedAt: Date;
    Classroom?:Classroom;
    Room?:Room;
    User?:User;
    constructor(
        schedulerID: string = "schedulerID",
        roomID: string = "roomID",
        userID: string = "hostName",
        classID: string|null=null,
        startTime: string = "startTime",
        title:string ="",
        description:string ="",
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.schedulerID = schedulerID;
        this.roomID = roomID;
        this.userID = userID;
        this.classID = classID;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
