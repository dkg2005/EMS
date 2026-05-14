// Unit tests for DepartmentComponent. These specs ensure the component can be
// created and are a good starting point for testing behavior as you add features.
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentComponent } from './department.component';

describe('DepartmentComponent', () => {
  let component: DepartmentComponent;
  let fixture: ComponentFixture<DepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
