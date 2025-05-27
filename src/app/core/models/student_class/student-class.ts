import { Classroom } from "../classroom/classroom";
import { User } from "../user/user";

export class StudentClass {
    public classID: string;
    public userID: string;
    public state: 'joined' | 'waiting';
    public createdAt: Date;
    public joinedAt: Date;
    User?:User;
    Classroom?:Classroom;

    constructor(
        classID: string = 'classID',
        userID: string = 'userID',
        state: 'joined' | 'waiting' = 'waiting',
        createdAt: Date = new Date(),
        joinedAt: Date = new Date()
    ) {
        this.classID = classID;
        this.userID = userID;
        this.state = state;
        this.createdAt = createdAt;
        this.joinedAt = joinedAt;
    }
}
