import ProtocolRequired  from "./Packet/Connect/ProtocolRequiredHandle";
import IdentificationSuccessMessage  from "./Packet/Connect/IdentificationSuccessMessageHandler";


export class Protocole{

    connecting() { return ProtocolRequired()};
    login() {return IdentificationSuccessMessage()};

}






