import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { classroomResolver } from './classroom.resolver';

describe('classroomResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => classroomResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
