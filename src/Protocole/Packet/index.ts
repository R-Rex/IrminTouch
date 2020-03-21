export class BulderPacket
{
    private data : any;
    private namePacket : string;

    constructor(data: any, namePacket: string){
        this.data = data;
        this.namePacket = namePacket;
    }

    BuildPacket() : JSON {
        let packet : any = [{}];
        packet[0]["_messageType"] = this.namePacket;
        packet[0] = JSON.parse(JSON.stringify(packet[0]).replace('}', ',') + JSON.stringify(this.data).replace('{',''));
        packet[0]["_isInitialized"] = true;
        return (<JSON>packet[0]);

    }
}