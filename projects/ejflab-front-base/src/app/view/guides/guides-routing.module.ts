import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidesComponent } from './guides.component';
import { TheGuides } from './models/menu-index';

const child1 = TheGuides.map((guideRef) => {
  return {
    path: guideRef.id,
    component: guideRef.module,
  };
});

const child2 = TheGuides.map((guideRef) => {
  return {
    path: guideRef.id + "/:id",
    component: guideRef.module,
  };
});

const childs = [];
childs.push(...child1);
childs.push(...child2);

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: childs
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule { }
