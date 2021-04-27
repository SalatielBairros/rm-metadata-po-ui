import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoDinamicaComponent } from './visualizacao-dinamica.component';

describe('VisualizacaoDinamicaComponent', () => {
  let component: VisualizacaoDinamicaComponent;
  let fixture: ComponentFixture<VisualizacaoDinamicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizacaoDinamicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizacaoDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
