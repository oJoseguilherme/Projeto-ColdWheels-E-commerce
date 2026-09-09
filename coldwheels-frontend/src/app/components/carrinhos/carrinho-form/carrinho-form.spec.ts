import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrinhoForm } from './carrinho-form';

describe('CarrinhoForm', () => {
  let component: CarrinhoForm;
  let fixture: ComponentFixture<CarrinhoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrinhoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
