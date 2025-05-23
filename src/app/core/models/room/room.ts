export class Room {
    roomID: string;
    classID: string;
    state: "open" | "close";
    host: string;
    createdAt: Date;
    endAt: Date;

    constructor(
        roomID: string = "roomID",
        classID: string = "classID",
        state: "open" | "close" = "open",
        host: string = "userID",
        createdAt: Date = new Date(),
        endAt: Date = new Date(),
    ) {
        this.roomID = roomID;
        this.classID = classID;
        this.state = state;
        this.host = host;
        this.createdAt = createdAt;
        this.endAt = endAt;
    }
}
