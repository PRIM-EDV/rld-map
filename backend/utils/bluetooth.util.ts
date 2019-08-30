import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { connect } from 'tls';
import { DeviceConfigService } from './device-config.service';

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
    public connectedDevice: any = null;

    private _disconnectEvent = new Subject<void>();
    private _connectEvent = new Subject<any>();

    constructor(private platform: Platform, private ble: BLE, private deviceConfig: DeviceConfigService) {

    }

    public async getBondedDevices(): Promise<any> {
        return this.ble.bondedDevices();
    }

    public async connect(address: string, callback: (data: BluetoothData) => void): Promise<any> {

        return new Promise((resolve, reject) => {
            console.log(address);
            this.ble.connect(address).subscribe(
                (d) => {
                    this.connectedDevice = d;
                    this._connectEvent.next(d);
                    this.deviceConfig.updateConfig({device: d});
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

                    if (this.connectedDevice != null) {
                        this._disconnectEvent.next();
                        this.connectedDevice = null;
                    }
                    reject();
                }
            );
        });
    }

    public connectDefault(callback: (data: BluetoothData) => void) {
        const device =  this.deviceConfig.getConfig().device;
        if (device != null) {
            // console.log(this._config);
            this.connect(device.id, callback).then(
                (d) => {
                    // resolve(device);
                },
                (err) => {
                    // reject();
                }
            );
        }
    }

    public onDisconnect(callback) {
        this._disconnectEvent.subscribe(callback);
    }

    public onConnect(callback) {
        this._connectEvent.subscribe(callback);
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
