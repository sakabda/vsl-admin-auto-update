import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBunkeringReportComponent } from './add-update-bunkering-report.component';

describe('AddUpdateBunkeringReportComponent', () => {
  let component: AddUpdateBunkeringReportComponent;
  let fixture: ComponentFixture<AddUpdateBunkeringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBunkeringReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBunkeringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
