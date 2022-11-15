import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBunkerstockReportComponent } from './add-update-bunkerstock-report.component';

describe('AddUpdateBunkerstockReportComponent', () => {
  let component: AddUpdateBunkerstockReportComponent;
  let fixture: ComponentFixture<AddUpdateBunkerstockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBunkerstockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBunkerstockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
