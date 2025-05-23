export class Emotion {
    classID: string;
    roomID: string;
    userID: string;
    emotion: string;
    createdAt: Date;

    constructor(
        classID: string = "classID",
        roomID: string = "roomID",
        userID: string = "userID",
        emotion: string = "emotion",
        createdAt: Date = new Date(),
    ) {
        this.classID = classID;
        this.roomID = roomID;
        this.userID = userID;
        this.emotion = emotion;
        this.createdAt = createdAt;
    }
}
