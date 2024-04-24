import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { todoGuard } from './todo.guard';

describe('todoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => todoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
