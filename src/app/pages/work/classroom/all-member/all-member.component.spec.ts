import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMemberComponent } from './all-member.component';

describe('AllMemberComponent', () => {
  let component: AllMemberComponent;
  let fixture: ComponentFixture<AllMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
