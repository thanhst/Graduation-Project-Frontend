import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMeetingComponent } from './user-meeting.component';

describe('UserMeetingComponent', () => {
  let component: UserMeetingComponent;
  let fixture: ComponentFixture<UserMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMeetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
