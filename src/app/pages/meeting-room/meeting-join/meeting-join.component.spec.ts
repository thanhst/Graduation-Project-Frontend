import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingJoinComponent } from './meeting-join.component';

describe('MeetingJoinComponent', () => {
  let component: MeetingJoinComponent;
  let fixture: ComponentFixture<MeetingJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingJoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
