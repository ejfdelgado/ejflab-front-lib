import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { N02ListContentComponent } from './views/n02-list-content/n02-list-content.component';
import { N01DynamicContentComponent } from './views/n01-dynamic-content/n01-dynamic-content.component';
import { EjflabFrontLibComponent } from 'ejflab-front-lib';
import { N03ModelComponent } from './views/n03-model/n03-model.component';
import { N04ReactiveFormsComponent } from './views/n04-reactive-forms/n04-reactive-forms.component';
import { N05FormValidationComponent } from './views/n05-form-validation/n05-form-validation.component';
import { N06PipesComponent } from './views/n06-pipes/n06-pipes.component';
import { MycommonModule } from 'projects/ejflab-front-lib/src/public-api';

@NgModule({
  declarations: [
    GuidesComponent,
    DocumentationComponent,
    N01DynamicContentComponent,
    N02ListContentComponent,
    N03ModelComponent,
    N04ReactiveFormsComponent,
    N05FormValidationComponent,
    N06PipesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GuidesRoutingModule,
    EjflabFrontLibComponent,
    MycommonModule
  ],
})
export class GuidesModule {}
