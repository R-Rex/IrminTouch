
import {IdSession} from "../../../Auth/index";
import {SessionManager} from "../../../Manager/SessionManager";

export default function IdentificationSuccessMessage() : Array<JSON> 
{
    let test : any = SessionManager.SessionHanldeWrite(IdSession);
    let applicationame = SaltGenerate();

    let packet = {_messageType:"IdentificationSuccessMessage",login:test.account.accounts["usernme"],nickname:test.account.accounts["Pseudo"],
    accountId:99258764,communityId:0,hasRights:false,secretQuestion:"",subscriptionEndDate:0,wasAlreadyConnected:false,
    accountCreation:1469100636000,hasConsoleRight:false,_isInitialized:true,_groupFlags:"",_applicationName:applicationame};

    return [JSON.parse(JSON.stringify(packet))];

}
function SaltGenerate() : string{
    let tokenFinal : string = "";
    const keyChar : string = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLXCVBN0123456789-";
    const keyCharPossibl : number = keyChar.length;

    for(let i = 0; i < 32; i++){
        let num : number = Math.floor(Math.random() * Math.floor(keyCharPossibl));
        tokenFinal = tokenFinal + keyChar[num];
    }

    return tokenFinal;
}
