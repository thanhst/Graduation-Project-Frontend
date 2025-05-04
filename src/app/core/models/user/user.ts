export class User {
    constructor(
        private userName:string = "username"
    ){}
    getUsername():string{
        return this.userName;
    }
}
