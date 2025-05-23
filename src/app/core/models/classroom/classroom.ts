export class Classroom {
    classID: string;
    className: string;
    userCreated: string;
    descriptions: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        classID: string = "classID",
        className: string = "className",
        userCreated: string = "userCreated",
        descriptions: string = "description",
        url: string = "url",
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
    ) {
        this.classID = classID;
        this.className = className;
        this.userCreated = userCreated;
        this.descriptions = descriptions;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
