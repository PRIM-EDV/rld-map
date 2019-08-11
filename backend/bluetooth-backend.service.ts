import { Injectable } from '@angular/core';
import { BackendService, MapObject } from './backend.service';
import { Bluetooth, BluetoothData } from './utils/bluetooth.util';
import { Coordinate } from './utils/coordinate.util';

@Injectable({
    providedIn: 'root',
})
export class BluetoothBackendService extends BackendService {

    constructor(private _bluetooth: Bluetooth) {
        super();

        this.type = 'bluetooth';
    }

    public createMapObject(obj: MapObject): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    public deleteMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    public async setMapObject(mapObject: MapObject): Promise<any> {

    }

    public updateMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    public getMapObject(id: string): MapObject {
        return {id: '', coord: new Coordinate(), type: '', update: false, name: '', meta: {}};
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    public async connectToDevice(address: string) {
        return this._bluetooth.connect(address, this.handleBluetooth); // maybe bindcall
    }

    public async getBondedDevices() {
        return this._bluetooth.getBondedDevices();
    }

    private handleBluetooth(data: BluetoothData) {

    }
}
