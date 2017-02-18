import { NodeVector } from "../node-vector";
import MultisigRedeemScriptType = DeviceMessages.MultisigRedeemScriptType;
export declare class GetAddressAction {
    static operation(client: any, addressN: NodeVector, coinName: string, showDisplay: boolean, multisig: MultisigRedeemScriptType): Promise<any>;
}
