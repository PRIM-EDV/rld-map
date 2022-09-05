import * as Hammer from "hammerjs";

import { Component, ViewChild, AfterViewInit,ElementRef, Output, EventEmitter } from "@angular/core";
import { MapLayer } from "./common/map-layer";
import { TerrainLayer } from "./map-layers/terrain.layer";
import { ReplaySubject } from "rxjs";
import { EntitiesLayer } from "./map-layers/entities.layer";
import { MapEntityData } from "./common/map-entity-data";

@Component({
    selector: "rld-map",
    styleUrls: ["./map.component.scss"],
    templateUrl: "map.component.html",
})
export class MapComponent implements AfterViewInit {

    @Output() onTerrainContextMenu = new EventEmitter<{cursorPosition: {x: number, y: number}, mapPosition: {x: number, y: number}}>();
    @Output() onEntityContextMenu = new EventEmitter<{cursorPosition: {x: number, y: number}, mapPosition: {x: number, y: number}, entity: MapEntityData}>();
    @Output() onEntityMoved = new EventEmitter<MapEntityData>();

    @ViewChild("map", { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;

    public onResourcesReady: ReplaySubject<void> = new ReplaySubject<void>(1);

    private ctx!: CanvasRenderingContext2D;
    private mc!: HammerManager;
    private mapLayers: MapLayer[] = [];

    constructor(private ref:ElementRef) {}

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext("2d")!;
        this.mc = new Hammer(this.canvas.nativeElement);

        this.initializeLayers();
        this.initializePan();
        this.initializeScroll();
        this.initializeContextMenu();

        this.onResourcesReady.subscribe(this.handleResourcesReady.bind(this));
    }

    public deleteMapEntity(id: string) {
        const entitiesLayer = this.mapLayers[1] as EntitiesLayer;
        const index = entitiesLayer.entities.findIndex((entity) => {return entity.id == id});
          
        if (index) {
            entitiesLayer.entities.splice(index, 1);
        }

        this.update();
    }

    public createMapEntity(data: MapEntityData) {
        const entitiesLayer = this.mapLayers[1] as EntitiesLayer;

        entitiesLayer.createMapEntity(data);
        this.update();
    }

    public createOrUpdateMapEntity(data: MapEntityData) {
        const entitiesLayer = this.mapLayers[1] as EntitiesLayer;
        const entity = entitiesLayer.entities.find(el => el.id == data.id)
        if (entity) {
            entity.position = data.position;
            entity.size = data.size;
            entity.text = data.text;
        } else {
            this.createMapEntity(data);
        }
        this.update();
    }

    // public centerToMapObject(mapObject: MapObject) {
    //         const width = this._canvas.nativeElement.clientWidth;
    //         const height = this._canvas.nativeElement.clientHeight;
    //         const coords = mapObject.coord.inCanvas;

    //         Coordinate.offset.x -= (width / 2 - coords.x) * Coordinate.scale;
    //         Coordinate.offset.y -= (height / 2 - coords.y) * Coordinate.scale;

    //         this.update();
    // }

    // public getCenter() {
    //         const width = this._canvas.nativeElement.clientWidth;
    //         const height = this._canvas.nativeElement.clientHeight;

    //         return {x: width / 2, y: height / 2};
    // }

    public resize() {
        const width = this.canvas.nativeElement.clientWidth;
        const height = this.canvas.nativeElement.clientHeight;

        this.canvas.nativeElement.width = width;
        this.canvas.nativeElement.height = height;
    }

    public update() {
        this.resize();
        for (const layer of this.mapLayers) {
            layer.render();
        }
    }

    private initializeContextMenu() {
        this.canvas.nativeElement.oncontextmenu = (ev: MouseEvent) => {
            const cursorPosition = { x: ev.x - this.canvas.nativeElement.getBoundingClientRect().left, y: ev.y - this.canvas.nativeElement.getBoundingClientRect().top};
            ev.preventDefault();

            if (this.mapLayers[1].onContextMenu(ev)) {
                const entitiesLayer = this.mapLayers[1] as EntitiesLayer;
                const mapPosition = entitiesLayer.getLocalPosition(ev);

                this.onEntityContextMenu.emit({cursorPosition: cursorPosition, mapPosition: mapPosition, entity: entitiesLayer.contextEntityData!});
                return;
            }
            if (this.mapLayers[0].onContextMenu(ev)) {
                const mapPosition = this.mapLayers[0].getLocalPosition(ev);

                this.onTerrainContextMenu.emit({cursorPosition: cursorPosition, mapPosition: mapPosition});
                return;
            }
        };
    }

    private initializePan() {
        let offset = { x: 0, y: 0 };
        let startPos = { x: 0, y: 0 };

        this.mc.add(
            new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 })
        );
        this.mc.on("panstart", (e: HammerInput) => {
            offset = offset;
            startPos = { x: e.center.x, y: e.center.y };
            for (let i = this.mapLayers.length - 1; i >= 0; i--) {
                const layer = this.mapLayers[i];
                if (!layer.onPanStart(e)) {
                    break;
                }
            }
        });

        this.mc.on("pan", (e: HammerInput) => {
            if (startPos.x < 50) {
                return;
            }

            for (let i = this.mapLayers.length - 1; i >= 0; i--) {
                const layer = this.mapLayers[i];
                if (!layer.onPan(e, offset)) {
                    break;
                }
            }
            this.update();
        });
        this.mc.on("panend", (e: HammerInput) => {
            for (const layer of this.mapLayers) {
                layer.onPanEnd(e);
            }
        });
    }

    private initializeScroll() {
        document.addEventListener("wheel", (e: any) => {
            if(this.ref.nativeElement.contains(e.target)) {
                for (const layer of this.mapLayers) {
                    layer.onScroll(e);
                }
                this.update();
            }
        });
    }

    private handleResourcesReady() {
        this.update();
    }

    private initializeLayers() {
        const terrainLayer = new TerrainLayer(this.canvas.nativeElement, this.ctx);
        const entitiesLayer = new EntitiesLayer(this.canvas.nativeElement, this.ctx);

        entitiesLayer.onEntityMoved.subscribe((data) => {
            this.onEntityMoved.next(data);
        })

        this.mapLayers = [ terrainLayer, entitiesLayer ];

        for (const layer of this.mapLayers) {
            layer.resourceReadyState.subscribe((readySate) => {
                for (const mapLayer of this.mapLayers) {
                    if (!mapLayer.resourceReadyState.value) return;
                }
                this.onResourcesReady.next();
            });
        }
    }

    // private _onResourcesReady(callback) {
    //         let readyLayers = 0;

    //         for (const layer of this._layers) {
    //                 layer.resourceReadyState.subscribe((isReady: boolean) => {
    //                         if (isReady) {
    //                                 readyLayers += 1;

    //                                 if (readyLayers == this._layers.length) {
    //                                         callback();
    //                                 }
    //                         }
    //                 });
    //         }
    // }
}
