import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GuidesRoutingModule } from "./guides-routing.module";
import { GuidesComponent } from "./guides.component";
import { DocumentationComponent } from "./components/documentation/documentation.component";
import { N02ListContentComponent } from "./views/n02-list-content/n02-list-content.component";
import { N01DynamicContentComponent } from "./views/n01-dynamic-content/n01-dynamic-content.component";
import { EjflabFrontLibComponent } from "ejflab-front-lib";

@NgModule({
  declarations: [
    N01DynamicContentComponent,
    N02ListContentComponent,
    GuidesComponent,
    DocumentationComponent,
  ],
  imports: [CommonModule, GuidesRoutingModule, EjflabFrontLibComponent],
})
export class GuidesModule {}
