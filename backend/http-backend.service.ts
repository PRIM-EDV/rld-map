import { BackendService, MapObject, Squad } from './backend.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Coordinate } from './utils/coordinate.util';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const url = 'http://yavin-iv.ddnss.de:3000/';
// let url = "http://localhost:3000/"

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
};

const headers = new HttpHeaders({
    'Content-Type':  'application/json'
});

@Injectable({
    providedIn: 'root',
})
export class HttpBackendService extends BackendService {

    private _synchEvent = new Subject<void>();
    private _interval: number;

    constructor(private _http: HttpClient) {
        super();

        this.type = 'http';

        this.synchronise();
        this.syncSquads();
        this.syncOperators();

        this._interval = window.setInterval(this.synchronise.bind(this), 10000);
    }

    public async syncOperators() {
        try {
            this._operators = await this._http.get(url + 'operator', httpOptions).toPromise() as any[];
        } catch {
        }
    }

    public async syncSquads() {
        try {
            this._squads = await this._http.get(url + 'squad', httpOptions).toPromise() as any[];
        } catch {

        }
    }

    public async synchronise(): Promise<void> {
        try {
            const remoteMapObjects = await this._http.get(url + 'map-object', httpOptions).toPromise();

            this._updateExistingMapObjects(remoteMapObjects as any[]);
            this._getCreatedMapObjects(remoteMapObjects as any[]).forEach(this._createInternalMapObject.bind(this));
            this._getDeletedMapObjects(remoteMapObjects as any[]).forEach(this._deleteInternalMapObject.bind(this));
        } catch {

        }

        this._synchEvent.next();
    }

    public async deleteMapObject(id: string): Promise<any> {
        const dst = url + 'map-object';
        try {
            await this._http.delete(`${dst}/${id}`, {headers: headers}).toPromise();
            await this.synchronise();
        } catch (e) {

        }

        return;
    }

    public async updateMapObject(mapObject: MapObject): Promise<any> {
        const dst = url + 'map-object';

        const dbMapObject = {
            position: mapObject.coord.inMeter,
            uid: mapObject.id,
            name: mapObject.name,
            type: mapObject.type,
            meta: {}
        };

        for (const key in mapObject.meta) {
            dbMapObject.meta[key] = mapObject.meta[key];
        }

        try {
            await this._http.put(dst, dbMapObject, httpOptions).toPromise();
            await this.synchronise();
        } catch (e) {

        }
    }

    public async createMapObject(obj: MapObject): Promise<any> {
        const dst = url + 'map-object';

        const dbMapObject = {
            position: obj.coord.inMeter,
            uid: obj.id,
            name: obj.name,
            type: obj.type,
            meta: {}
        };

        for (const key in obj.meta) {
            dbMapObject.meta[key] = obj.meta[key];
        }

        try {
            await this._http.post(dst, dbMapObject, httpOptions).toPromise();
            await this.synchronise();
        } catch (e) {

        }

        return;
    }

    public getMapObject(id: string): MapObject {
        return {id: "", coord: new Coordinate(), pinned:false, update: false, name: "", type: "", meta: {}}
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    public onSynchronise(callback) {
        this._synchEvent.subscribe(callback);
    }

    public async setMapObject(mapObject: MapObject): Promise<any> {
        if (mapObject.type == 'friend') {
            const existingMapObject = this._mapObjects.find(x => x.type == 'friend' && x.meta.callsign == mapObject.meta.callsign);
            if (existingMapObject) {
                mapObject.id = existingMapObject.id;
                this.updateMapObject(mapObject);
            } else {
                this.createMapObject(mapObject);
            }
        } else {
            if (this._mapObjects.find(x => x.id == mapObject.id)) {
                this.updateMapObject(mapObject);
            } else {
                this.createMapObject(mapObject);
            }
        }
    }

    private createInternalSquad(remoteSquad: any) {
        this._squads.push({name: remoteSquad.name});
    }

    private _createInternalMapObject(mapObject: MapObject) {
        this._mapObjects.push(mapObject);
    }

    private _deleteInternalMapObject(mapObject: MapObject) {
        this._mapObjects.splice(this._mapObjects.findIndex((x) => x.id == mapObject.id), 1);
    }

    private _updateInternalMapObject(object: any) {
        const mapObject = this._mapObjects.find((obj) => obj.id == object.uid);

        mapObject.name = object.name;
        if (mapObject.update) {
            mapObject.coord.inMeter = object.position;
        }

        for (const key in object.meta) {
            mapObject.meta[key] = object.meta[key];
        }
    }

    private _getDeletedMapObjects(objects: Array<any>): Array<MapObject> {
        return this._mapObjects.filter((mapObject) => {
            if (objects.find((object) => object.uid == mapObject.id)) {
                return false;
            } else {
                return true;
            }
        });
    }

    private _getCreatedMapObjects(objects: Array<any>): Array<MapObject> {
        const createdMapObjects = [];
        const createdObjects = objects.filter((object) => {
            if (this._mapObjects.find((mapObject) => object.uid == mapObject.id)) {
                return false;
            } else {
                return true;
            }
        });

        createdObjects.forEach((object) => {
            const mapObject: MapObject = {
                id: object.uid,
                name: object.name,
                coord: new Coordinate(),
                type: object.type,
                pinned: false,
                update: true,
                meta: {}
            };

            for (const key in object.meta) {
                mapObject.meta[key] = object.meta[key];
            }

            mapObject.coord.inMeter = object.position;
            createdMapObjects.push(mapObject);
        });

        return createdMapObjects;
    }

    private _updateExistingMapObjects(objects: Array<any>) {
        this._mapObjects.forEach((mapObject: MapObject) => {
            const object = objects.find((object) => object.uid == mapObject.id);

            if (object) {
                this._updateInternalMapObject(object);
            }
        });
    }
}
