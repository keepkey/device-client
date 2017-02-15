interface FirmwareFileMetadata {
  file: string;
  digest: string;
  trezorDigest: string;
  size: number;
  timeStamp: Date;
  version: string;
}
