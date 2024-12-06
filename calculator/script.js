class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.isScientific = false;
        this.isRadians = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    sin() {
        const value = this.isRadians ? parseFloat(this.currentOperand) : (parseFloat(this.currentOperand) * Math.PI / 180);
        this.currentOperand = this.formatResult(Math.sin(value));
        this.updateDisplay();
    }

    cos() {
        const value = this.isRadians ? parseFloat(this.currentOperand) : (parseFloat(this.currentOperand) * Math.PI / 180);
        this.currentOperand = this.formatResult(Math.cos(value));
        this.updateDisplay();
    }

    tan() {
        const value = this.isRadians ? parseFloat(this.currentOperand) : (parseFloat(this.currentOperand) * Math.PI / 180);
        this.currentOperand = this.formatResult(Math.tan(value));
        this.updateDisplay();
    }

    log() {
        const value = parseFloat(this.currentOperand);
        if (value <= 0) {
            alert("Cannot calculate logarithm of zero or negative numbers!");
            return;
        }
        this.currentOperand = this.formatResult(Math.log10(value));
        this.updateDisplay();
    }

    ln() {
        const value = parseFloat(this.currentOperand);
        if (value <= 0) {
            alert("Cannot calculate natural logarithm of zero or negative numbers!");
            return;
        }
        this.currentOperand = this.formatResult(Math.log(value));
        this.updateDisplay();
    }

    sqrt() {
        const value = parseFloat(this.currentOperand);
        if (value < 0) {
            alert("Cannot calculate square root of negative numbers!");
            return;
        }
        this.currentOperand = this.formatResult(Math.sqrt(value));
        this.updateDisplay();
    }

    pow() {
        const value = parseFloat(this.currentOperand);
        this.currentOperand = this.formatResult(Math.pow(value, 2));
        this.updateDisplay();
    }

    pi() {
        this.currentOperand = Math.PI.toString();
        this.updateDisplay();
    }

    e() {
        this.currentOperand = Math.E.toString();
        this.updateDisplay();
    }

    fact() {
        const num = parseInt(this.currentOperand);
        if (num < 0) {
            alert("Cannot calculate factorial of negative numbers!");
            return;
        }
        if (num > 170) {
            alert("Number too large for factorial calculation!");
            return;
        }
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        this.currentOperand = this.formatResult(result);
        this.updateDisplay();
    }

    exp() {
        this.currentOperand += 'e+';
        this.updateDisplay();
    }

    toggleRad() {
        this.isRadians = !this.isRadians;
        const radButton = document.querySelector('[data-scientific="rad"]');
        radButton.textContent = this.isRadians ? 'DEG' : 'RAD';
    }

    formatResult(number) {
        if (number > 1e16 || number < -1e16) {
            return number.toExponential(10);
        }
        return Math.round(number * 1e10) / 1e10;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en');
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Add event listeners for basic operations
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
    });
});

document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.textContent);
    });
});

document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    calculator.compute();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
    }
    if (e.key === '*') {
        calculator.chooseOperation('×');
    }
    if (e.key === '/') {
        calculator.chooseOperation('÷');
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
    }
    if (e.key === 'Escape') {
        calculator.clear();
    }
});

// Add scientific mode toggle
const modeToggle = document.querySelector('.mode-toggle');
const calculatorElement = document.querySelector('.calculator');

modeToggle.addEventListener('click', () => {
    calculator.isScientific = !calculator.isScientific;
    calculatorElement.classList.toggle('scientific');
    modeToggle.textContent = calculator.isScientific ? 'Switch to Basic' : 'Switch to Scientific';
});

// Add scientific button listeners
document.querySelectorAll('[data-scientific]').forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.getAttribute('data-scientific');
        switch (operation) {
            case 'sin':
                calculator.sin();
                break;
            case 'cos':
                calculator.cos();
                break;
            case 'tan':
                calculator.tan();
                break;
            case 'log':
                calculator.log();
                break;
            case 'ln':
                calculator.ln();
                break;
            case 'sqrt':
                calculator.sqrt();
                break;
            case 'pow':
                calculator.pow();
                break;
            case 'pi':
                calculator.pi();
                break;
            case 'e':
                calculator.e();
                break;
            case 'fact':
                calculator.fact();
                break;
            case 'exp':
                calculator.exp();
                break;
            case 'rad':
                calculator.toggleRad();
                break;
        }
    });
});
