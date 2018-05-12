import { XMLHttpRequest } from "xmlhttprequest";
import * as config from "../config/config.json";
import { IConfig } from "../interfaces/IConfig";
import * as wowApi from "../interfaces/IWowAPI";

export class Commands {
    private options: IConfig = config.default as IConfig;
    private mods: Map<string, string> = new Map([["normal", "NM"], ["heroic", "HM"], ["mythic", "MM"]]);

    public RaidStatus(difficulty: string, value: number, boss: wowApi.Boss[]): string {
        if (value === 0) { return ""; }
        let result: string = `\r\n\t ${this.mods.get(difficulty)} : `;
        if (value === 1) {
            result += this.BossStatus(difficulty, boss).toString();
        } else if (value === 2) {
            result += "Clean";
        }
        return result;
    }

    public WowRequest(type: string, callback: any, args?: string[], fields?: string): void {
        let req: string = `https://eu.api.battle.net/wow/${type}/`;
        switch (args.length) {
            case 1:
                req += `${args[0]}/?`;
                break;
            case 2:
                req += `${args[0]}/${args[1]}?`;
            default:
                break;
        }
        if (fields) {
            req += `fields=${fields}&`;
        }
        req += `locale=${this.options.lang}&apikey=${this.options.wowToken}`;
        this.httpGetAsync(req, (data: any) => {
            callback(data);
        });
    }

    private BossStatus(difficulty: string, boss: wowApi.Boss[]): string {
        let count: number = 0;
        for (const a of boss) {
            if (a[difficulty + "Kills"] > 0) { count++; }
        }
        return (`${count} / ${boss.length}`);
    }

    private httpGetAsync(sUrl: string, callback: any) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (callback) {
                    callback(JSON.parse(xhr.responseText));
                }
            } else {
                if (callback) {
                    callback("error");
                }
            }
        };
        xhr.open("GET", sUrl, true); // true for asynchronous
        xhr.send(null);
    }
}
