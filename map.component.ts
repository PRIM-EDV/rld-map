import * as Hammer from "hammerjs";

import { Component, ViewChild, AfterViewInit,ElementRef, Output, EventEmitter } from "@angular/core";
import { MapLayer } from "./common/map-layer";
import { TerrainLayer } from "./map-layers/terrain.layer";
import { ReplaySubject } from "rxjs";
import { EntitiesLayer } from "./map-layers/entities.layer";
import { MapEntityData } from "./common/map-entity-data";
import { MapEntityStatus } from "proto/trx/trx.entity";

@Component({
    selector: "rld-map",
    styleUrls: ["./map.component.scss"],
    templateUrl: "map.component.html",
})
export class MapComponent implements AfterViewInit {

    @Output() onTerrainContextMenu = new EventEmitter<{cursorPosition: {x: number, y: number}, mapPosition: {x: number, y: number}}>();
    @Output() onEntityContextMenu = new EventEmitter<{cursorPosition: {x: number, y: number}, mapPosition: {x: number, y: number}, entity: MapEntityData}>();
    @Output() onEntityDblClick = new EventEmitter<MapEntityData>();
    @Output() onEntityMoved = new EventEmitter<MapEntityData>();

    @ViewChild("map", { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild("entity", { static: true }) private entityCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild("entityAnimation", { static: true }) private entityAnimationCanvas!: ElementRef<HTMLCanvasElement>;


    public onResourcesReady: ReplaySubject<void> = new ReplaySubject<void>(1);

    private ctx!: CanvasRenderingContext2D;
    private ctx2!: CanvasRenderingContext2D;
    private ctx3!: CanvasRenderingContext2D;
    private mc!: HammerManager;
    private mapLayers: MapLayer[] = [];

    constructor(private ref:ElementRef) {}

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext("2d")!;
        this.ctx2 = this.entityCanvas.nativeElement.getContext("2d")!;
        this.ctx3 = this.entityAnimationCanvas.nativeElement.getContext("2d")!;
        this.mc = new Hammer(this.canvas.nativeElement);

        this.initializeLayers();
        this.initializePan();
        this.initializePinch();
        this.initializeScroll();
        this.initializeContextMenu();
        this.initializeDblClick();

        this.onResourcesReady.subscribe(this.handleResourcesReady.bind(this));
    }

    public deleteMapEntity(id: string) {
        const entitiesLayer = this.mapLayers[1] as EntitiesLayer;
        const index = entitiesLayer.entities.findIndex((entity) => {return entity.id == id});
          
        if (index) {
            const entity = entitiesLayer.entities[index];
            
            entity.stopAnimation();
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

            if (data.status == MapEntityStatus.ENTITY_STATUS_REGULAR) {
                entity.hasAnimation = false;
            } else if (data.status == MapEntityStatus.ENTITY_STATUS_COMBAT) {
                entity.hasAnimation = true;
            }
        } else {
            this.createMapEntity(data);
        }
        this.update();
    }

    public toggleEntityPing(id: string) {
        const entitiesLayer = this.mapLayers[1] as EntitiesLayer;
        const entity = entitiesLayer.entities.find((entity) => {return entity.id == id});
        if (entity) {
            if (entity.hasAnimation) {
                entity.hasAnimation = false;
            } else {
                entity.hasAnimation = true;
            }
        }
    }

    public resize() {
        const width = this.canvas.nativeElement.clientWidth;
        const height = this.canvas.nativeElement.clientHeight;

        this.canvas.nativeElement.width = width;
        this.canvas.nativeElement.height = height;

        this.entityCanvas.nativeElement.width = width;
        this.entityCanvas.nativeElement.height = height;

        this.entityAnimationCanvas.nativeElement.width = width;
        this.entityAnimationCanvas.nativeElement.height = height;
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

    private initializeDblClick() {
        this.canvas.nativeElement.ondblclick = (ev: MouseEvent) => {
            const cursorPosition = { x: ev.x - this.canvas.nativeElement.getBoundingClientRect().left, y: ev.y - this.canvas.nativeElement.getBoundingClientRect().top};
            ev.preventDefault();

            if (this.mapLayers[1].onDblClick(ev)) {
                const entitiesLayer = this.mapLayers[1] as EntitiesLayer;
                const mapPosition = entitiesLayer.getLocalPosition(ev);

                this.onEntityDblClick.emit(entitiesLayer.contextEntityData!);
                return;
            }
        }
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

    private initializePinch() {
        let scale = 1;

        this.mc.add(new Hammer.Pinch());

        this.mc.on('pinchstart', (e: HammerInput) => {
            scale = MapLayer.scale;
            // pinch = Coordinate.scale;
            // center = {x: e.center.x, y: e.center.y};
            // offset = Coordinate.offset;

            for (const layer of this.mapLayers) {
                layer.onPinchStart(e);
            }
        });

        this.mc.on('pinch', (e: HammerInput) => {
            for (const layer of this.mapLayers) {
                layer.onPinch(e, scale);
            }
            this.update();
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
        const entitiesLayer = new EntitiesLayer(this.entityCanvas.nativeElement, this.ctx2, this.ctx3);

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
