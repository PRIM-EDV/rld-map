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

    constructor(private _platform: Platform, private _bluetooth: Bluetooth) {
        super();

        this.type = 'bluetooth';
        this._mapObjects.push({name: '', id: String(0), coord: new Coordinate(), pinned: false, update: true, type: 'self', meta: {}});

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
        const internalObject = this._mapObjects.find((x) => mapObject.id == x.id);
        internalObject.coord = mapObject.coord;

        console.log(internalObject.coord.inPixel);
    }

    public updateMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    public getMapObject(id: string): MapObject {
        return this._mapObjects.find((mapObject) => id == mapObject.id);
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
        const mapObject = this._mapObjects.find((x) => x.id == String(data.id));

        if (mapObject) {
            mapObject.coord.inMeter = {x: data.px, y: data.py};
        } else {
            const coord = new Coordinate();
            coord.inMeter = {x: data.px, y: data.py};

            this._mapObjects.push({name: '', id: String(data.id), coord: coord, pinned: false, update: true, type: 'friend', meta: {
                timestamp: Date.now()
            }});
        }

        this._cleanup();
    }

    private _cleanup() {
        this._mapObjects.forEach((mapObject, index) => {
            if (mapObject.meta.timestamp && (Date.now() - mapObject.meta.timestamp) > 30000) {
                this._mapObjects.splice(index, 1);
            }
        });
    }
}
