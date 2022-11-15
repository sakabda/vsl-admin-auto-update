import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEngineReportComponent } from './add-update-engine-report.component';

describe('AddUpdateEngineReportComponent', () => {
  let component: AddUpdateEngineReportComponent;
  let fixture: ComponentFixture<AddUpdateEngineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateEngineReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateEngineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
