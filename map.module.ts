import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { WheelMenuComponent } from './wheel-menu/wheel-menu.component';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
              path: '',
              component: MapComponent
            }
          ])
    ],
    declarations: [MapComponent, WheelMenuComponent],
    exports: [MapComponent, WheelMenuComponent],
})
export class MapModule {}
