export interface IBoss {
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

export interface IRaid {
    name: string;
    lfr: number;
    normal: number;
    heroic: number;
    mythic: number;
    id: number;
    bosses: IBoss[];
}
