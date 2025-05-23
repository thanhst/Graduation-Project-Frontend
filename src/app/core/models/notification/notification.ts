export class Notification {
    id: string;
    classID: string;
    userID: string;
    descriptions: string;
    type: 'info' | 'warning' | 'error';
    createdAt: Date;

    constructor(
        id: string = "id",
        classID: string = "className",
        userID: string = "classHost",
        descriptions: string = "descriptions",
        type: 'info' | 'warning' | 'error' = 'info',
        createdAt: Date = new Date()
    ) {
        this.id = id;
        this.classID = classID;
        this.userID = userID;
        this.descriptions = descriptions;
        this.type = type;
        this.createdAt = createdAt;
    }
}
