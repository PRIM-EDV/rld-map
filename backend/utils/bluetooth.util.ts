import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

export interface BluetoothData {
    id: number;
    px: number;
    py: number;
    ts: number;
}

@Injectable({
    providedIn: 'root'
})
export class Bluetooth {
    private _connectedDevice: any = null;
    private _config: any = null;

    private _disconnectEvent = new Subject<void>();

    constructor(private platform: Platform, private ble: BLE, private _file: File) {
        this.platform.ready().then(() => {
            this._file.readAsBinaryString(this._file.dataDirectory, 'bluetooth.json').then(
                (data) => {
                    console.log(JSON.parse(data));
                },
                (err) => {
                    console.log(err);
                    this._file.writeFile(this._file.dataDirectory, 'bluetooth.json', JSON.stringify({device: null}));
                }
            );
        });
    }

    public async getBondedDevices(): Promise<any> {
        return this.ble.bondedDevices();
    }

    public async connect(address: string, callback: (data: BluetoothData) => void): Promise<any> {

        return new Promise((resolve, reject) => {
            console.log(address);
            this.ble.connect(address).subscribe(
                (d) => {
                    console.log(d);
                    // set this._connectedDevice
                    resolve(d);
                    this.ble.startNotification(address, 'ffe0', 'ffe1').subscribe(
                        (data: ArrayBuffer) => {
                            const s = String.fromCharCode.apply(null, new Uint8Array(data));
                            console.log(s);
                            callback(this._parseSerial(s));
                        }
                    );
                },
                (err) => {
                    // onDisconnect()
                    if (this._connectedDevice != null) {
                        this._connectedDevice = null;
                    }
                    reject();
                }
            );
        });
    }

    public set onDisconnect(callback) {

    }

    private _parseSerial(s: string): BluetoothData {
        const data: any = s.split(':');

        const id = data[0];
        const flags = data[1] >> 4;
        const px = ((data[1] & 0x0f) << 6) | ((data[2] & 0xfc) >> 2);
        const py = ((data[2] & 0x03) << 8) | data[3];

        return {id: id, px: px, py: py, ts: Date.now()};
    }
}
