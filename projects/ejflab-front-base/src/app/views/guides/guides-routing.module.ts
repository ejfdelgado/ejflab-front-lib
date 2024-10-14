import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidesComponent } from './guides.component';
import { N01DynamicContentComponent } from './views/n01-dynamic-content/n01-dynamic-content.component';
import { N02ListContentComponent } from './views/n02-list-content/n02-list-content.component';

const routes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      {
        path: 'app-n01-dynamic-content',
        component: N01DynamicContentComponent,
      },
      {
        path: 'app-n02-list-content',
        component: N02ListContentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidesRoutingModule {}
