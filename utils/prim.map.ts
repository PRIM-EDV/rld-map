import { MapFile } from '../core/map';
import { Coordinate } from '../../core/coordinate';

const layers = [{
    image: new Image (),
    imageUrl: 'assets/maps/prim/prim.map.svg',
    origin: new Coordinate (),
    resolution: [2.6, 2.6],
    active: true
}];

export class PrimMap extends MapFile {
    constructor() {
        super(layers, 'PRIM');
    }
}
