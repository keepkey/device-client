import { DeviceClient } from "../device-client";
export declare class FirmwareUploadAction {
    private static firmwareFileMetaData;
    private static client;
    private static payload;
    static operation(client: DeviceClient): Promise<void>;
    private static checkDeviceInBootloaderMode(features);
    private static validateFirmwareFileSize();
    private static checkHash(hash, hashName, expectedHash);
    private static validateFirmwarePayloadDigest();
    private static validateFirmwareImageDigest();
    private static verifyManufacturerPrefixInFirmwareImage();
    private static sendFirmwareToDevice();
    private static eraseFirmware();
}
