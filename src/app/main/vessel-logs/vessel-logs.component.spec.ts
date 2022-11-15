import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselLogsComponent } from './vessel-logs.component';

describe('VesselLogsComponent', () => {
  let component: VesselLogsComponent;
  let fixture: ComponentFixture<VesselLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VesselLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
