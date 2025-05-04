export class Account {
    constructor(
        accountID: string='accountID',
        userID:string = 'userID',
        email:string = 'email',
        password:string='password',
        loginMethod:'email'|'google'|'github' = 'email',
        createdAt:Date = new Date(),
        updatedAt:Date = new Date()
    ){}
}
