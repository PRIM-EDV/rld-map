import { Injectable } from "@angular/core";
// import { MapComponent } from "./map.component";
// import { MenuComponent } from "../menu/menu.component";
// import { BackendService } from "../backend/backend.service";

// interface Token {
//     type: string;
//     px: number;
//     py: number;
//     rfid: string;
//     label: string;
//     time: number;
//     isTracked: boolean;
//     uid: number;
// }

@Injectable({providedIn: 'root'})

export class MapService {

    // selected: Token;
    // dragged: Token;

    public map = null;

    // menu: MenuComponent = null;
    // tokens: Token[] = [];

    // constructor(public backend: BackendService) {
    //     backend.connectMapService(this);
    // }

    // setSelected(sel: any){
    //     this.selected = sel;

    //     this.menu.setSelection({id: "AB01",
    //         name: sel.label,
    //         isTracked: true,
    //         enTracked: true,}
    //     )
    // }

    // connect(map: MapComponent){
    //     this.map = map;
    //     console.log(this.map);
    // }
}
