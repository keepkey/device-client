import {DeviceClient} from "./device-client";

export interface HidHelper {
  getActiveClient(): Promise<DeviceClient>;
}