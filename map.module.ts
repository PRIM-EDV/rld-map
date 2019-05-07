import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
              path: '',
              component: MapComponent
            }
          ])
    ],
    declarations: [MapComponent],
    exports: [MapComponent],
})
export class MapModule {}
