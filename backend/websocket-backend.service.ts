import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


import { BackendService } from './backend.service';
import { MapObject } from 'src/app/core/map-object';
import { Coordinate } from 'src/app/core';


@Injectable()
export class WebsocketBackendService extends BackendService {

    private _synchEvent = new Subject<void>();
    private _localDb: any;

    constructor(private _socket: Socket) {
        super();

        this.type = 'http';
        // this._localDb = this._readLocalDb();
        
        this._socket.fromEvent<any>('map-object').subscribe((data)=> {
            console.log(data)
        })
    }

    // public async synchronise(): Promise<void> {
    //     try {
    //         const remoteMapObjects = await this._http.get(url + 'map-object', httpOptions).toPromise();

    //         this._updateExistingMapObjects(remoteMapObjects as any[]);
    //         this._getCreatedMapObjects(remoteMapObjects as any[]).forEach(this._createInternalMapObject.bind(this));
    //         this._getDeletedMapObjects(remoteMapObjects as any[]).forEach(this._deleteInternalMapObject.bind(this));
    //     } catch {

    //     }

    //     this._synchEvent.next();
    // }

    public async deleteMapObject(id: string): Promise<any> {
        this._mapObjects.splice(this._mapObjects.findIndex((x) => x.id == id), 1);

        return;
    }

    public async updateMapObject(object: any): Promise<any> {
        const mapObject = this._mapObjects.find((obj) => obj.id == object.id);

        mapObject.name = object.name;
        if (mapObject.update) {
            mapObject.coord.inMeter = object.position;
        }

        for (const key in object.meta) {
            mapObject.meta[key] = object.meta[key];
        }
        // const dst = url + 'map-object';

        // const dbMapObject = {
        //     position: mapObject.coord.inMeter,
        //     uid: mapObject.id,
        //     name: mapObject.name,
        //     type: mapObject.type,
        //     meta: {}
        // };

        // for (const key in mapObject.meta) {
        //     dbMapObject.meta[key] = mapObject.meta[key];
        // }

        // try {
        //     await this._http.put(dst, dbMapObject, httpOptions).toPromise();
        //     await this.synchronise();
        // } catch (e) {

        // }
    }

    public async createMapObject(mapObject: MapObject): Promise<any> {
        this._mapObjects.push(mapObject);
        
        this._writeLocalDb();
        
        // const dst = url + 'map-object';

        const dbMapObject = {
            position: mapObject.coord.inMeter,
            uid: mapObject.id,
            name: mapObject.name,
            type: mapObject.type,
            meta: {}
        };

        this._socket.emit('map-object', {action: "set", object: dbMapObject});

        // for (const key in obj.meta) {
        //     dbMapObject.meta[key] = obj.meta[key];
        // }

        // try {
        //     await this._http.post(dst, dbMapObject, httpOptions).toPromise();
        //     await this.synchronise();
        // } catch (e) {

        // }

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
    
    private _readLocalDb() {
        let localDbString = localStorage.getItem("localDb");
        let localDb = undefined;
        console.log(localDbString)
        if(!localDbString) {
            const data = {
                mapObjects: [],
                operators: [],
                squads: []
            }

            localStorage.setItem("localDb", JSON.stringify(data))
            localDb = data;
        } else {
            localDb = JSON.parse(localDbString);
        }

        this._mapObjects = localDb.mapObjects;
        this._operators = localDb.operators;
        this._squads = localDb.squads;

        for(const object of this._mapObjects) {
            const coord = object.coord;

            object.coord = new Coordinate();
            object.coord.inPixel = {x: coord._x, y: coord._y};
        }

        return localDb;
    }

    private _writeLocalDb() {
        const data = {
            mapObjects: this._mapObjects,
            operators: this._operators,
            squads: this._squads
        }

        localStorage.setItem("localDb", JSON.stringify(data));
    }

}
