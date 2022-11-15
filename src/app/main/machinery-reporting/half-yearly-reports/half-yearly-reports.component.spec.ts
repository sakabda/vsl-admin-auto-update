import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfYearlyReportsComponent } from './half-yearly-reports.component';

describe('HalfYearlyReportsComponent', () => {
  let component: HalfYearlyReportsComponent;
  let fixture: ComponentFixture<HalfYearlyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalfYearlyReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfYearlyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
