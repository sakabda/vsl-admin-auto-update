import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateExtraordinaryReportComponent } from './add-update-extraordinary-report.component';

describe('AddUpdateExtraordinaryReportComponent', () => {
  let component: AddUpdateExtraordinaryReportComponent;
  let fixture: ComponentFixture<AddUpdateExtraordinaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateExtraordinaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateExtraordinaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
