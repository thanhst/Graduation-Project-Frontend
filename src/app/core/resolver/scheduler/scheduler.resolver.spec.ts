import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { schedulerResolver } from './scheduler.resolver';

describe('schedulerResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => schedulerResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
