import * as config from "../config/config.json";
import { IConfig } from "../interfaces/IConfig";
import * as wowApi from "../interfaces/IWowAPI";
import { Commands } from "./commands";

export class BotCommands {
    private cmds: Map<string, string> = new Map();
    private commands: Commands;
    private options: IConfig = config.default as IConfig;

    constructor() {
        this.initMap();
        this.commands = new Commands();
    }

    public help(): string {
        let help: string = "";
        for (const [a, b] of this.cmds) {
            help += a + "\t:" + b + "\r\n";
        }
        return help;
    }

    public getMembers(args: string[], callback: any): void {
        const members: string[] = new Array();
        let lsMembers: string = "";
        this.commands.WowRequest("guild", (data: any) => {
            for (const member of data.members) {
                members.push(member.character.name);
            }
            members.sort();
            for (const member of members) {
                lsMembers += member + "\r\n";
            }
            if (callback) {
                callback(lsMembers);
            }
        }, args, "members");
    }

    public getMemberProgress(args: string[], callback: any): void {
        this.commands.WowRequest("character", (data) => {
            let result: string = "";
            if (data !== "error") {
                for (const raid of data.progression.raids) {
                    const raidContent = raid as wowApi.Raid;
                    if (this.options.raidsID.indexOf(raidContent.id) > -1) {
                        result += `\r\n${raidContent.name} :`;
                        result += this.commands.RaidStatus("normal", raidContent.normal, raidContent.bosses);
                        result += this.commands.RaidStatus("heroic", raidContent.heroic, raidContent.bosses);
                        result += this.commands.RaidStatus("mythic", raidContent.mythic, raidContent.bosses);
                    }
                }
                if (result === "") {
                    result = "error";
                }
            } else {
                result = "Realm or Character not found";
            }
            callback(result);
        }, args, "progression");
    }

    private initMap() {
        this.cmds.set("!help", "Retourne la liste des commandes disponibles.");
        this.cmds.set("!ping", "Test la communication avec le bot.");
        this.cmds.set("!progress [Realm] [Character]", "Retourne la progression de la guilde.");
        this.cmds.set("!members [Realm] [Character]", "Retourne la liste des membres de la guilde.");
    }
}
