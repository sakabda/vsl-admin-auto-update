import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEngPerformanceReportsComponent } from './main-eng-performance-reports.component';

describe('MainEngPerformanceReportsComponent', () => {
  let component: MainEngPerformanceReportsComponent;
  let fixture: ComponentFixture<MainEngPerformanceReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainEngPerformanceReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEngPerformanceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
