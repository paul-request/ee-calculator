import { Component, OnInit, Input } from '@angular/core';
import { CalculatorConfig } from '../calculator.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  @Input() calculator: CalculatorConfig;

  constructor() { }

  ngOnInit() {
  }

}
