import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEventsReportComponent } from './add-update-events-report.component';

describe('AddUpdateEventsReportComponent', () => {
  let component: AddUpdateEventsReportComponent;
  let fixture: ComponentFixture<AddUpdateEventsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateEventsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateEventsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
