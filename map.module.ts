import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { WheelMenuComponent } from './wheel-menu/wheel-menu.component';


@NgModule({
    // imports: [
    //     RouterModule.forChild([
    //         {
    //           path: '',
    //           component: MapComponent
    //         }
    //       ])
    // ],
    declarations: [MapComponent, WheelMenuComponent],
    exports: [MapComponent, WheelMenuComponent],
})
export class MapModule {}
