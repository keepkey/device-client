import { Features, IFeatures } from "./global/features";
export declare class FeaturesService {
    private static firmwareFileMetaData;
    private static deviceProfiles;
    private static getDeviceCapabilities(features);
    private resolver;
    private rejector;
    private _promise;
    setValue(features: IFeatures): void;
    readonly promise: Promise<Features>;
    clear(): void;
}
