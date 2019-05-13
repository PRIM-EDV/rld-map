// import { Injectable } from "@angular/core";
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


export class MapService {

    // selected: Token;
    // dragged: Token;

    // map : MapComponent = null;
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

    // connectMenu(menu: MenuComponent){
    //     this.menu = menu;
    // }

    // updateUntrackedToken(token: Token){
    //     let idx = this.tokens.findIndex( (x) => {
    //         return x == token;
    //     })
    //     this.tokens[idx].time = new Date().getTime();
    //     this.backend.updateUntrackedTroop(token.uid, token.px, token.py);
    // }

    // updateUntrackedEnemy(token: Token){
    //     let idx = this.tokens.findIndex( (x) => {
    //         return x == token;
    //     })
    //     this.tokens[idx].time = new Date().getTime();
    //     this.backend.updateEnemy(token.uid, token.px, token.py);
    // }

    // updateUnid(token: Token){
    //     let idx = this.tokens.findIndex( (x) => {
    //         return x == token;
    //     })
    //     //this.tokens[idx].time = new Date().getTime();
    //     this.backend.updateUnid(token.uid, token.px, token.py);
    // }

    // updateGreen(token: Token){
    //     let idx = this.tokens.findIndex( (x) => {
    //         return x == token;
    //     })
    //     //this.tokens[idx].time = new Date().getTime();
    //     this.backend.updateGreen(token.uid, token.px, token.py);
    // }

    // updateObjects(token: Token){
    //     let idx = this.tokens.findIndex( (x) => {
    //         return x == token;
    //     })
    //     //this.tokens[idx].time = new Date().getTime();
    //     this.backend.updateObject(token.uid, token.px, token.py);
    // }

    // deleteUntrackedTroop(token: Token){
    //     this.backend.deleteUntrackedTroop(token.uid);
    // }

    // deleteEnemy(token: Token){
    //     this.backend.deleteEnemy(token.uid);
    // }

    // deleteUnid(token: Token){
    //     this.backend.deleteUnid(token.uid);
    // }

    // deleteGreen(token: Token){
    //     this.backend.deleteGreen(token.uid);
    // }

    // deleteObject(token: Token){
    //     this.backend.deleteObject(token.uid);
    // }

    // getCenter(){
    //     return this.map.getCenter();
    // }
}
