import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { N02ListContentComponent } from './views/n02-list-content/n02-list-content.component';
import { N01DynamicContentComponent } from './views/n01-dynamic-content/n01-dynamic-content.component';
import { EjflabFrontLibComponent } from 'ejflab-front-lib';
import { N03ModelComponent } from './views/n03-model/n03-model.component';

@NgModule({
  declarations: [
    GuidesComponent,
    DocumentationComponent,
    N01DynamicContentComponent,
    N02ListContentComponent,
    N03ModelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GuidesRoutingModule,
    EjflabFrontLibComponent,
  ],
})
export class GuidesModule {}
