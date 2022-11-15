import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScavengerReportComponent } from './scavenger-report.component';

describe('ScavengerReportComponent', () => {
  let component: ScavengerReportComponent;
  let fixture: ComponentFixture<ScavengerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScavengerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScavengerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
