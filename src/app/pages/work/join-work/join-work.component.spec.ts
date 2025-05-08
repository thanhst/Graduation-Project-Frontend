import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinWorkComponent } from './join-work.component';

describe('JoinWorkComponent', () => {
  let component: JoinWorkComponent;
  let fixture: ComponentFixture<JoinWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
