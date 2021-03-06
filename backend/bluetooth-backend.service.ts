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
    }

    public deleteMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
        
        });
    }
    public updateMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
        
        });
    }
    public createMapObject(id?: string): Promise<any> {
        return new Promise((resolve, reject) => {
        
        });
    }

    public getMapObject(id: string): MapObject {
        return {id: '', coord: new Coordinate(), update: false, name: ""};
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    public connectToDevice(address: string) {
        this._bluetooth.connect(address, this.handleBluetooth); // maybe bindcall
    }

    public getBondedDevices(callback: (data: any) => void) {
        this._bluetooth.getBondedDevices(callback);
    }

    private handleBluetooth(data: BluetoothData) {

    }
}
