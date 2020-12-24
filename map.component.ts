import {Component, ViewChild, Input, AfterViewInit, ElementRef} from '@angular/core';
import * as Hammer from 'hammerjs';
import { BackendService } from 'src/app/backend';
import { MapFile, MapData} from './core';
import { MapService } from './map.service';

// Test
import { PrimMap } from './utils/prim.map';
import { Layer } from './core';
import { MapLayer } from './layers/map.layer';
import { IconLayer } from './layers/icon.layer';
import { Coordinate, MapObject } from 'src/app/core';


@Component({
    selector: 'map',
    styleUrls: ['./map.component.scss'],
    templateUrl: 'map.component.html',

})
export class MapComponent implements AfterViewInit {
    @Input() _backend: BackendService;
    @Input() _movable = true;
    @Input() _imageQuality = 1;

    @ViewChild('map', {static: true}) private _canvas: ElementRef<HTMLCanvasElement>;
    private _ctx: CanvasRenderingContext2D;
    private _mc: HammerManager;

    private _layers: Array<Layer> = [];
    private _mapfile: MapFile = null;
    private _origin: Coordinate = new Coordinate();


    constructor(private _mapService: MapService) {
        this._mapfile = new PrimMap();
        this._mapService.map = this;
    }

    ngAfterViewInit() {
        this._ctx = this._canvas.nativeElement.getContext('2d');
        this._mc = new Hammer(this._canvas.nativeElement);

        //
        Coordinate.viewportOffset = {x: this._canvas.nativeElement.getBoundingClientRect().left, y: this._canvas.nativeElement.getBoundingClientRect().top};

        // Add map layers
        this._layers.push(new MapLayer(this._canvas.nativeElement, this._ctx, this._mapfile, this._imageQuality));
        this._layers.push(new IconLayer(this._canvas.nativeElement, this._ctx, this._backend));

        this.startListenToResize();

        if (this._movable) {
            this.startListenToPan();
            this.startListenToPinch();
        }

        // Set map-tool options
        if (this._backend.type == 'http') {
            this.startListenToScroll();
            this.startListenToClick();
            this.startListenToMouseMove();
        }

        this._onResourcesReady(() => {
            this.resize.call(this);
            this.update.call(this);
        });

        this._backend.onSynchronise(() => {
            this.update.call(this);
        });
    }

    public centerToMapObject(mapObject: MapObject) {
        const width = this._canvas.nativeElement.clientWidth;
        const height = this._canvas.nativeElement.clientHeight;
        const coords = mapObject.coord.inCanvas;

        Coordinate.offset.x -= (width / 2 - coords.x) * Coordinate.scale;
        Coordinate.offset.y -= (height / 2 - coords.y) * Coordinate.scale;

        this.update();
    }

    public getCenter() {
        const width = this._canvas.nativeElement.clientWidth;
        const height = this._canvas.nativeElement.clientHeight;


        return {x: width / 2, y: height / 2};
    }

    public resize() {
        const width = this._canvas.nativeElement.clientWidth;
        const height = this._canvas.nativeElement.clientHeight;

        this._canvas.nativeElement.width = width * this._imageQuality;
        this._canvas.nativeElement.height = height * this._imageQuality;
        this._ctx.scale(this._imageQuality, this._imageQuality);
        this.update.call(this);
    }

    public startListenToClick() {
        this._canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button === 0) {
                // this._menuService.wheelMenu.close();
                // this._menuService.popupMenu.close();
            }
        });
        this._canvas.nativeElement.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();

            for (let i = this._layers.length - 1; i >= 0; i--) {
                const layer = this._layers[i];
                if (!layer.onContextMenu(e)) { break; }
            }
        });
    }

    public startListenToMouseMove() {
        this._canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
            for (let i = this._layers.length - 1; i >= 0; i--) {
                const layer = this._layers[i];
                if (!layer.onMouseMove(e)) {
                    this.update();
                    break;
                }
            }
        });
    }

    public startListenToResize() {
        window.addEventListener('resize', () => {
            this.resize.call(this);
            this.update.call(this);
        });

        window.addEventListener('orientationchange', () => {
            this.resize.call(this);
            this.update.call(this);
        });
    }

    private startListenToPan() {
        let offset = {x: 0, y: 0};
        let startPos = {x: 0, y: 0};

        this._mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        this._mc.on('panstart', (e: HammerInput) => {
            offset = Coordinate.offset;
            startPos = {x: e.center.x, y: e.center.y};

            for (const layer of this._layers) {
                layer.onPanStart(e);
            }
        });
        this._mc.on('pan', (e: HammerInput) => {
            if (startPos.x < 50) { return; }

            for (let i = this._layers.length - 1; i >= 0; i--) {
                const layer = this._layers[i];
                if (!layer.onPan(e, offset)) { break; }
            }
            this.update();
        });
        this._mc.on('panend', (e: HammerInput) => {
            for (const layer of this._layers) {
                layer.onPanEnd(e);
            }
        });
    }

    private startListenToPinch() {
        let pinch = 0;
        let center = {x: 0, y: 0};
        let offset = {x: 0, y: 0};

        this._mc.add ( new Hammer.Pinch());
        this._mc.on('pinchstart', (e: HammerInput) => {
            pinch = Coordinate.scale;
            center = {x: e.center.x - e.target.getBoundingClientRect().left, y: e.center.y - e.target.getBoundingClientRect().top};
            offset = Coordinate.offset;

            for (const layer of this._layers) {
                layer.onPinchStart(e);
            }
        });
        this._mc.on('pinch', (e: HammerInput) => {
            for (const layer of this._layers) {
                layer.onPinch(e, pinch, center, offset);
            }
            this.update();
        });
    }

    private startListenToScroll() {
        document.addEventListener('wheel', (e: any) => {
            for (const layer of this._layers) {
                layer.onScroll(e);
            }
            // this._menuService.wheelMenu.close();
            this.update();
        });
    }

    public update() {
        this._ctx.clearRect(0, 0, this._canvas.nativeElement.width, this._canvas.nativeElement.height);

        for (const layer of this._layers) {
            layer.draw();
        }
    }

    private _onResourcesReady(callback) {
        let readyLayers = 0;

        for (const layer of this._layers) {
            layer.resourceReadyState.subscribe((isReady: boolean) => {
                if (isReady) {
                    readyLayers += 1;

                    if (readyLayers == this._layers.length) {
                        callback();
                    }
                }
            });
        }
    }
}