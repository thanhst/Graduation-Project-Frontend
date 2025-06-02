import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutMeetingComponent } from './base-layout-meeting.component';

describe('BaseLayoutMeetingComponent', () => {
  let component: BaseLayoutMeetingComponent;
  let fixture: ComponentFixture<BaseLayoutMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseLayoutMeetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseLayoutMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
