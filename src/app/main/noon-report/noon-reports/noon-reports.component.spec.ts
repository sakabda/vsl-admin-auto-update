import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoonReportsComponent } from './noon-reports.component';

describe('NoonReportsComponent', () => {
  let component: NoonReportsComponent;
  let fixture: ComponentFixture<NoonReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoonReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoonReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
