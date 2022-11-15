import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BunkeringReportsComponent } from './bunkering-reports.component';

describe('BunkeringReportsComponent', () => {
  let component: BunkeringReportsComponent;
  let fixture: ComponentFixture<BunkeringReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BunkeringReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BunkeringReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
