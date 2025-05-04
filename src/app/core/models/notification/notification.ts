
export class Notification {
    constructor(
        private id: string = "id",
        private classID: string = "className",
        private userID: string = "classHost",
        private descriptions: string = "descriptions",
        private type: 'info' | 'warning' | 'error' = 'info',
        private createdAt: Date = new Date()
    ) {}
    public getId(): string {
        return this.id;
    }
    public getClassID(): string {
        return this.classID;
    }
    public getUserID(): string {
        return this.userID;
    }
    public getDescriptions(): string {
        return this.descriptions;
    }
    public getType(): string {
        return this.type;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
}
