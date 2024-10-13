import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjflabFrontLibComponent } from './ejflab-front-lib.component';

describe('EjflabFrontLibComponent', () => {
  let component: EjflabFrontLibComponent;
  let fixture: ComponentFixture<EjflabFrontLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjflabFrontLibComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjflabFrontLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
