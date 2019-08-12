import { Injectable } from '@angular/core';
import { BackendService, MapObject } from './backend.service';
import { Bluetooth, BluetoothData } from './utils/bluetooth.util';
import { Coordinate } from './utils/coordinate.util';
import { Platform } from '@ionic/angular';

const UID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

@Injectable({
    providedIn: 'root',
})
export class BluetoothBackendService extends BackendService {

    // private _operators = {
    //     1:
    // }

    constructor(private _platform: Platform, private _bluetooth: Bluetooth) {
        super();

        this.type = 'bluetooth';
        this._mapObjects.push({name: '', id: String(0), coord: new Coordinate(), update: true, type: 'self', meta: {}});

        this._platform.ready().then(() => {
            window.setInterval(() => {
                if (!this._bluetooth.connectedDevice) {
                    this._bluetooth.connectDefault(this._handleBluetooth.bind(this));
                }
            }, 10000);
        });
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
<<<<<<< HEAD
        return {id: '', coord: new Coordinate(), type: "", pinned: false, update: false, name: "", meta: {}};
=======
        return {id: '', coord: new Coordinate(), type: '', update: false, name: '', meta: {}};
>>>>>>> mobile
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    public async connectToDefaultDevice() {
        return this._bluetooth.connectDefault(this._handleBluetooth.bind(this));
    }

    public async connectToDevice(address: string) {
        return this._bluetooth.connect(address, this._handleBluetooth.bind(this));
    }

    public getActiveDevice() {
        return this._bluetooth.connectedDevice;
    }

    public async getBondedDevices() {
        return this._bluetooth.getBondedDevices();
    }

    public onConnect(callback) {
        this._bluetooth.onConnect(callback);
    }

    public onDisconnect(callback) {
        this._bluetooth.onDisconnect(callback);
    }

    private _handleBluetooth(data: BluetoothData) {
        const mapObject = this._mapObjects.find((x) => x.id == String(0));

        if (mapObject) {
            mapObject.coord.inMeter = {x: data.px, y: data.py};
        }
    }
}
