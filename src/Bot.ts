import * as Discord from "discord.js";
import { BotCommands } from "./commands/botCommands";
import * as config from "./config/config.json";
import { IConfig } from "./interfaces/IConfig";

const client = new Discord.Client();
const botCommands = new BotCommands();
const options = config.default as IConfig;
const embed = {
    "title": "Guides et Liens Utiles",
    "description": "Liste des guides et liens utiles pour optimiser son personnage.",
    "color": 5739597,
    "author": {
        "name": "Ctrl Zut"
    },
    "fields": [
        {
            "name": "**__Classes__**",
            "value": "[IcyVeins](https://www.icy-veins.com/wow/class-guides) - EN\r\n[WowHead](https://fr.wowhead.com/classes) - EN\r\nGuide de classe. Talents, Rotation."
        },
        {
            "name": "**__Simulations__**",
            "value": "[HeroDamage](https://www.herodamage.com/fr) - FR-EN\r\n[BloodMallet](https://bloodmallet.com/) - FR-EN\r\nComparatif de dps pour les Traits d'Azerite, Bijoux, Races.\r\n\r\n[RaidBot](https://www.raidbots.com/simbot)\r\nSimulation de son peronnage :\r\n- Optimisation de stats secondaires avec l'addon [Pawn](https://wow.curseforge.com/projects/pawn).\r\n- Comparatif d'équipement avec l'addon [SimC](https://wow.curseforge.com/projects/simulationcraft)"
        },
        {
            "name": "**__Récolte__**",
            "value": "[WowProfessions](https://www.wow-professions.com/farming-guides) - EN\r\nRoutes de récoltes des ressources"
        },
        {
            "name": "**__Artisanat__**",
            "value": "[WowProgessions](https://www.wow-professions.com/profession-leveling-guides) - EN\r\nGuide de leveling des métiers"
        },
        {
            "name": "**__Raids__**",
            "value": "[Uldir](https://fr.wowhead.com/uldir-raid-boss-abilities-battle-for-azeroth) - EN\r\nRécapitulatif des compétences + Vidéo de présentation des boss"
        },
        {
            "name": "**__Donjons__**",
            "value": "WIP"
        },
        {
            "name": "**__Addons__**",
            "value": "[BigWigs](WIP) + [LittleWigs](WIP) ou [DeadlyBossMod](WIP)\r\nAide pour les Raids et Donjons\r\n\r\n[Pawn](https://wow.curseforge.com/projects/pawn)\r\nSurcouche d'interface pour un comparatif rapide d'équipement\r\n\r\n[SimC](https://wow.curseforge.com/projects/simulationcraft)\r\nExport textuel des informations du personnage pour les simulations.\r\n\r\n[Skada](WIP) ou [ADDON](WIP)\r\nAffichage des données de combat.\r\n\r\n[WorldQuestTracker](https://wow.curseforge.com/projects/world-quest-tracker)\r\nOutil de recherche d'expédition"
        }
    ]
};

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
                    botCommands.getMemberProgress(args, (data: string) => {
                        msg.reply(data);
                    });
                    break;
                case "embed":
                    if (!msg.member.permissions.has("ADMINISTRATOR")) {
                        msg.reply("You're not an Admin !");
                        break;
                    }
                    if (msg.guild.channels.find((x) => x.name === args[0]).type !== "text") {
                        msg.reply("Channel is not a TextChannel.");
                        break;
                    }
                    if (args.length !== 1) {
                        msg.reply("Use !embed [Channel] [JSON Embed]");
                        break;
                    }
                    if (!msg.guild.channels.find((x) => x.name === args[0])) {
                        msg.reply("Channel don't exists.");
                        break;
                    }
                    const chan2Send = msg.guild.channels.find((x) => x.name === args[0]) as Discord.TextChannel;
                    chan2Send.send({ embed });
                    break;
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
