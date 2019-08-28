import { MapFile } from './map.util';
import { Coordinate } from '../backend/utils/coordinate.util';

const layers = [{
    image: new Image (),
    imageUrl: 'assets/maps/map.svg',
    origin: new Coordinate (),
    resolution: [2.6, 2.6],
    active: true
}];

export class PrimMap extends MapFile {
    constructor() {
        super(layers, 'PRIM');
    }
}
