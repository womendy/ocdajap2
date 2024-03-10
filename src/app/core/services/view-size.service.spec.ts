import { TestBed } from '@angular/core/testing';

import { ViewSizeService } from './view-size.service';

describe('ViewSizeService', () => {
  let service: ViewSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
