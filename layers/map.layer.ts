import { Layer } from '../core/layer';
import { MapFile } from '../utils/map.util';
import { Coordinate } from '../backend/utils/coordinate.util';
import { Direction } from '../backend/utils/direction.util';
import { ContextMenuService } from '../shared/context-menu.service';
import { BehaviorSubject } from 'rxjs';

export class MapLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _contextMenuService: ContextMenuService;
    private _mapfile: MapFile = null;
    private _viewport: Direction = new Direction();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mapfile: MapFile, contextMenuService: ContextMenuService) {
        super();

        this._canvas = canvas;
        this._ctx = ctx;
        this._contextMenuService = contextMenuService;
        this._mapfile = mapfile;

        this._mapfile.resourceReadyState.subscribe((isReady: boolean) => {
            if (isReady) {
                this.resourceReadyState.next(true);
            }
        });
    }

    public draw() {
        this._viewport.inPixel = {x: this._canvas.width, y: this._canvas.height};
        for (const map of this._mapfile.layers) {
            if (map.active) {
                this._ctx.drawImage(map.image, Coordinate.offset.x, Coordinate.offset.y, this._viewport.inCanvas.x, this._viewport.inCanvas.y, 0, 0, this._canvas.width, this._canvas.height);
            }
        }

        this._drawGrid();
    }

    public onContextMenu(e: MouseEvent): boolean {
        this._contextMenuService.wheelMenu.mapObjectContext.open({x: e.x, y: e.y});
        return true;
    }

    public onPan(e: any, offset: {x: number, y: number}): boolean {
        if (e.maxPointers === 1) {
            Coordinate.offset = {
                x: offset.x - e.deltaX * Coordinate.scale, // Math.max(Math.min(0, this.mx), Math.min(Math.max(0, this.mx), offset.x - e.deltaX * Coordinate.scale)),
                y: offset.y - e.deltaY * Coordinate.scale// Math.max(Math.min(0, this.my), Math.min(Math.max(0, this.my), offset.y - e.deltaY * Coordinate.scale
            };
        }

        return true;
    }

    public onPinch(e: HammerInput, pinch: number, center: {x: number, y: number}, offset: {x: number, y: number}) {
        Coordinate.scale = pinch * (1 / e.scale);
        Coordinate.offset = {
            x: offset.x - (center.x * (Coordinate.scale - pinch)),
            y: offset.y - (center.y * (Coordinate.scale - pinch))
        };
    }

    public onScroll(e: WheelEvent) {
        const scale = Coordinate.scale;
        Coordinate.scale = scale * (1 + e.deltaY / 1000);
        Coordinate.offset = {
            x: Coordinate.offset.x - (e.x * (Coordinate.scale - scale)),
            y: Coordinate.offset.y - (e.y * (Coordinate.scale - scale))
        };
    }

    private _drawGrid() {
        const gridOrigin = new Coordinate();
        let coord = new Coordinate();
        // const cornerTL = new Coordinate();
        // const cornerBR = new Coordinate();

        gridOrigin.inPixel = {x: 240, y: 2710};
        
        
        this._ctx.strokeStyle= '#000000';
        this._ctx.lineWidth = 1;

        coord.inPixel = gridOrigin.inPixel;
        for (let i = 0; i < 30; i++) {
            
            this._ctx.beginPath();
            this._ctx.moveTo(coord.inCanvas.x + 0.5, 0);
            this._ctx.lineTo(coord.inCanvas.x + 0.5, this._canvas.height / 2 - 100);
            this._ctx.stroke();
            this._ctx.closePath();

            this._ctx.font = '14px roboto';
            this._ctx.fillText("X " + String(i) , coord.inCanvas.x + 6, this._canvas.height / 2);

            coord.inMeter = {x: coord.inMeter.x + 30, y: coord.inMeter.y};
        }

        // cornerTL.inCanvas = {x: 0, y: 0};
        // cornerBR.inCanvas = {x: this._canvas.width, y: this._canvas.height};

        // const sx = cornerTL.inMeter.x + ( cornerTL.inMeter.x - gridOrigin.inMeter.x % 30 );
        // const sy = cornerTL.inMeter.y + ( cornerTL.inMeter.y - gridOrigin.inMeter.y % 30 );

       
        
        // let coord = new Coordinate();
        // coord.inMeter = {x: sx, y: sy};

        // console.log(Math.floor(Math.abs(cornerBR.inMeter.x - sx) / 30));

        // for (let i = 0; i < Math.floor(Math.abs(cornerBR.inMeter.x - sx) / 30); i++) {

        //     this._ctx.beginPath();
        //     this._ctx.moveTo(coord.inCanvas.x + 0.5, 0);
        //     this._ctx.lineTo(coord.inCanvas.x + 0.5, this._canvas.height);
        //     this._ctx.stroke();
        //     this._ctx.closePath();

        //     coord.inMeter = {x: coord.inMeter.x + 30, y: coord.inMeter.y};
        // }

    }
}
