import { Layer, MapFile } from '../core';
import { Direction } from 'src/app/core/direction';
import { Coordinate } from 'src/app/core/coordinate';

export class MapLayer extends Layer {
    private _scale: number = 1.0;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _mapfile: MapFile = null;
    private _viewport: Direction = new Direction();
    private _origin: Coordinate = new Coordinate();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mapfile: MapFile, scale: number = 1.0) {
        super();

        this._canvas = canvas;
        this._ctx = ctx;
        this._mapfile = mapfile;
        this._scale = scale;

        this._mapfile.resourceReadyState.subscribe((isReady: boolean) => {
            if (isReady) {
                this.resourceReadyState.next(true);
            }
        });
    }

    public draw() {
        // this._viewport.inPixel = {x: this._canvas.width, y: this._canvas.height}; #
        for (const map of this._mapfile.layers) {
            if (map.active) {
                this._ctx.drawImage(map.image, this._origin.inCanvas.x, this._origin.inCanvas.y, 3237.02 / Coordinate.scale, 2935.81 / Coordinate.scale);
            }
        }

        this._drawGrid();
    }

    public onContextMenu(e: MouseEvent): boolean {
        // this._contextMenuService.wheelMenu.mapObjectContext.open({x: e.x, y: e.y});
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
        //let coord = new Coordinate();
        const cornerTL = new Coordinate();
        const cornerBR = new Coordinate();

        gridOrigin.inPixel = {x: 567, y: 2594};
        
        
        this._ctx.strokeStyle= '#000000';
        this._ctx.lineWidth = 1;

        cornerTL.inPixel = gridOrigin.inPixel;
        cornerBR.inPixel = gridOrigin.inPixel;

        cornerTL.inMeter = {x: cornerTL.inMeter.x - 30, y: cornerTL.inMeter.y};
        
        for (let i = 0; i < 30; i++) {
            let boxWidth =  cornerBR.inCanvas.x - cornerTL.inCanvas.x;
            
            this._ctx.fillStyle = '#151515';
            this._ctx.fillRect(cornerTL.inCanvas.x + 1.5, this._canvas.height / this._scale - 20, boxWidth - 2, 20);
            this._ctx.font = '14px roboto';
            this._ctx.fillStyle = '#a0a0a0';
            this._ctx.fillText("X " + String(i + 1) , cornerTL.inCanvas.x + boxWidth / 2 - 12, this._canvas.height / this._scale - 4);

            cornerTL.inMeter = {x: cornerTL.inMeter.x + 30, y: cornerTL.inMeter.y};
            cornerBR.inMeter = {x: cornerBR.inMeter.x + 30, y: cornerBR.inMeter.y};
            
            this._ctx.beginPath();
            this._ctx.moveTo(cornerTL.inCanvas.x + 0.5, 0);
            this._ctx.lineTo(cornerTL.inCanvas.x + 0.5, this._canvas.height / this._scale);
            this._ctx.stroke();
            this._ctx.closePath();
        }

        cornerTL.inMeter = {x: cornerTL.inMeter.x, y: cornerTL.inMeter.y + 30};
        for (let i = 0; i < 35; i++) {
            let boxHeight = Math.abs(cornerBR.inCanvas.y - cornerTL.inCanvas.y);
            
            this._ctx.fillStyle = '#151515';
            this._ctx.fillRect(0,  cornerBR.inCanvas.y + 1.5, 20, boxHeight - 2);
            
            this._ctx.save()
            this._ctx.translate(0, cornerTL.inCanvas.y);
            this._ctx.rotate(-Math.PI/2);
            this._ctx.font = '14px roboto';
            this._ctx.fillStyle = '#a0a0a0';
            this._ctx.fillText("Y " + String(i + 1) , boxHeight / 2 - 15, 15);
            this._ctx.restore();

            cornerTL.inMeter = {x: cornerTL.inMeter.x, y: cornerTL.inMeter.y - 30};
            cornerBR.inMeter = {x: cornerBR.inMeter.x, y: cornerBR.inMeter.y - 30};
            
            this._ctx.beginPath();
            this._ctx.moveTo(0, cornerTL.inCanvas.y + 0.5);
            this._ctx.lineTo(this._canvas.width / this._scale, cornerTL.inCanvas.y + 0.5);
            this._ctx.stroke();
            this._ctx.closePath();
        }
    }
}
