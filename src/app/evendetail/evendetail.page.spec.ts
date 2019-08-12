import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvendetailPage } from './evendetail.page';

describe('EvendetailPage', () => {
  let component: EvendetailPage;
  let fixture: ComponentFixture<EvendetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvendetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvendetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
