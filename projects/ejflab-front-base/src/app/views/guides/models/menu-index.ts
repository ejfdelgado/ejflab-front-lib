import { N01DynamicContentComponent } from '../views/n01-dynamic-content/n01-dynamic-content.component';
import { N02ListContentComponent } from '../views/n02-list-content/n02-list-content.component';
import { N03ModelComponent } from '../views/n03-model/n03-model.component';
import { N04ReactiveFormsComponent } from '../views/n04-reactive-forms/n04-reactive-forms.component';
import { N05FormValidationComponent } from '../views/n05-form-validation/n05-form-validation.component';
import { N06PipesComponent } from '../views/n06-pipes/n06-pipes.component';
import { MenuItemData } from './menu';

export const TheGuides: Array<MenuItemData> = [
  {
    id: 'app-n01-dynamic-content',
    text: 'Dynamic Content',
    description: 'Show mapping from JSON to html',
    module: N01DynamicContentComponent,
  },
  {
    id: 'app-n02-list-content',
    text: 'ngFor',
    description: 'Let show array items',
    module: N02ListContentComponent,
  },
  {
    id: 'app-n03-ngmodel',
    text: 'ngModel',
    description: 'Capture input data',
    module: N03ModelComponent,
  },
  {
    id: 'app-n04-reactive-forms',
    text: 'Forms without ngModel',
    description: 'Handle complex forms',
    module: N04ReactiveFormsComponent,
  },
  {
    id: 'app-n05-form-validation',
    text: 'Forms with validations',
    description: 'Add validation to inputs',
    module: N05FormValidationComponent,
  },
  {
    id: 'app-n06-pipes',
    text: 'Filter with Pipes',
    description: 'Filter and transform data',
    module: N06PipesComponent,
  },
];
