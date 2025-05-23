export class Scheduler {
    schedulerID: string;
    roomID: string;
    hostName: string;
    className: string;
    startTime: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        schedulerID: string = "schedulerID",
        roomID: string = "roomID",
        hostName: string = "hostName",
        className: string = "className",
        startTime: string = "startTime",
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.schedulerID = schedulerID;
        this.roomID = roomID;
        this.hostName = hostName;
        this.className = className;
        this.startTime = startTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getClassName(): string {
        return this.className;
    }

    public getHostName(): string {
        return this.hostName;
    }
}
