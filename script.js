
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Nice try! You can't divide by zero 😏";
  }
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return "Invalid operator";
  }
}

const display = document.querySelector("#display");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const decimalButton = document.querySelector("#decimal");
const backspaceButton = document.querySelector("#backspace");

let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value;
}

function roundResult(number) {
  return Math.round((number + Number.EPSILON) * 100000000) / 100000000;
}

function inputNumber(number) {
  if (shouldResetDisplay || display.textContent === "0") {
    updateDisplay(number);
    shouldResetDisplay = false;
  } else {
    updateDisplay(display.textContent + number);
  }
}

numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (display.textContent.includes("You can't divide")) {
      clearCalculator();
    }
    inputNumber(button.dataset.number);
  });
});

function clearCalculator() {
  firstNumber = null;
  secondNumber = null;
  currentOperator = null;
  shouldResetDisplay = false;
  updateDisplay("0");
}

clearButton.addEventListener("click", clearCalculator);

operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    const operator = button.dataset.operator;

    if (display.textContent.includes("You can't divide")) {
      return;
    }

    if (currentOperator !== null && !shouldResetDisplay) {
      calculate();
    }

    firstNumber = Number(display.textContent);
    currentOperator = operator;
    shouldResetDisplay = true;
  });
});

function calculate() {
  if (currentOperator === null || shouldResetDisplay) {
    return;
  }

  secondNumber = Number(display.textContent);

  const result = operate(currentOperator, firstNumber, secondNumber);

  if (typeof result === "string") {
    updateDisplay(result);
    firstNumber = null;
    currentOperator = null;
    shouldResetDisplay = true;
    return;
  }

  const roundedResult = roundResult(result);
  updateDisplay(roundedResult);

  firstNumber = roundedResult;
  currentOperator = null;
  shouldResetDisplay = true;
}

equalsButton.addEventListener("click", () => {
  calculate();
});

decimalButton.addEventListener("click", () => {
  if (shouldResetDisplay) {
    updateDisplay("0.");
    shouldResetDisplay = false;
  } else if (!display.textContent.includes(".")) {
    updateDisplay(display.textContent + ".");
  }
});

backspaceButton.addEventListener("click", () => {
  if (shouldResetDisplay || display.textContent.includes("You can't divide")) {
    return;
  }

  const value = display.textContent.slice(0, -1);
  updateDisplay(value === "" || value === "-" ? "0" : value);
});
