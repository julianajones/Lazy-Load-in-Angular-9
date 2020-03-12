import {Component, Input, NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'test-card',
  template: '<h1>Hello {{name}}</h1>'
})
export class TestCardComponent implements OnInit {

  @Input() name: string = 'Juliana';

  ngOnInit(): void {

  }

}

@NgModule({
  declarations: [TestCardComponent],
  imports: [CommonModule]
})
class TestCardModule {
}