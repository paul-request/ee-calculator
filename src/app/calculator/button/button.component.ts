import { Component, OnInit, Input } from '@angular/core';
import { CalculatorService } from '../../calculator/calculator.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() value: string;
  @Input() type: string;
  @Input() display: string;
  @Input() name: string;

  constructor(
    private calculatorService: CalculatorService
  ) { }

  ngOnInit() {
  }

  isAction(): boolean {
    return this.type === 'action';
  }

  isOperator(): boolean {
    return this.type === 'operator';
  }

  handleClick() {
    this.calculatorService.execute(this.value);
  }

}
