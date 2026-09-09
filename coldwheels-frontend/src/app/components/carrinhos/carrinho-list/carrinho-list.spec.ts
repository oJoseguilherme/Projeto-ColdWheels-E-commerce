import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrinhoList } from './carrinho-list';

describe('CarrinhoList', () => {
  let component: CarrinhoList;
  let fixture: ComponentFixture<CarrinhoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrinhoList],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
