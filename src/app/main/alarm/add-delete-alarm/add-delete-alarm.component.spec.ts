import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeleteAlarmComponent } from './add-delete-alarm.component';

describe('AddDeleteAlarmComponent', () => {
  let component: AddDeleteAlarmComponent;
  let fixture: ComponentFixture<AddDeleteAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeleteAlarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeleteAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
