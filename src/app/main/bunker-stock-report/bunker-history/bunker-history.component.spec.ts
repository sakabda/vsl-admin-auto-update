import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BunkerHistoryComponent } from './bunker-history.component';

describe('BunkerHistoryComponent', () => {
  let component: BunkerHistoryComponent;
  let fixture: ComponentFixture<BunkerHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BunkerHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BunkerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
