import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatisticalComponent } from './view-statistical.component';

describe('ViewStatisticalComponent', () => {
  let component: ViewStatisticalComponent;
  let fixture: ComponentFixture<ViewStatisticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStatisticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
