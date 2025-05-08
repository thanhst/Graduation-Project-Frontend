import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRoomComponent } from './request-room.component';

describe('RequestRoomComponent', () => {
  let component: RequestRoomComponent;
  let fixture: ComponentFixture<RequestRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
