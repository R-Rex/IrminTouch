import {ResponseLogin} from "../Enum/ResponseLogin";
import fs from "fs";

const mysql = require('mysql2');

let rawdata : string = fs.readFileSync("C:\\GitHub\\IrminTouch\\src\\database\\database.json").toString();
let connect : JSON = JSON.parse(rawdata);

const connection = mysql.createConnection(connect);

export class irminDataBase{


    public async LoadData(msStart : number){
        connection.connect((err: any) => {
            console.log("Connexion SQL réussie");
        });  
    }

    public async Login(username: string, password: string){
        let response: string;
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool(connect);
        let [rows, fields] = await Promise.all([pool.query(`SELECT * FROM accounts WHERE username = '${username}' && password = '${password}'`)]);
        if(rows[0].length != 0){
            if(rows[0][0].ban !== 1){
                response = JSON.stringify({username: username, Pseudo: rows[0][0].Pseudo, communityId: rows[0][0].communityId, hasRights: rows[0][0].hasRights,
                     subscriptionEndDate: rows[0][0].subscriptionEndDate, wasAlreadyConnected: rows[0][0].wasAlreadyConnected,
                     accountCreation: rows[0][0].accountCreation, hasConsoleRight: rows[0][0].hasConsoleRight, IsOK :  ResponseLogin.Ok});
            }
            else{
                response = JSON.stringify({IsOK : ResponseLogin.Ban});
            }
        }
        else{
            response = JSON.stringify({IsOK : ResponseLogin.Incorrect});
        }
        await pool.end();

        return response;

    }
}