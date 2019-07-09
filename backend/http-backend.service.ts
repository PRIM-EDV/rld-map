import { BackendService, MapObject } from "./backend.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coordinate } from "./utils/coordinate.util";
import { Injectable } from '@angular/core';

let url = "http://localhost:3000/"

@Injectable({
    providedIn: 'root',
})
export class HttpBackendService extends BackendService {

    constructor(private _http: HttpClient){
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
    public createMapObject(obj: MapObject): Promise<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json'
            })
        };
        const dst = url + 'map-object';

        const dbMapObject = {
            position: obj.coord.inMeter,
            uid: obj.id,
            name: obj.name,
            type: obj.type
        }

        return new Promise((resolve, reject) => {
            this._http.post(dst, dbMapObject, httpOptions)
                .toPromise()
                .then(
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
}