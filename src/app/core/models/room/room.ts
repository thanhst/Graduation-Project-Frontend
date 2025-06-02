export class Room {
    roomID: string;
    classID: string|null;
    state: "opening" | "closed";
    host: string;
    createdAt: Date;
    endAt: Date|null;

    constructor(
        roomID: string = "roomID",
        classID: string|null = "classID",
        state: "opening" | "closed" = "opening",
        host: string = "userID",
        createdAt: Date = new Date(),
        endAt: Date|null = new Date(),
    ) {
        this.roomID = roomID;
        this.classID = classID;
        this.state = state;
        this.host = host;
        this.createdAt = createdAt;
        this.endAt = endAt;
    }
}
