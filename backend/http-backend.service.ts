import { BackendService, MapObject } from "./backend.service";
import { HttpClient } from '@angular/common/http';
import { Coordinate } from "./utils/coordinate.util";
import { Injectable } from '@angular/core';

let url = "http://192.168.2.57:3000/"

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
    public createMapObject(id?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // TEST
            resolve()
        });
    }

    public getMapObject(id: string): MapObject {
        return {id: "", coord: new Coordinate(), update: false, name: ""}
    }

    public getMapObjects(): Array<MapObject> {
        return this._mapObjects;
    }
}