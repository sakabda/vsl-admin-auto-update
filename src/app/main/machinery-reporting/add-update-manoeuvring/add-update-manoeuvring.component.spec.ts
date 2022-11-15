import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateManoeuvringComponent } from './add-update-manoeuvring.component';

describe('AddUpdateManoeuvringComponent', () => {
  let component: AddUpdateManoeuvringComponent;
  let fixture: ComponentFixture<AddUpdateManoeuvringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateManoeuvringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateManoeuvringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
