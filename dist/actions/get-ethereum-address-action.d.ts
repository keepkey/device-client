import { NodeVector } from "../node-vector";
import EthereumAddress = DeviceMessages.EthereumAddress;
export declare class GetEthereumAddressAction {
    static operation(client: any, addressN: NodeVector, showDisplay: boolean): Promise<EthereumAddress>;
}
