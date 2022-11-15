import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRobReportComponent } from './add-update-rob-report.component';

describe('AddUpdateRobReportComponent', () => {
  let component: AddUpdateRobReportComponent;
  let fixture: ComponentFixture<AddUpdateRobReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateRobReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRobReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
