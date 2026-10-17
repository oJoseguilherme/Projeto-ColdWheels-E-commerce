import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PistaList } from './pista-list';

describe('PistaList', () => {
  let component: PistaList;
  let fixture: ComponentFixture<PistaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PistaList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PistaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
