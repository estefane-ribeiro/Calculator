export default class Calculator {
  constructor(operation, result, btns) {
    this.operation = document.querySelector(operation);
    this.result = document.querySelector(result);
    this.buttons = document.querySelectorAll(btns);
    this.showOperation = this.showOperation.bind(this);
    this.clearOperation = this.clearOperation.bind(this);
    this.resultOperation = this.resultOperation.bind(this);
    this.backspace = this.backspace.bind(this);
    this.calculation = [];
  }

  showOperation(button) {
    this.result.innerText = "";
    this.calculation.push(button);
    this.operation.textContent = this.calculation.join("");
  }

  clearOperation() {
    this.operation.innerText = "";
  }

  backspace() {
    this.calculation.pop();
    this.operation.textContent = this.calculation.join("");
  }

  tokenization() {
    const expression = this.calculation
      .join("")
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/,/g, ".")
      .trim();
    const regex = /\d+(?:[.,]\d+)?|[+\-*/]/g;
    this.expression = expression.match(regex);
  }

  precedence() {
    const expression = [...this.expression];
    let expression_length = expression.length;

    for (let i = 0; i < expression_length; i++) {
      let value = 0;
      if (expression[i] == "*" || expression[i] == "/") {
        if (expression[i] == "/") {
          if (expression[i + 1] == 0) {
            this.result_expression =
              "Não é possível dividir um número por zero.";
            return this.result_expression;
          }
        }
        value = this.operator(
          expression[i],
          expression[i - 1],
          expression[i + 1],
        );
        expression[i - 1] = value;
        expression.splice(i, 2);

        i = i - 1;
      }
    }

    expression_length = expression.length;
    for (let i = 0; i < expression_length; i++) {
      let value = 0;
      if (expression[i] == "+" || expression[i] == "-") {
        value = this.operator(
          expression[i],
          expression[i - 1],
          expression[i + 1],
        );
        expression[i - 1] = value;
        expression.splice(i, 2);

        i = i - 1;
      }
    }

    let numero = expression[0];
    if (numero.toString().split(".")[1]?.length > 12) {
      this.result_expression = numero.toFixed(12);
    } else {
      this.result_expression = numero;
    }
  }

  resultOperation() {
    this.tokenization();
    this.precedence();
    this.result.innerText = this.result_expression;
    this.calculation = [];
    this.clearOperation();
  }

  operator(operador, n1, n2) {
    switch (operador) {
      case "+":
        return this.sum(n1, n2);
        break;
      case "-":
        return this.subtraction(n1, n2);
        break;
      case "*":
        return this.multiplication(n1, n2);
        break;
      case "/":
        return this.division(n1, n2);
        break;
      default:
        break;
    }
  }

  sum(n1, n2) {
    return Number(n1) + Number(n2);
  }

  subtraction(n1, n2) {
    return Number(n1) - Number(n2);
  }

  multiplication(n1, n2) {
    return Number(n1) * Number(n2);
  }

  division(n1, n2) {
    return Number(n1) / Number(n2);
  }

  addButtonsEvents() {
    this.buttons.forEach((button) => {
      if (button.classList.contains("clear")) {
        button.addEventListener("click", this.clearOperation);
      } else if (button.classList.contains("btn-equal")) {
        button.addEventListener("click", this.resultOperation);
      } else if (button.classList.contains("backspace")) {
        button.addEventListener("click", this.backspace);
      } else {
        button.addEventListener("click", () => {
          this.showOperation(button.textContent);
        });
      }
    });
  }

  init() {
    this.addButtonsEvents();
    return this;
  }
}
