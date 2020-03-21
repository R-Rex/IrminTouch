import {BulderPacket} from "../index";
import {SessionManager, VerifKey, SessionActive} from "../../../Manager/SessionManager";


export default function HelloConnectMessage() : JSON{
    let Builder = new BuldingKeyMsg();
    let salt : string = Builder.SaltGenerate();
    let key = Builder.KeyGenerate(salt);

    let handle = {salt: salt, key: key};

    let build = new BulderPacket(handle, "HelloConnectMessage");
    let packetBuild = build.BuildPacket();

    let SessionKey : VerifKey = new VerifKey(salt, key);
    SessionManager.AddKeySession(SessionKey)
    
    return packetBuild;
}

class BuldingKeyMsg{

    KeyGenerate(salt: string){
        var data = [];
        for (var i = 0; i < salt.length; i++){  
            data.push(salt.charCodeAt(i));
        }
        return data;

    }
    SaltGenerate() : string{
        let tokenFinal : string = "";
        const keyChar : string = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLXCVBN0123456789-";
        const keyCharPossibl : number = keyChar.length;

        for(let i = 0; i < 32; i++){
            let num : number = Math.floor(Math.random() * Math.floor(keyCharPossibl));
            tokenFinal = tokenFinal + keyChar[num];
        }

        return tokenFinal;
    }
}
