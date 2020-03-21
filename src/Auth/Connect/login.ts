import {ResponseLogin} from "../../Enum/ResponseLogin";
import {irminDataBase} from "../../Database/index";
import {SessionManager, Accounts} from "../../Manager/SessionManager";

export class Connect{
    login: string;
    password: string;
    long_life_token: boolean;
    Ip: String;
    constructor(login: string, password: string, long_life_token: boolean, Ip: String){
        this.login = login;
        this.password = password;
        this.long_life_token = long_life_token;
        this.Ip = Ip;
    }

    async CreateApiKey(){
        let login = new irminDataBase();
        let response = await login.Login(this.login, this.password);
        let responseJSON = JSON.parse(response);
        let account = new Accounts(responseJSON["username"], responseJSON);
        SessionManager.AddAcount(account);
        switch(responseJSON["IsOK"]){
                 case ResponseLogin.Ok:
                      let key : string = await Connect.ApiGenerateKey() ;
                      let refresh_token: string = await Connect.ApiGenerateKey();
                      let responses = { "key": key, "account_id": 1, "ip": this.Ip, "added_date": "2020-01-19T15:44:35+01:00", "meta": [], "data": { "country": "FR", "currency": "EUR" }, "access": [], "refresh_token": refresh_token, "expiration_date": "2020-01-19T18:44:35+01:00" };
                      return responses
                 case ResponseLogin.Incorrect:
                     return ResponseLogin.Incorrect
                 case ResponseLogin.Ban:
                     return ResponseLogin.Ban
                    
             }
    }


    static ApiGenerateKey() : string{
        let tokenFinal : string = "";
        const keyChar : string = "azertyuiopqsdfghjklmwxcvbn0123456789-";
        const keyCharPossibl : number = keyChar.length;

        for(let i = 0; i < keyCharPossibl; i++){
            let num : number = Math.floor(Math.random() * Math.floor(keyCharPossibl));
            tokenFinal = tokenFinal + keyChar[num];
        }

        return tokenFinal;
    }
}
