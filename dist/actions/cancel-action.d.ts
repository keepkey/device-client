import { BasicClient } from "../device-client";
import { Features } from "../global/features";
export declare class CancelAction {
    static operation(client: BasicClient): Promise<Features>;
}
