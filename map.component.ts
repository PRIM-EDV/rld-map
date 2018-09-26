import {Component} from "@angular/core";
import * as Hammer from "hammerjs";
import { MapService } from "./map.service";
import { Coordinate } from "./utils/coordinate.util"
// import { BackendService } from "../backend/backend.service";

interface MapFile {
    urls: string[];
    res: number;
}

// interface IconSet {
//     self: HTMLImageElement,
//     frdClr: HTMLImageElement,
//     frd1: HTMLImageElement,
//     frd2: HTMLImageElement,
//     frd3: HTMLImageElement,
//     foe1: HTMLImageElement,
//     foe2: HTMLImageElement,
//     foe3: HTMLImageElement,
//     unid: HTMLImageElement,
//     green: HTMLImageElement,
//     obj: HTMLImageElement,
// }

@Component({
    selector: "map",
    styleUrls: [ "./map.component.scss" ],
    templateUrl: 'map.component.html',

})
export class MapComponent {
    // new //////////////////////////
    private origin: Coordinate = new Coordinate();
    /////////////////////////////////

    mapfile: MapFile;
    map: HTMLImageElement;
    map2: HTMLImageElement;
    marker: HTMLImageElement;
    mc: HammerManager;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    date: Date = new Date()

    // iconset: IconSet;

    //gridColor: string = "rgba(255, 255, 210, 0.4)";
    colors = {
        black : "rgba(0,0,0,1)",
        lightBlack: "rgba(0,0,0,0.7)",
        testGray: "rgba(200, 200, 200, 1)"
    }
    gridColor: string = "rgba(105, 200, 205, 0.35)";
    hColor: string = "rgba(105, 200, 205, 0.75)";
    hColorSoft: string = "rgba(105, 200, 205, 0.25)" 

    dx: number = 0;
    mx: number = 0;
    my: number = 0;
    dy: number = 0;
    dWidth: number;
    dHeight: number;
    mouseX: string = '';
    mouseY: string = '';

    maps: HTMLImageElement[] = []; 

    // Quick and Dirty
    dragX: number = 0;
    dragY: number = 0;
    dragItemX: number = 0;
    dragItemY: number = 0;
    

    constructor(private mapService: MapService, /*public backend: BackendService*/) {
        this.map = new Image();
        this.mapfile = {
            urls: [
                'assets/maps/mahlwinkel/base.png',
                'assets/maps/mahlwinkel/streets.png'
            ],
            res: 2.6
        };
        this.mapService.connect(this);

        for(let url of this.mapfile.urls){
            let map = new Image();

            map.src = url;
            this.maps.push(map)
        }

        //this.loadIcons();
    }

    /*loadIcons() {
        this.iconset = {
            self: new Image(),
            frdClr: new Image(),
            frd1: new Image(),
            frd2: new Image(),
            frd3: new Image(),
            foe1: new Image(),
            foe2: new Image(),
            foe3: new Image(),
            unid: new Image(),
            green: new Image(),
            obj: new Image(),
        }
        this.iconset.frdClr.src = "assets/img/marker/m_friend_big.png";
        this.iconset.frd1.src = "assets/img/marker/m_friend_1.png";
        this.iconset.frd2.src = "assets/img/marker/m_friend_2.png";
        this.iconset.frd3.src = "assets/img/marker/m_friend_3.png";
        this.iconset.foe1.src = "assets/img/marker/m_foe_1.png";
        this.iconset.foe2.src = "assets/img/marker/m_foe_2.png";
        this.iconset.foe3.src = "assets/img/marker/m_foe_3.png";
        this.iconset.unid.src = "assets/img/marker/m_unid.png";
        this.iconset.green.src = "assets/img/marker/m_green.png";
        this.iconset.obj.src = "assets/img/marker/m_object.png";
    }*/

    ngAfterContentInit() {
        this.canvas = document.getElementById("cMap") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.mc = new Hammer(this.canvas);

        window.addEventListener("resize", this.handleWindowResize.bind(this));
        // this.canvas.addEventListener("mousemove", (e: any)=>{
        //     this.mouseX = ((e.offsetX * this.zoom + this.sx) / this.mapfile.res).toFixed(2);
        // })

        this.maps[0].onload = () => {
            // this.handleWindowResize();
            this.addPan.call(this);
            // this.addPinch.call(this);
            // this.addScroll.call(this);
            // this.canvas.addEventListener("click", this.handleCLick.bind(this));
            // this.canvas.addEventListener("mousedown", this.handleDragDown.bind(this));
            // this.canvas.addEventListener("mousemove", this.handleDrag.bind(this));
            // window.addEventListener("mouseup", this.handleDragUp.bind(this));
            // document.addEventListener("keydown", this.handleDelete.bind(this));
        };

        window.setInterval(() => {
            console.log("timeout");
            this.updateMap();
        }, 1000);
    }

    // handleDelete(ev: KeyboardEvent){
    //     if(this.mapService.selected && ev.key=="Delete"){
    //         let token = this.mapService.selected;

    //         if(token.type == "fr1" || token.type == "fr2" || token.type == "fr3"){
    //             this.mapService.deleteUntrackedTroop(token);
    //         }else if(token.type == "foe1" || token.type == "foe2" || token.type == "foe3")
    //         {
    //             this.mapService.deleteEnemy(token);
    //         }else if(token.type == "unid"){
    //             this.mapService.deleteUnid(token);
    //         }else if(token.type == "green"){
    //             this.mapService.deleteGreen(token);
    //         }else if(token.type == "obj"){
    //             this.mapService.deleteObject(token);
    //         }
    //     }
    // }

    // private handleDragDown(ev: MouseEvent){
    //     const mx = 384;
    //     const my = 336;

    //     if(this.mapService.selected && this.mapService.selected.isTracked == false){
    //         let ox = ((this.mapService.selected.px * this.mapfile.res) - this.sx + mx) * (1/this.zoom) + 24;
    //         let oy = ((this.mapService.selected.py * this.mapfile.res) - this.sy + my) * (1/this.zoom) + 24;
    
    //         if(ev.clientX > ox && ev.clientX < (ox + 48) && ev.clientY > oy && ev.clientY < (oy + 48)){
    //             this.mapService.dragged = this.mapService.selected;
    //             this.dragX = ev.clientX;
    //             this.dragY = ev.clientY;
    //             this.dragItemX = this.mapService.dragged.px;
    //             this.dragItemY = this.mapService.dragged.py;
    //         }
    //     }
    // }

    // private handleDrag(ev: MouseEvent){

    //     //let ox = ((m.px * this.mapfile.res) - this.sx + mx) * (1/this.zoom) - 24;
    //     //let oy = ((m.py * this.mapfile.res) - this.sy + my) * (1/this.zoom) - 24;
    //     //console.log("drag");
    //     if(this.mapService.dragged){
    //         let offsetX = this.dragX - ev.clientX;
    //         let offsetY = this.dragY - ev.clientY;

    //         let idx = this.mapService.tokens.findIndex((x: any) => {
    //             return x == this.mapService.dragged;
    //         })

    //         this.mapService.tokens[idx].px = this.dragItemX -  offsetX  / this.mapfile.res * this.zoom;
    //         this.mapService.tokens[idx].py = this.dragItemY - offsetY  / this.mapfile.res * this.zoom;

    //         this.updateMap();
    //     }
    // }

    // private handleDragUp(ev: MouseEvent){
    //     if(this.mapService.dragged){
    //         let idx = this.mapService.tokens.findIndex((x: any) => {
    //             return x == this.mapService.dragged;
    //         })
    //         let token = this.mapService.tokens[idx];
    
    //         if(token.type == "fr1" || token.type == "fr2" || token.type == "fr3"){
    //             this.mapService.updateUntrackedToken(token);
    //         }else if(token.type == "foe1" || token.type == "foe2" || token.type == "foe3")
    //         {
    //             this.mapService.updateUntrackedEnemy(token);
    //         }else if(token.type =="green"){
    //             this.mapService.updateGreen(token);
    //         }else if(token.type =="obj"){
    //             this.mapService.updateObjects(token);
    //         }else if(token.type =="unid"){
    //             this.mapService.updateUnid(token);
    //         }
    //         this.mapService.dragged = null;
    //     }
    // }

    // private handleCLick(ev: MouseEvent) {
    //     const mx = 384;
    //     const my = 336;

    //     let selected = null;

    //     for(let m of this.mapService.tokens){
    //         let ox = ((m.px * this.mapfile.res) - this.sx + mx) * (1/this.zoom) + 24;
    //         let oy = ((m.py * this.mapfile.res) - this.sy + my) * (1/this.zoom) + 24;

    //         if(ev.clientX > ox && ev.clientX < (ox + 48) && ev.clientY > oy && ev.clientY < (oy + 48)){
    //             console.log(ev.clientX);
    //             console.log(ev.clientY);

    //             selected = m;
    //         }
    //     }

    //     if(selected){
    //         this.mapService.selected = selected;
    //     }else{
    //         this.mapService.selected = null;
    //     }

    //     console.log(selected);

    //     this.updateMap();
    // }

    // getCenter(){
    //     const mx = 384;
    //     const my = 336;

    //     let pos = {
    //         px: ((this.canvas.width / 2) * this.zoom + this.sx - mx) / this.mapfile.res,
    //         py: ((this.canvas.height / 2) * this.zoom + this.sy - my) / this.mapfile.res
    //     }

    //     return pos;
    // }

    public handleWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.canvas.width = width;
        this.canvas.height = height;

        this.updateMap.call(this);
    }

    private addPan() {
        let offset = {x: 0, y: 0};

        this.mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        this.mc.on("panstart", (e) => {
            offset = Coordinate.offset;
        });
        this.mc.on("pan", (e: any) => {

            if (e.maxPointers == 1) {
                Coordinate.offset = {
                    x: offset.x - e.deltaX * Coordinate.scale, //Math.max(Math.min(0, this.mx), Math.min(Math.max(0, this.mx), offset.x - e.deltaX * Coordinate.scale)),
                    y: offset.y - e.deltaY * Coordinate.scale//Math.max(Math.min(0, this.my), Math.min(Math.max(0, this.my), offset.y - e.deltaY * Coordinate.scale))
                }
                this.updateMap();
            }
        });
    }

    // private addPinch() {
    //     let pinch = 0;
    //     let centerX = 0;
    //     let centerY = 0;
    //     let px = 0;
    //     let py = 0;

    //     let maxz = Math.max((this.maps[0].width + 128) / this.canvas.width, (this.maps[0].height + 128) / this.canvas.height);

    //     this.mc.add ( new Hammer.Pinch());
    //     this.mc.on("pinchstart", (e) => {
    //         pinch = this.zoom;
    //         centerX = e.center.x;
    //         centerY = e.center.y;
    //         px = this.sx;
    //         py = this.sy;
    //     });
    //     this.mc.on("pinch", (e) => {
    //         this.zoom = Math.min(Math.max(0.75, pinch * (1 / e.scale)), maxz);
    //         this.mx = this.maps[0].width  - this.canvas.width * this.zoom;
    //         this.my = this.maps[0].height - this.canvas.height * this.zoom;
    //         this.sx = Math.max(Math.min(0, this.mx), Math.min(Math.max(0, this.mx), px + (centerX * pinch - centerX * this.zoom)));
    //         this.sy = Math.max(Math.min(0, this.my), Math.min(Math.max(0, this.my), py + (centerY * pinch - centerY * this.zoom)));
    //         this.updateMap();
    //     });
    // }

    // private addScroll() {
    //     let maxz = Math.max((this.maps[0].width + 128) / this.canvas.width, (this.maps[0].height + 128) / this.canvas.height);

    //     this.canvas.addEventListener("wheel", (e: any) => {
    //         let pinch = this.zoom;

    //         this.zoom = Math.min(Math.max(0.75, this.zoom * (1 + e.deltaY / 1000)), maxz);
    //         this.mx = this.maps[0].width  - this.canvas.width * this.zoom;
    //         this.my = this.maps[0].height - this.canvas.height * this.zoom;
    //         this.sx = Math.max(Math.min(0, this.mx), Math.min(Math.max(0, this.mx), this.sx + (e.x * pinch - e.x * this.zoom)));
    //         this.sy = Math.max(Math.min(0, this.my), Math.min(Math.max(0, this.my), this.sy + (e.y * pinch - e.y * this.zoom)));
    //         this.updateMap();
    //     });
    // }

    public updateMap() {
        /*const sWidth = this.zoom * (this.canvas.width);
        const sHeight = this.zoom * (this.canvas.height);

        this.mx = this.maps[0].width  - this.canvas.width * this.zoom;
        this.my = this.maps[0].height - this.canvas.height * this.zoom;
        */

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let map of this.maps){
            //this.ctx.drawImage(map, this.sx, this.sy, sWidth, sHeight, 0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.clearRect(0,0,32,this.canvas.height);
        this.ctx.clearRect(0,0,this.canvas.width,32);
        this.ctx.clearRect(this.canvas.width-32,0,32,this.canvas.height);
        this.ctx.clearRect(0,this.canvas.height-32,this.canvas.width,32);
        
        //this.drawGrid();
        //this.drawMarker();
    }

    // private drawGrid() {
    //     const res = this.mapfile.res;
    //     const width = 30 * res;
    //     const height = 30 * res;

    //     const mx = 384;
    //     const my = 336;
    //     const ex = 1670;
    //     const ey = 2233;

    //     const ox = Math.max(16, (-this.sx) * (1/this.zoom) - 16);
    //     const oy = Math.max(16, (-this.sy) * (1/this.zoom) - 16);
    //     const wx =  Math.min(this.canvas.width - 16 - ox, (this.maps[0].width - this.sx) * (1/this.zoom) - ox + 16);
    //     const wy = Math.min(this.canvas.height - 16 - oy, (this.maps[0].height - this.sy) * (1/this.zoom) - oy + 16);

    //     function drawBoundary(){
    //         this.ctx.strokeStyle = this.gridColor;
    //         this.ctx.lineWidth = 2;

    //         this.ctx.beginPath();
    //         this.ctx.rect(ox, oy, wx, wy);
    //         this.ctx.stroke();
    //         this.ctx.closePath();

    //         this.ctx.beginPath();
    //         this.ctx.moveTo(ox + 16, oy);
    //         this.ctx.lineTo(ox + 16, wy + oy);
    //         this.ctx.stroke();
    //         this.ctx.closePath();
    
    //         this.ctx.beginPath();
    //         this.ctx.moveTo(wx + ox - 16, oy);
    //         this.ctx.lineTo(wx + ox - 16, wy + oy);
    //         this.ctx.stroke();
    //         this.ctx.closePath();
    
    //         this.ctx.beginPath();
    //         this.ctx.moveTo(ox, oy + 16);
    //         this.ctx.lineTo(ox + wx, oy + 16);
    //         this.ctx.stroke();
    //         this.ctx.closePath();
    
    //         this.ctx.beginPath();
    //         this.ctx.moveTo(ox, wy + oy - 16);
    //         this.ctx.lineTo(ox + wx, wy + oy - 16);
    //         this.ctx.stroke();
    //         this.ctx.closePath();

    //         this.ctx.clearRect(ox - 2, oy - 2, 17, 17);
    //         this.ctx.clearRect(ox - 2, wy + oy - 15, 17, 17);
    //         this.ctx.clearRect(wx + ox -15, oy - 2, 17, 17);
    //         this.ctx.clearRect(wx + ox - 15,wy + oy - 15, 17, 17);
    //     }

    //     function drawCrosses(){
    //         const nbx = ex / width;
    //         const nby = ey / height;

    //         const length = 3;

    //         for(let i = 0; i < nbx; i++) {
    //             let w = Math.floor((i * width - this.sx + mx) * (1 / this.zoom)) - 5;

    //             for(let j = 0; j < nby; j++) {
    //                 let h = Math.floor((j * height - this.sy + my) * (1 / this.zoom)) - 5;

    //                 this.ctx.strokeStyle= this.hColor;
    //                 this.ctx.lineWidth = 1;

    //                 if((w + 5.5) > 32 && (w + 5.5) < this.canvas.width - 32 && (w + 6) >= (-this.sx + mx) * (1 / this.zoom) && 
    //                    (h + 5.5) > 32 && (h + 5.5) < this.canvas.height - 32 && (h + 6) >= (-this.sy + my)* (1 / this.zoom)){
    //                     this.ctx.beginPath(); 
    //                     this.ctx.moveTo(w, h + 0.5);
    //                     this.ctx.lineTo(w + length, h + 0.5);
    //                     this.ctx.moveTo(w + 0.5, h);
    //                     this.ctx.lineTo(w + 0.5, h + length);

    //                     this.ctx.moveTo(w + 9, h + 0.5);
    //                     this.ctx.lineTo(w + 10 - length, h + 0.5);
    //                     this.ctx.moveTo(w + 9.5, h);
    //                     this.ctx.lineTo(w + 9.5, h + length);

    //                     this.ctx.moveTo(w, h + 9.5);
    //                     this.ctx.lineTo(w + length, h + 9.5);
    //                     this.ctx.moveTo(w + 0.5, h + 10);
    //                     this.ctx.lineTo(w + 0.5, h + 10 - length);

    //                     this.ctx.moveTo(w + 10, h + 9.5);
    //                     this.ctx.lineTo(w + 10 - length, h + 9.5);
    //                     this.ctx.moveTo(w + 9.5, h + 10);
    //                     this.ctx.lineTo(w + 9.5, h + 10 - length);

    //                     this.ctx.stroke();
    //                     this.ctx.closePath();
    //                 }
    //             }
    //         }
    //     }

    //     function drawLines(){
    //         const sWidth = width / 3;
    //         const sHeight = height / 3;
            
    //         const nbx = ex / width;
    //         const nby = ey / height;
    
    //         for(let i = 0; i < nbx; i++) {
    //             let w = Math.floor((i * width - this.sx + mx) * (1 / this.zoom));
                
    //             this.ctx.strokeStyle= this.colors.lightBlack;
    //             this.ctx.lineWidth = 1;

    //             for(let j = 1; j < 3; j++){
    //                 let sw = Math.floor(w + (j * sWidth) * (1 / this.zoom));

    //                 if(sw > 32 && sw < (-this.sx + mx + ex) * (1/this.zoom) && sw < this.canvas.width - 32){
    //                     this.ctx.beginPath(); 
    //                     this.ctx.moveTo(sw + 0.5,  Math.max(32, (-this.sy + my) * (1/this.zoom)));
    //                     this.ctx.lineTo(sw + 0.5, Math.min(oy + wy - 16 ,(-this.sy + my + ey) * (1/this.zoom)));
    //                     this.ctx.stroke();
    //                     this.ctx.closePath();
    //                 }
    //             }

    //             this.ctx.strokeStyle = this.colors.lightBlack;
    //             this.ctx.lineWidth = 2;

    //             if(w > 32 && w < this.canvas.width - 32){
    //                 this.ctx.beginPath();
    //                 this.ctx.moveTo(w, oy + 0.5);
    //                 this.ctx.lineTo(w, oy + 15.5);
    //                 this.ctx.stroke(); 
    //                 this.ctx.moveTo(w,  Math.max(32, (-this.sy + my) * (1/this.zoom)));
    //                 this.ctx.lineTo(w, Math.min(oy + wy - 16 ,(-this.sy + my + ey) * (1/this.zoom)));
    //                 this.ctx.stroke();
    //                 this.ctx.closePath();
    //             }
    //         }
    
    //         for(let i = 0; i < nby; i++) {
    //             let h = Math.floor((i * height - this.sy + my) * (1 / this.zoom));

    //             this.ctx.strokeStyle= this.colors.lightBlack;
    //             this.ctx.lineWidth = 1;

    //             for(let j = 1; j < 3; j++){
    //                 let sh = Math.floor(h + (j * sHeight) * (1 / this.zoom));

    //                 if(sh > 32 && sh < (-this.sy + my + ey) * (1/this.zoom) && sh < (oy + wy - 16)){
    //                     this.ctx.beginPath(); 
    //                     this.ctx.moveTo( Math.max(32, (-this.sx + mx) * (1/this.zoom)), sh + 0.5);
    //                     this.ctx.lineTo(Math.min(wx + ox - 16, (-this.sx + mx + ex) * (1/this.zoom)), sh + 0.5);
    //                     this.ctx.stroke();
    //                     this.ctx.closePath();
    //                 }
    //             }

    //             this.ctx.strokeStyle = this.colors.lightBlack;
    //             this.ctx.lineWidth = 2;

    //             if(h > 32 && h < this.canvas.height - 32){
    //                 this.ctx.beginPath(); 
    //                 this.ctx.moveTo( Math.max(32, (-this.sx + mx) * (1/this.zoom)), h);
    //                 this.ctx.lineTo( Math.min(wx + ox, (-this.sx + mx + ex) * (1/this.zoom)), h);
    //                 this.ctx.stroke();
    //                 this.ctx.closePath();
    //             }
    //         }

    //         // for(let i = 0; i < nbx; i++) {
    //         //     let w = (i * width - this.sx) * (1 / this.zoom);

    //         //     for(let j = 0; j < nby; j++) {
    //         //         let h = (j * height - this.sy) * (1 / this.zoom);
                    
    //         //         for(let k = 1; k < 5; k++){
    //         //             let sw = Math.floor(w + (k * sWidth) * (1 / this.zoom));

    //         //             for(let l = 1; l < 5; l++){
    //         //                 let sh = Math.floor(h + (l * sHeight) * (1 / this.zoom));
                            
    //         //                 if (sh > 32 && sw > 32 && sh < oy + wy - 16 && sw < ox + wx - 16){
    //         //                     this.ctx.fillStyle = "rgba(0, 200, 200, 0.75)";
    //         //                     //this.ctx.fillRect(sw-0.5, sh-0.5, 1.5, 1.5);
    //         //                     this.ctx.fillRect(sw, sh, 1, 1);
    //         //                 }
    //         //             }
    //         //         }
    //         //     }
    //         // }
    //     }

    //     function drawIndices(){

    //         const nbx = Math.floor(ex / width);
    //         const nby = Math.floor(ey / height);

    //         for(let i = 0; i < nbx; i++) {
    //             let w = Math.floor((i * width - this.sx + mx) * (1 / this.zoom));

    //             this.ctx.clearRect(w + (width * (1 / this.zoom) / 2) - 16, oy - 8, 32, 16);
    //             this.ctx.font = "12px Arial";
    //             this.ctx.fillStyle = this.hColor;
    //             this.ctx.fillText("X" + i, w + (width * (1 / this.zoom) / 2) - 7, oy + 4);
    //         }
    
    //         for(let i = 0; i < nby; i++) {
    //             let h = Math.floor((i * height - this.sy + my) * (1 / this.zoom));
                
    //             this.ctx.clearRect(ox - 8, h + (height * (1 / this.zoom) / 2) - 16, 16, 32);
    //             this.ctx.font = "12px Arial";
    //             this.ctx.fillStyle = this.hColor;
    //             this.ctx.fillText("Y" + i, ox - 8, h + (height * (1 / this.zoom) / 2) + 4);
    //         }
    //     }
        
    //     drawBoundary.call(this);
    //     //drawCrosses.call(this);
    //     drawLines.call(this);
    //     drawIndices.call(this);
    // }

    // drawMarker(){
    //     const mx = 295;
    //     const my = 502;

    //     for(let m of this.mapService.tokens){
    //         let ox = ((m.px * this.mapfile.res) - this.sx + mx) * (1/this.zoom) - 24;
    //         let oy = ((m.py * this.mapfile.res) - this.sy + my) * (1/this.zoom) - 24;

    //         let icon : HTMLImageElement;

    //         icon = this.iconset.frdClr;

    //         if(m == this.mapService.selected){
    //             this.ctx.lineWidth = 1;
    //             this.ctx.strokeStyle = this.colors.testGray;
    //             this.ctx.beginPath();
    //             this.ctx.rect(ox - 4, oy -4, 56, 56);
    //             this.ctx.stroke();
    //             this.ctx.closePath();
    //         }

    //         switch(m.type){
    //             case "frd" : {
    //                 icon = this.iconset.frdClr;
    //             }
    //             case "fr1": {
    //                icon = this.iconset.frd1;
    //                break; 
    //             }
    //             case "fr2": {
    //                 icon = this.iconset.frd2;
    //                 break; 
    //              }
    //              case "fr3": {
    //                 icon = this.iconset.frd3;
    //                 break; 
    //              }
    //              case "foe1": {
    //                 icon = this.iconset.foe1;
    //                 break; 
    //              }
    //              case "foe2": {
    //                  icon = this.iconset.foe2;
    //                  break; 
    //               }
    //               case "foe3": {
    //                  icon = this.iconset.foe3;
    //                  break; 
    //               }
    //               case "obj": {
    //                 icon = this.iconset.obj;
    //                 break; 
    //              }
    //              case "green": {
    //                 icon = this.iconset.green;
    //                 break; 
    //              }
    //              case "unid": {
    //                 icon = this.iconset.unid;
    //                 break; 
    //              }
    //         }

    //         this.ctx.drawImage(icon, ox, oy);

    //         this.ctx.font = "12px Arial";
    //         this.ctx.lineWidth = 3;
    //         this.ctx.strokeStyle = this.colors.black;
    //         this.ctx.strokeText(m.label,ox + 54, oy + 58);
    //         this.ctx.strokeText(m.rfid,ox + 54, oy + 44);
    //         this.ctx.lineWidth = 1;
    //         this.ctx.strokeStyle = this.colors.testGray;
    //         this.ctx.strokeText(m.label,ox + 54, oy + 58);
    //         this.ctx.strokeText(m.rfid,ox + 54, oy + 44);

    //         if(m.type != "unid" && m.type != "green" && m.type != "obj" && m.type != ""){
    //             let tdelta = new Date().getTime() - m.time;
    //             tdelta /= 1000;
    //             tdelta = Math.round(tdelta);

    //             let minutes: number | string = Math.round(tdelta/60);
    //             let seconds: number | string = (tdelta % 60)

    //             if (minutes < 10){
    //                 minutes = "0" + minutes.toString();
    //             } else {
    //                 minutes = minutes.toString();
    //             }

    //             if (seconds < 10){
    //                 seconds = "0" + seconds.toString();
    //             } else {
    //                 seconds = seconds.toString();
    //             }
    //             this.ctx.strokeText("T-" + minutes + ":" + seconds, ox + 64, oy + 74);
    //         }
    //     }
    // }
}