export let SessionActive : Array<Session> = [];
var sessionList : Array<Session> = [];
let AccountsActive : Array<Accounts> = [];

export class SessionManager{

    static AddKeySession(KeyAccounts: VerifKey){
        let session = new Session(null, KeyAccounts, new Accounts("", JSON.parse('{"result":true, "count":42}')));
        SessionActive.push(session);
    }
    static AddAcount(account : Accounts){
        AccountsActive.push(account);
    }

    static AddPrimus(spark: any, sessionKey:VerifKey, username: string) : boolean{
        let IsOkay = false;
         SessionActive.forEach(session => {
             if(session.KeyArray.salt == sessionKey.salt){
                 AccountsActive.forEach(account =>{
                     if(account.username == username){
                        let test = new Session(spark, sessionKey, account);
                        sessionList.push(test);
                        IsOkay = true;
                     }
                 });
             }
             else{
                 IsOkay = false;
             }
        });
        SessionActive = sessionList;
        return IsOkay;
    }

    static SessionHanldeWrite(sparkSession : any) : Session{
        let mySession = new Session(null, SessionActive[0].KeyArray, new Accounts("", JSON.parse('{"result":true, "count":42}')));
        SessionActive.forEach(session => {
            if(session.sessionID == sparkSession){
                mySession = session;
            }

        });
        
        
        return mySession;
    }

    static DeconnexionSession(sparkSession: any){
        let i = 0;
        let indexAccount = 0;
        let indexSessionA = 0;
        SessionActive.forEach(session => {
            if(session.sessionID == sparkSession){
                SessionActive.splice(i, 1);
                AccountsActive.forEach(account => {
                    if(account.username == session.account.username){
                        AccountsActive.splice(indexAccount,1);
                        sessionList.forEach(sessionA =>{
                            if(sessionA == session){
                                sessionList.splice(indexSessionA, 1);
                            }
                            indexSessionA++;                    
                        });
                    }
                    indexAccount++;
                });
                
            }
            i++;

        });
        
        
    }

}

class Session{
    sessionID : any;
    KeyArray: VerifKey;
    account: Accounts;
    constructor(sessionID : any, KeyArray: VerifKey, account: Accounts ){
        this.sessionID = sessionID;
        this.KeyArray = KeyArray;
        this.account = account;

    }
}
 export class VerifKey{
    salt : string;
    key : unknown;

    constructor(salt: string, key: unknown){
        this.salt = salt;
        this.key = key;
    }
    
}

export class Accounts{
    username: string;
    accounts: JSON;

    constructor(username: string, accounts: JSON){
        this.username = username;
        this.accounts = accounts;
    }
}