import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnuallyReportsComponent } from './annually-reports.component';

describe('AnnuallyReportsComponent', () => {
  let component: AnnuallyReportsComponent;
  let fixture: ComponentFixture<AnnuallyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnuallyReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnuallyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
