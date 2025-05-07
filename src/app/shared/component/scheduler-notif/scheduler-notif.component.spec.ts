import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerNotifComponent } from './scheduler-notif.component';

describe('SchedulerNotifComponent', () => {
  let component: SchedulerNotifComponent;
  let fixture: ComponentFixture<SchedulerNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerNotifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulerNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
