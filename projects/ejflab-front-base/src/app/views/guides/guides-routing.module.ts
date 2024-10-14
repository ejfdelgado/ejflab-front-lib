import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidesComponent } from './guides.component';
import { TheGuides } from './models/menu-index';

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: TheGuides.map((guideRef) => {
      return {
        path: guideRef.id,
        component: guideRef.module,
      };
    }),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule {}
