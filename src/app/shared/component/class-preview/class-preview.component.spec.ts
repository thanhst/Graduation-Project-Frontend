import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPreviewComponent } from './class-preview.component';

describe('ClassPreviewComponent', () => {
  let component: ClassPreviewComponent;
  let fixture: ComponentFixture<ClassPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
