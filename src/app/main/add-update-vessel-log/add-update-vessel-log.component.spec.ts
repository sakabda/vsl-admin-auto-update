import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateVesselLogComponent } from './add-update-vessel-log.component';

describe('AddUpdateVesselLogComponent', () => {
  let component: AddUpdateVesselLogComponent;
  let fixture: ComponentFixture<AddUpdateVesselLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateVesselLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateVesselLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
