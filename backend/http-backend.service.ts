import { BackendService, MapObject } from "./backend.service";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Coordinate } from "./utils/coordinate.util";
import { Injectable } from '@angular/core';

let url = "http://localhost:3000/"

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

    constructor(private _http: HttpClient){
        super();
        this.synchronise()
    }

    public async synchronise(): Promise<void> {
        const dst = url + 'map-object';
        
        return new Promise((resolve, reject) => {
            this._http.get(dst, httpOptions).toPromise().then(
                (res: Array<any>) => {
                    this._getCreatedMapObjects(res).forEach(this._createInternalMapObject.bind(this));
                    this._getDeletedMapObjects(res).forEach(this._deleteInternalMapObject.bind(this));

                    resolve();
                },
                (err) => {
                    reject(err);
                }
            )
        })
    }

    public async deleteMapObject(id: string): Promise<any> {
        const dst = url + 'map-object';
        console.log(`${dst}/${id}`)
        try {
            await this._http.delete(`${dst}/${id}`, {headers: headers}).toPromise();
        }catch(e) {

        }
        
        return
    }

    public updateMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            
        });
    }
    public async createMapObject(obj: MapObject): Promise<any> {
        const dst = url + 'map-object';

        const dbMapObject = {
            position: obj.coord.inMeter,
            uid: obj.id,
            name: obj.name,
            type: obj.type
        }

        try {
            await this._http.post(dst, dbMapObject, httpOptions).toPromise();
            await this.synchronise();
        } catch (e) {
            
        }
        
        return
    }

    public getMapObject(id: string): MapObject {
        return {id: "", coord: new Coordinate(), update: false, name: "", type: ""}
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    private _createInternalMapObject(mapObject: MapObject) {
        this._mapObjects.push(mapObject)
    }

    private _deleteInternalMapObject(mapObject: MapObject) {
        // this._mapObjects.
    }

    private _updateInternalMapObject(mapObject: MapObject, dbObject: any) {
        
    }

    private _getDeletedMapObjects(objects: Array<any>): Array<MapObject> {
        return this._mapObjects.filter((mapObject) => {
            if (objects.find((object) => {return object.uid == mapObject.id})) {
                return false;
            } 
            else {
                return true;
            }
        })        
    }

    private _getCreatedMapObjects(objects: Array<any>): Array<MapObject> {
        const createdMapObjects = [];
        const createdObjects = objects.filter((object) => {
            if (this._mapObjects.find((mapObject) => {return object.uid == mapObject.id})) {
                return false;
            } 
            else {
                return true;
            }
            return true;
        })

        createdObjects.forEach((object) => {
            const mapObject: MapObject = {
                id: object.uid,
                name: object.name,
                coord: new Coordinate(),
                type: object.type,
                update: true,
            }
            mapObject.coord.inMeter = object.position;
            createdMapObjects.push(mapObject);
        })

        return createdMapObjects;
    }
}