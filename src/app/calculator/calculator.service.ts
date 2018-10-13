import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface CalculatorConfig {
  displayValue: string;
  prevValue: string;
  operator: string;
  pendingOperator: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private operations = {
    '*': (current, next) => current * next,
    '-': (current, next) => current - next,
    '/': (current, next) => current / next,
    '+': (current, next) => current + next,
    '=': (current, next) => next
  };
  private _calculator = new BehaviorSubject<CalculatorConfig>({
    displayValue: '0',
    prevValue: null,
    operator: null,
    pendingOperator: false
  });

  constructor() { }

  get calculator(): Observable<CalculatorConfig> {
    return this._calculator.asObservable();
  }

  getCalulatorValue(value: string): CalculatorConfig {
    const isNumber = !isNaN(parseInt(value, 10));
    const isOperator = !!Object.keys(this.operations).filter((op) => op === value).length;
    const { displayValue, operator, prevValue, pendingOperator } = this._calculator.getValue();

    if (value === 'C') {
      return {
        displayValue: '0',
        prevValue: null,
        operator: null,
        pendingOperator: false
      };
    }

    if (value === '.') {
      if (pendingOperator || displayValue.includes('.')) { return this._calculator.getValue(); }

      return {
        ...this._calculator.getValue(),
        displayValue: `${displayValue}${value}`
      };
    }

    if (isNumber) {
      if (pendingOperator) {
        return {
          ...this._calculator.getValue(),
          displayValue: `${value}`,
          pendingOperator: false
        };
      }

      return {
        ...this._calculator.getValue(),
        displayValue: displayValue === '0' ? `${value}` : `${displayValue}${value}`
      };
    }

    if (isOperator) {
      if (operator && pendingOperator)  {
        return {
          ...this._calculator.getValue(),
          operator: `${value}`
        };
      }

      if (!prevValue) {
        return {
          ...this._calculator.getValue(),
          prevValue: `${displayValue}`,
          pendingOperator: true,
          operator: `${value}`
        };
      }

      if (prevValue && operator) {
        const result = this.operations[operator](
          parseFloat(prevValue || '0'), parseFloat(displayValue));

        return {
          ...this._calculator.getValue(),
          displayValue: `${result}`,
          prevValue: `${result}`,
          pendingOperator: true,
          operator: value
        };
      }
    }

    return this._calculator.getValue();
  }

  execute(nextValue: string) {
    const calculatorConfig = this.getCalulatorValue(nextValue);

    this._calculator.next(calculatorConfig);
  }
}
