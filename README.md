# ejflab-front-lib
Angular Front Library

How this repo was created:

ng new ejflab-front-lib --no-create-application
cd ejflab-front-lib
ng generate library ejflab-front-lib --skip-tests
ng generate application ejflab-front-base --skip-tests


ng build ejflab-front-lib && cd dist/ejflab-front-lib && npm publish


ng generate module views/assessment --project=ejflab-front-lib --skip-tests

ng generate component views/assessment/components/my-component --standalone false --project=ejflab-front-lib --skip-tests

ng generate module app --project=ejflab-front-base --skip-tests

ng generate component views/guides/views/n04-reactive-forms --standalone false --project=ejflab-front-base --skip-tests