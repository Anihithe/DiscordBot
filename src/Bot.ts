import * as Discord from "discord.js";
import { BotCommands } from "./commands/botCommands";
import * as config from "./config/config.json";
import { IConfig } from "./interfaces/IConfig";

const client = new Discord.Client();
const botCommands = new BotCommands();
const options = config.default as IConfig;

export class Bot {
    constructor() {
        client.on("ready", () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });

        client.on("message", (msg) => {
            if (msg.author.username === "TestJS") { return; }
            const cmd = msg.content.slice(0, 1);
            if (cmd !== "!") { return; }
            console.log(`${new Date().toLocaleString(options.lang)} : ${msg.author.username} => ${msg.content}`);
            const args: string[] = msg.content.slice(1).trim().split(/ +/g);
            const command: string = args.shift().toLowerCase();
            switch (command) {
                case "ping":
                    msg.reply("pong!");
                    break;
                case "help":
                    msg.reply(botCommands.help());
                    break;
                case "members":
                    if (args.length !== 2) {
                        msg.reply("Use !members [Realm] [Guild]");
                        break;
                    }
                    botCommands.getMembers(args, (data: string) => {
                        msg.reply(data);
                    });
                    msg.reply("Wait...");
                    break;
                case "progress":
                    if (args.length !== 2) {
                        msg.reply("Use !progress [Realm] [Character]");
                        break;
                    }
                    botCommands.getCharacterProgress(args, (data: string) => {
                        msg.reply(data);
                    });
                    break;
                case "who":
                    if (args.length !== 2) {
                        msg.reply("Use !who [Realm] [Character]");
                        break;
                    }
                    botCommands.getCharacterInfo(args, (data: string) => {
                        msg.reply(data);
                    });
                default:
                    msg.reply(`${command} are unknown command.`);
                    break;
            }
        });
    }

    public BotStart() {
        client.login(options.discordToken);
    }
}
