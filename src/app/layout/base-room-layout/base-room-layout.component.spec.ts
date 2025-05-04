import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRoomLayoutComponent } from './base-room-layout.component';

describe('BaseRoomLayoutComponent', () => {
  let component: BaseRoomLayoutComponent;
  let fixture: ComponentFixture<BaseRoomLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseRoomLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseRoomLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
