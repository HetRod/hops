import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletarPage } from './completar.page';

describe('CompletarPage', () => {
  let component: CompletarPage;
  let fixture: ComponentFixture<CompletarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
