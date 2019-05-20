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

    public setMapObject(id?: string) {

    }

    public getMapObject(id: string): MapObject {
        return {id: "", coord: new Coordinate()}
    }
}