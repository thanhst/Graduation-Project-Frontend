import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingHomeComponent } from './meeting-home.component';

describe('MeetingHomeComponent', () => {
  let component: MeetingHomeComponent;
  let fixture: ComponentFixture<MeetingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
