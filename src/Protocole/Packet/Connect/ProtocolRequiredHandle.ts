import {BulderPacket} from "../index";
import HelloConnectMessage from "./HelloConnectMessageHandle";

export default function ProtocolRequired() : Array<JSON> {
    let requiredVersion : number = 1594; 
    let currentVersion : number = 1594;

    let handle  = {requiredVersion: requiredVersion, currentVersion: currentVersion};

    let build = new BulderPacket(handle, "ProtocolRequired");
    let packetBuild = build.BuildPacket();
    let helloHandle = HelloConnectMessage();

    let packet : Array<JSON> = [];

    packet.push(packetBuild);
    packet.push(helloHandle);

    return packet;
}