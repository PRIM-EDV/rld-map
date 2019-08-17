import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Coordinate } from './coordinate.util';

const DEFAULT_CONFIG = {
    device: null,
    origin: {x: 680, y: 500}
};

@Injectable({
    providedIn: 'root'
})
export class DeviceConfigService {
    private _config = DEFAULT_CONFIG;

    constructor(private _platform: Platform, private _file: File) {
        this._platform.ready().then(() => {
            this._file.readAsBinaryString(this._file.dataDirectory, 'bluetooth.json').then(
                (data) => {
                    this.updateConfig(JSON.parse(data));
                },
                (err) => {
                    this._file.writeFile(this._file.dataDirectory, 'bluetooth.json', JSON.stringify(this._config));
                }
            ).then(() => {
                Coordinate._origin = this._config.origin;
            });
        });
    }

    public getConfig() {
        return this._config;
    }

    public updateConfig(params) {
        for (const key in params) {
            if (key in this._config) {
                this._config[key] = params[key];
            }
        }

        console.log(this._config);

        this._file.writeFile(this._file.dataDirectory, 'bluetooth.json', JSON.stringify(this._config), {replace: true});
    }
}
