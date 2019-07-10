import { BackendService, MapObject } from "./backend.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coordinate } from "./utils/coordinate.util";
import { Injectable } from '@angular/core';

let url = "http://localhost:3000/"

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class HttpBackendService extends BackendService {

    constructor(private _http: HttpClient){
        super();
    }

    public synchronise() {
        const dst = url + 'map-object';
        
        this._http.get(dst, httpOptions).toPromise().then(
            (res: Array<any>) => {
                
            },
            (err) => {

            }
        )
    }

    public deleteMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
        
        });
    }
    public updateMapObject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            
        });
    }
    public createMapObject(obj: MapObject): Promise<any> {
        const dst = url + 'map-object';

        const dbMapObject = {
            position: obj.coord.inMeter,
            uid: obj.id,
            name: obj.name,
            type: obj.type
        }

        return new Promise((resolve, reject) => {
            this._http.post(dst, dbMapObject, httpOptions).toPromise().then(
                (res) => {
                    
                    resolve();
                },
                (err) => {
                    reject(err);
                }
            );
            // resolve()
        });
    }

    public getMapObject(id: string): MapObject {
        return {id: "", coord: new Coordinate(), update: false, name: "", type: ""}
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    private _createMapObjectFromBackend() {

    }

    private _getDeletedMapObjects(objects: Array<any>): Array<MapObject> {
        return this._mapObjects.filter((mapObject) => {
            if (objects.find((object) => {object.uid == mapObject.id})) {
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
            if (this._mapObjects.filter((mapObject) => {object.uid == mapObject.id})) {
                return false;
            } 
            else {
                return true;
            }
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