import * as ByteBuffer from "bytebuffer";

export interface SectorDefinition {
  name: string;
  start: string;
  end: string;
  size: string;
  ro?: boolean;
}

export interface SectorData {
  name: string;
  start: number;
  end: number;
  size: number;
  ro: boolean;
  buffer?: ByteBuffer;
}

const SECTOR_DATA: Array<SectorDefinition> = require('../../dist/device-sector-map.json');

export class DeviceSectorProvider {
  private static instance: DeviceSectorProvider;
  public static getInstance(): DeviceSectorProvider {
    if (!DeviceSectorProvider.instance) {
      DeviceSectorProvider.instance = new DeviceSectorProvider();
      DeviceSectorProvider.instance.initialize(SECTOR_DATA);
    }
    return DeviceSectorProvider.instance;
  }

  private lowestAddress: number = 0xffffffff;
  public get flashStart():number {
    return this.lowestAddress;
  }

  private highestAddress: number = 0;
  public get flashEnd(): number {
    return this.highestAddress;
  }

  public get flashSize() {
    return this.highestAddress - this.lowestAddress + 1;
  }

  public sectorData: Array<SectorData> = [];

  private constructor() {}

  public initialize(initialSectorData: Array<SectorDefinition>) {
    this.sectorData.length = 0;

    this.sectorData = initialSectorData.map((s: SectorDefinition): SectorData => {
      let sector: SectorData = {
        name: s.name,
        start: parseInt(s.start),
        end: parseInt(s.end),
        size: parseInt(s.size),
        ro: !!s.ro,
      };
      console.assert(sector.end - sector.start + 1 === sector.size, 'Sector Table Error: Size and range do not match');
      this.lowestAddress = Math.min(this.lowestAddress, sector.start);
      this.highestAddress = Math.max(this.highestAddress, sector.end);
      return sector;
    });

    this.sectorData.sort((a, b) => a.start - b.start);

    let lastEnd = this.lowestAddress - 1;
    this.sectorData.forEach((sector) => {
      console.assert(sector.start === lastEnd + 1,
        `Sector Table Error: Gaps or overlapping ranges not allowed. ${sector.name} expected to start at ${(lastEnd+1).toString(16)}.`);
      lastEnd = sector.end;
    });
  }
}