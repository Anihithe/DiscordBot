import { XMLHttpRequest } from 'xmlhttprequest';
import { Commands } from './commands';
import * as wowApi from '../interfaces/IWowAPI';
import { IConfig } from '../interfaces/IConfig';
import * as config from '../config/config.json'

export class BotCommands {
    private cmds: Map<string, string> = new Map();
    private commands: Commands;
    private options: IConfig = config.default as IConfig;

    constructor() {
        this.initMap();
        this.commands = new Commands();
    }

    private initMap() {
        this.cmds.set('!help', 'Retourne la liste des commandes disponibles.');
        this.cmds.set('!ping', 'Test la communication avec le bot.');
        this.cmds.set('!progress [Realm] [Character]', 'Retourne la progression de la guilde.');
        this.cmds.set('!members [Realm] [Character]', 'Retourne la liste des membres de la guilde.');
    }

    public help(): string {
        let help: string = '';
        for (let [a, b] of this.cmds) {
            help += a + '\t:' + b + '\r\n';
        }
        return help;
    }

    public getMembers(args: string[], callback: any): void {
        let members: string[] = new Array();
        let lsMembers: string = '';
        this.commands.WowRequest('guild', (data: any) => {
            for (let member of data.members) {
                members.push(member.character.name);
            }
            members.sort();
            for (let member of members) {
                lsMembers += member + '\r\n';
            }
            if (callback) {
                callback(lsMembers);
            }
        }, args, 'members');
    }

    public getMemberProgress(args: string[], callback: any): void {
        this.commands.WowRequest('character', (data) => {
            let result: string = '';
            for (let raid of data.progression.raids) {
                let raidContent = raid as wowApi.Raid;
                if (this.options.raidsID.indexOf(raidContent.id) > -1) {
                    result += `\r\n${raidContent.name} :`;
                    if (raidContent.normal === 1) {
                        result += `\r\n\t NM : En cours`;
                    }
                    else if (raidContent.normal === 2) {
                        result += `\r\n\t NM : Clean`;
                    }
                    if (raidContent.heroic === 1) {
                        result += `\r\n\t HM : En cours`;
                    }
                    else if (raidContent.heroic === 2) {
                        result += `\r\n\t HM : Clean`;
                    }
                    if (raidContent.mythic) {
                        result += `\r\n\t MM : En cours`;
                    }
                    else if (raidContent.mythic) {
                        result += `\r\n\t MM : Clean`;
                    }
                }
            }
            if (result === '') {
                result += 'Error';
            }
            callback(result);
        }, args, 'progression');
    }
}
