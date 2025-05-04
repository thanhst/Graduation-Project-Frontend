export class Room {
    constructor(
        roomID:string = "roomID",
        classID:string = "classID",
        state:"open"|"close",
        host:string = "userID",
        createdAt:Date = new Date(),
        endAt:Date = new Date(),
    ){}
}
