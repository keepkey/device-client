import { DeviceClient } from "../device-client";
import { DevicePolicyEnum } from "../global/device-policy-enum";
export declare class ApplyPolicyAction {
    static operation(client: DeviceClient, policyName: DevicePolicyEnum, enabled: boolean): Promise<any>;
}
