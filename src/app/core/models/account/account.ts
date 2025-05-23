export class Account {
    accountID: string;
    userID: string;
    email: string;
    password: string;
    loginMethod: 'email' | 'google' | 'github';
    createdAt: Date;
    updatedAt: Date;

    constructor(
        accountID: string = 'accountID',
        userID: string = 'userID',
        email: string = 'email',
        password: string = 'password',
        loginMethod: 'email' | 'google' | 'github' = 'email',
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.accountID = accountID;
        this.userID = userID;
        this.email = email;
        this.password = password;
        this.loginMethod = loginMethod;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
