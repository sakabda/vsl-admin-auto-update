import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobReportComponent } from './rob-report.component';

describe('RobReportComponent', () => {
  let component: RobReportComponent;
  let fixture: ComponentFixture<RobReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RobReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
