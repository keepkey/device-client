/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
export declare abstract class Transport {
    private deviceData;
    static MSG_HEADER_LENGTH: number;
    deviceInUse: boolean;
    private messageMaps;
    private messageMap;
    private protoBuf;
    private pendingWriteQueue;
    readonly deviceId: any;
    readonly vendorId: any;
    readonly productId: any;
    protected readonly hasReportId: boolean;
    protected readonly reportId: number;
    protected readonly messageHeaderStart: string;
    constructor(deviceData: any);
    protected abstract _write(message: ByteBuffer): Promise<any>;
    protected abstract _read(): Promise<any>;
    setMessageMap(deviceType: any, proto: any): void;
    write(txProtoMsg: any): Promise<void>;
    read(): Promise<any>;
    protected parseMsgHeader(msgBB: any): {
        msgType: any;
        msgLength: any;
    };
    private parseMsg(msgType, msgBB);
    private getMsgType(msgClass);
    private getMsgClass(msgType);
}
