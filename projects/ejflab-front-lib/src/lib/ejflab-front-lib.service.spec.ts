import { TestBed } from '@angular/core/testing';

import { EjflabFrontLibService } from './ejflab-front-lib.service';

describe('EjflabFrontLibService', () => {
  let service: EjflabFrontLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjflabFrontLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
