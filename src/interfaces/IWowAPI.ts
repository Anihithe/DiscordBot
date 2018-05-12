export interface Boss {
    id: number;
    name: string;
    normalKills: number;
    normalTimestamp: any;
    heroicKills?: number;
    heroicTimestamp?: number;
    lfrKills?: number;
    lfrTimestamp?: number;
    mythicKills?: number;
    mythicTimestamp?: number;
}

export interface Raid {
    name: string;
    lfr: number;
    normal: number;
    heroic: number;
    mythic: number;
    id: number;
    bosses: Boss[];
}
