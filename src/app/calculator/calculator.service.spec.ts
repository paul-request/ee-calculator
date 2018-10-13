import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let calculatorService: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    calculatorService = TestBed.get(CalculatorService);
  });

  it('is created successfully', () => {
    expect(calculatorService).toBeTruthy();
  });

  describe('get calculator value', () => {
    describe('when next value equals \'C\'', () => {
      let value;

      beforeEach(() => {
        value = calculatorService.getCalulatorValue('C');
      });

      it('returns a reset value', () => {
        expect(value).toEqual({
          displayValue: '0',
          prevValue: null,
          operator: null,
          pendingOperator: false
        });
      });
    });

    describe('when next value equals \'.\'', () => {
      describe('and the value already contains a dot', () => {
        it('returns the existing calculator value', () => {
          calculatorService['_calculator'].next({
            displayValue: '33.0',
            prevValue: '33.',
            operator: null,
            pendingOperator: false
          });

          const value = calculatorService.getCalulatorValue('.');

          expect(value).toEqual({
            displayValue: '33.0',
            prevValue: '33.',
            operator: null,
            pendingOperator: false
          });
        });
      });

      describe('and there is a pending operator', () => {
        it('returns the existing calculator value', () => {
          calculatorService['_calculator'].next({
            displayValue: '100',
            prevValue: '10',
            operator: '+',
            pendingOperator: true
          });

          const value = calculatorService.getCalulatorValue('.');

          expect(value).toEqual({
            displayValue: '100',
            prevValue: '10',
            operator: '+',
            pendingOperator: true
          });
        });
      });

      describe('and no pending operator and value contains no dot', () => {
        it('appends the dot to the calulator display value', () => {
          calculatorService['_calculator'].next({
            displayValue: '100',
            prevValue: '10',
            operator: '+',
            pendingOperator: false
          });

          const value = calculatorService.getCalulatorValue('.');

          expect(value).toEqual({
            displayValue: '100.',
            prevValue: '10',
            operator: '+',
            pendingOperator: false
          });
        });
      });
    });

    describe('when next value is a number', () => {
      describe('and there is a pending operator', () => {
        let value;

        beforeEach(() => {
          calculatorService['_calculator'].next({
            displayValue: '99',
            prevValue: '10',
            operator: '+',
            pendingOperator: true
          });

          value = calculatorService.getCalulatorValue('5');
        });

        it('update the display value to the new value', () => {
          expect(value.displayValue).toBe('5');
        });

        it('resets the pending operator', () => {
          expect(value.pendingOperator).not.toBeTruthy();
        });
      });

      describe('and there is no pending offer', () => {
        it('updates the display value to the new value if it was 0', () => {
          calculatorService['_calculator'].next({
            displayValue: '0',
            prevValue: null,
            operator: null,
            pendingOperator: false
          });

          const value = calculatorService.getCalulatorValue('9');

          expect(value).toEqual({
            displayValue: '9',
            prevValue: null,
            operator: null,
            pendingOperator: false
          });
        });

        it('appends the value to the display value if it was not 0', () => {
          calculatorService['_calculator'].next({
            displayValue: '123',
            prevValue: null,
            operator: null,
            pendingOperator: false
          });

          const value = calculatorService.getCalulatorValue('4');

          expect(value).toEqual({
            displayValue: '1234',
            prevValue: null,
            operator: null,
            pendingOperator: false
          });
        });
      });
    });

    describe('when next value is an operator', () => {
      describe('and there is an existing operator and the calculation is pending an operator', () => {
        it('updates the operator with the next value', () => {
          calculatorService['_calculator'].next({
            displayValue: '246',
            prevValue: null,
            operator: '*',
            pendingOperator: true
          });

          const value = calculatorService.getCalulatorValue('+');

          expect(value).toEqual({
            displayValue: '246',
            prevValue: null,
            operator: '+',
            pendingOperator: true
          });
        });
      });

      describe('and there is not as previous value', () => {
        let value;

        beforeEach(() => {
          calculatorService['_calculator'].next({
            displayValue: '555',
            prevValue: null,
            operator: null,
            pendingOperator: false
          });

          value = calculatorService.getCalulatorValue('/');
        });

        it('sets the previous value to display value', () => {
          expect(value.prevValue).toBe('555');
        });

        it('sets the pending operator to true', () => {
          expect(value.pendingOperator).toBeTruthy();
        });

        it('sets the operator to the next value', () => {
          expect(value.operator).toBe('/');
        });
      });

      describe('and there is a previous value and an existing operator', () => {
        let value;

        beforeEach(() => {
          calculatorService['_calculator'].next({
            displayValue: '4',
            prevValue: '5',
            operator: '+',
            pendingOperator: false
          });

          value = calculatorService.getCalulatorValue('*');
        });

        it('sets the display value to the result of the calculation', () => {
          expect(value.displayValue).toBe('9');
        });

        it('sets the previous value to the result of the calculation', () => {
          expect(value.prevValue).toBe('9');
        });

        it('sets the pending operator to true', () => {
          expect(value.operator).toBe('*');
        });

        it('sets the operator to the next value', () => {
          expect(value.pendingOperator).toBeTruthy();
        });
      });
    });

    describe('when next value is not recognised', () => {
      it('returns the current calulcator config', () => {
        calculatorService['_calculator'].next({
          displayValue: '147',
          prevValue: '12',
          operator: '*',
          pendingOperator: false
        });

        const value = calculatorService.getCalulatorValue('x');

        expect(value).toEqual({
          displayValue: '147',
          prevValue: '12',
          operator: '*',
          pendingOperator: false
        });
      });
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      spyOn(calculatorService, 'getCalulatorValue').and.returnValue({
        displayValue: '111',
        prevValue: '2',
        operator: '/',
        pendingOperator: false
      });
      spyOn(calculatorService['_calculator'], 'next');
      calculatorService.execute('+');
    });

    it('gets the next calculator config value', () => {
      expect(calculatorService.getCalulatorValue).toHaveBeenCalled();
    });

    it('sets the next value of the calculator config', () => {
      expect(calculatorService['_calculator'].next).toHaveBeenCalledWith({
        displayValue: '111',
        prevValue: '2',
        operator: '/',
        pendingOperator: false
      });
    });
  });
});
