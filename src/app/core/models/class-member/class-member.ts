export class ClassMember {
    classID: string;
    userID: string;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        classID: string = "classID",
        userID: string = "userID",
        joinedAt: Date = new Date(),
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.classID = classID;
        this.userID = userID;
        this.joinedAt = joinedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
