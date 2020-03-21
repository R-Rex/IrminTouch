import http from "http";
import express, {NextFunction, Request, Response} from "express";

const Primus = require('primus');

let fesse = true;
let fesse2 = true;
let fesse3 = true;

export class IrminTouchWorld{


    StartWorld(){
        let world = express();
        const serverWorld = http.createServer(world);

        serverWorld.listen(5555);

        const primusWorld = new Primus(serverWorld, { transports: 'websocket', transformer: 'engine.io' });

        primusWorld.on('connection', (spark: any) => {
            console.log("new client");
            spark.on('data',  (data: any) => {
                console.log(data);
                if(fesse){
                    spark.write({"_messageType":"ProtocolRequired","requiredVersion":1594,"currentVersion":1594,"_isInitialized":true});
                    spark.write({"_messageType":"HelloGameMessage"});
                    fesse = false;
                }
                if(fesse2){
                    spark.write({"_messageType":"AuthenticationTicketAcceptedMessage"});
                    spark.write({"_messageType":"ServerSettingsMessage","lang":"fr","community":0,"gameType":0,"_isInitialized":true});
                    spark.write({"_messageType":"ServerOptionalFeaturesMessage","features":[1,2,3,5],"_isInitialized":true});
                    spark.write({"_messageType":"ServerSessionConstantsMessage","variables":[{"_type":"ServerSessionConstantInteger","id":1,"value":1500000},{"_type":"ServerSessionConstantLong","id":2,"value":7200000},{"_type":"ServerSessionConstantInteger","id":3,"value":30},{"_type":"ServerSessionConstantLong","id":4,"value":86400000},{"_type":"ServerSessionConstantLong","id":5,"value":60000}],"_isInitialized":true});
                    spark.write({"_messageType":"AccountCapabilitiesMessage","accountId":99258764,"tutorialAvailable":true,"breedsVisible":32767,"breedsAvailable":32767,"status":0,"accountRights":[],"_isInitialized":true,"_accountRightsMap":{}});
                    spark.write({"_messageType":"TrustStatusMessage","trusted":true,"_isInitialized":true});
                    fesse2 = false;
                }
                if(fesse3)
                {
                    spark.write({"_messageType": "CharactersListMessage", "hasStartupActions": false, "characters": [], "_isInitialized": true});
                    fesse3 = false;
                }
                if(data["data"]["type"] == "CharacterCreationRequestMessage"){
                    console.log("test");
                    spark.write({_messageType: "CharacterCreationResultMessage", result: 0, _isInitialized: true});
                }
           });


        });
    }
}
