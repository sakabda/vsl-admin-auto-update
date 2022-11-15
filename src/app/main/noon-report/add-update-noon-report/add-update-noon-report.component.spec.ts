import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateNoonReportComponent } from './add-update-noon-report.component';

describe('AddUpdateNoonReportComponent', () => {
  let component: AddUpdateNoonReportComponent;
  let fixture: ComponentFixture<AddUpdateNoonReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateNoonReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateNoonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
