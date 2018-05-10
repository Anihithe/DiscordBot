import { XMLHttpRequest } from 'xmlhttprequest';
import { IConfig } from '../interfaces/IConfig';
import * as config from '../config/config.json';

export class Commands {
    private xhr: XMLHttpRequest = new XMLHttpRequest();
    private options: IConfig = config.default as IConfig;

    JsonStringToDiscord(jsonstring: string): string {
        return jsonstring.replace(/{"/mg, '{\r\n\t"').replace(/","/mg, '",\r\n\t"').replace(/"}/, '"\r\n}');
    }

    WowRequest(type: string, callback: any, args?: string[], fields?: string): void {
        let xhr = new XMLHttpRequest();
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

    private httpGetAsync(sUrl: string, callback: any) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (callback) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
        }
        xhr.open("GET", sUrl, true); // true for asynchronous
        xhr.send(null);
    }
}