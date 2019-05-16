import { BackendService, MapObject } from "./backend.service";
// import { HttpClient } from "@angular/common/http";
import { Coordinate } from "./utils/coordinate.util";

let url = "http://192.168.2.57:3000/"

export class HttpBackendService extends BackendService {

    constructor(){
        super();
    }

    public setMapObject(id?: string) {

    }

    public getMapObject(id: string): MapObject {
        return {id: "", coord: new Coordinate()}
    }
}