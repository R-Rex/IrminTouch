import {Connect} from "./Connect/login";
import {ResponseLogin} from "../Enum/ResponseLogin";
import {Protocole} from "../Protocole";
import express, {Request, Response} from "express";
import http from "http";
import {irminDataBase} from "../Database";
import {SessionManager, VerifKey} from "../Manager/SessionManager";
import {IrminTouchWorld} from "../World";

const Primus = require('primus');

export let IdSession : any = null;

class IrminTouch{

    public Start() {

        this.StartEmulator();
    }


    private StartEmulator(){


            const port = 3000;
            const portAuth = 403;
            let app = express();
            let login = express();
            login.use(express.urlencoded({type: '*/*'}));
            const server = http.createServer(app);

            server.listen(port);
            login.listen(portAuth);

            const primus = new Primus(server, { transports: 'websocket', transformer: 'engine.io' });

            primus.save('/primus/primus.js');

            app.get('/',  (req: Request, res: Response) => {
                res.sendStatus(404);
            });

            app.get('/primus/primus.js', (req: Request, res: Response) => {
                res.sendFile("/primus/primus.js");
            });

            login.post('/Api/CreateApiKey', (req: Request, res: Response) => {
                (async () => {
                    let connect = await new Connect(req.body["login"],req.body["password"],req.body["long_life_token"],
                        req.hostname).CreateApiKey();
                    if(connect !== ResponseLogin.Ban && connect != ResponseLogin.Incorrect){
                        res.json(connect);
                    }
                    else{
                        res.status(601).json({reason: connect});
                    }
                })()
            });
            login.get('/Account/CreateToken', (req: Request, res: Response) => {
                let token = Connect.ApiGenerateKey();
                res.json({ "token": token });
            });
            app.get('/config.json?', (req: Request, res: Response) => {
                res.sendFile("/primus/config.json");
            });

            primus.on('connection', (spark: any) => {
                console.log("new client");

                spark.on('data',  (data: any) => {
                     this.DataSend(spark, data);
                });

            });



    }
    
    private async HandleCalling(handle : Protocole, packet : keyof Protocole, data: any, spark : any){
        let handleData : Array<JSON> = [];
        if(data["call"] == "connecting"){
            handleData =  handle[packet]();
        }
        if(data["call"] == "login")
        {         
            let verificationAdd = new VerifKey(data["data"]["salt"], data["data"]["key"]);
            let verifOkay = SessionManager.AddPrimus(spark,verificationAdd, data["data"]["username"]);
            if(verifOkay){
                console.log(packet);
                handleData =  handle[packet]();
              
             spark.write({_messageType: "ServersListMessage", servers:[{_type: "GameServerInformations",
                     charactersCount: 0, date: 1580554936900, id: 419, status: 3, completion: 0, isSelectable: true,
                     _gameTypeId: 0,_name:"IrminTouch"}],_isInitialized:true,messageType:"ServersListMessage" });
             
           }
        }
        if(data["call"] == "sendMessage")
        {
            spark.write({_messageType: "SelectedServerDataMessage", address: "127.0.0.1", canCreateNewCharacter: true,
                port: 5555, serverId: 419, ticket: "39515c393a6e716e30e9768474b72616",
                _access: "http://127.0.0.1:5555"});
            spark.end();
        }

        return handleData;
    }
    private async DataSend(spark : any,data: any)
    {
        console.log(data);
        IdSession = spark;
        let f = new Protocole();
        let teste : Array<JSON> = await this.HandleCalling(f, data["call"], data, spark);
        teste.forEach(handle => spark.write(handle));
    }
}



let dataBase = new irminDataBase();
new IrminTouchWorld().StartWorld();
new IrminTouch().Start();
dataBase.LoadData(Date.now());

