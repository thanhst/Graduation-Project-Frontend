export class Schedular {
    constructor(
        private schedularID:string ="schedularID",
        private roomID:string = "roomID",
        private hostName:string = "hostName",
        private className:string = "className",
        private startTime:string = "startTime",
        private createdAt:Date = new Date(),
        private updatedAt:Date = new Date()
    ){}
    public getClassName():string{
        return this.className;
    }
    public getHostName():string{
        return this.hostName;
    }
}
