import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineReportsComponent } from './engine-reports.component';

describe('EngineReportsComponent', () => {
  let component: EngineReportsComponent;
  let fixture: ComponentFixture<EngineReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
