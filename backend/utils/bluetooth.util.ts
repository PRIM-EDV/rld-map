import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

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

    constructor(private ble: BLE) {}

    private parseSerial(s: string): BluetoothData {
        const data: any = s.split(':');

        const id = data[0];
        const flags = data[1] >> 4;
        const px = ((data[1] & 0x0f) << 6) | ((data[2] & 0xfc) >> 2);
        const py = ((data[2] & 0x03) << 8) | data[3];

        return {id: id, px: px, py: py, ts: Date.now()};
    }

    public getBondedDevices(callback: (data: any) => void): void {
        this.ble.bondedDevices().then(callback);
    }

    public connect(address: string, callback: (data: BluetoothData) => void): void {
        console.log(address);
        this.ble.connect(address).subscribe(
            (d) => {
                console.log(d);
                // set this._connectedDevice
                this.ble.startNotification(address, 'ffe0', 'ffe1').subscribe(
                    (data: ArrayBuffer) => {
                        const s = String.fromCharCode.apply(null, new Uint8Array(data));
                        console.log(s);
                        callback(this.parseSerial(s));
                    }
                );
            },
            (err) => {
                this._connectedDevice = null;
            }
        );
    }
}
