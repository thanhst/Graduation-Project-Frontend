import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchedulerUserComponent } from './list-scheduler-user.component';

describe('ListSchedulerUserComponent', () => {
  let component: ListSchedulerUserComponent;
  let fixture: ComponentFixture<ListSchedulerUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSchedulerUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSchedulerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
