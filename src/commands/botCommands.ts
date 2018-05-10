import { XMLHttpRequest } from 'xmlhttprequest';
import { Commands } from './commands';

export class BotCommands {
    public cmds: Map<string, string> = new Map();
    private commands: Commands;

    constructor() {
        this.initMap();
        this.commands = new Commands();
    }

    private initMap() {
        this.cmds.set('!help', 'Retourne la liste des commandes disponibles.');
        this.cmds.set('!ping', 'Test la communication avec le bot.');
        this.cmds.set('!progress [Realm] [Character]', 'Retourne la progression de la guilde.');
        //this.cmds.set('!getOptions', 'Retourne la liste des configs du server(Lock pour sécurité)');
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

    public getOptions(): string {
        return 'Dans tes rêves !';
        //return this.commands.JsonStringToDiscord(JSON.stringify(this.configs));
    }

    public setOptions(args: string[]): string {
        //TODO modification des params
        return 'WIP';
    }

    public getMemberProgress(args: string[], callback: any): void {
        this.commands.WowRequest('character', (data) => {
            let result: string = '';
            for (let raid of data.progression.raids) {
                if (raid.normal != "0" || raid.heroic != "0" || raid.mythic != "0") {
                    result += `\r\n${raid.name} : \r\n\t NM : ${raid.normal}\r\n\t HM : ${raid.heroic}\r\n\t MM : ${raid.mythic} `
                }
            }
            callback(result);
        }, args, 'progression');
    }
}
