import React from "react";
import ReactDOM from "react-dom";
import NumberButton from "./NumberButton";
import { doAddition } from "./MathOperators";
import { doSubtraction } from "./MathOperators";
import { doMultiplication } from "./MathOperators";
import { doDivision } from "./MathOperators";

import "./styles.css";

const NUMBERS = [
  { val: 7, symbol: "7", id: "seven" },
  { val: 8, symbol: "8", id: "eight" },
  { val: 9, symbol: "9", id: "nine" },
  { val: 4, symbol: "4", id: "four" },
  { val: 5, symbol: "5", id: "five" },
  { val: 6, symbol: "6", id: "six" },
  { val: 1, symbol: "1", id: "one" },
  { val: 2, symbol: "2", id: "two" },
  { val: 3, symbol: "3", id: "three" },
  { val: 0, symbol: "0", id: "zero" }
];

const OPERATORS = {
  add: { symbol: "+", operation: "addition" },
  subtract: { symbol: "-", operation: "subtraction" },
  multiply: { symbol: "*", operation: "multiplication" },
  divide: { symbol: "/", operation: "division" },
  equals: { symbol: "=", operation: "equal" },
  decimal: { symbol: ".", operation: "decimate" },
  clear: { symbol: "C", operation: "clear" }
};

const OperatorButton = ({ operKey, operVal, onClick }) => (
  <button id={operKey} onClick={onClick} className="operator">
    {operVal}
  </button>
);

class JavaScriptCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "0",
      total: 0,
      currentOperation: null,
      decimaled: false,
      decimalPlace: 1,
      oldNum: 0,
      newNum: 0
    };
    this.concatNumbers = this.concatNumbers.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.executeOperations = this.executeOperations.bind(this);
  }

  concatNumbers(buttonObj) {
    if (this.state.decimaled) {
      let decSpots = Math.pow(10, this.state.decimalPlace);
      this.setState({ total: this.state.total + buttonObj.val / decSpots });
      this.updateDisplay(this.state.display + buttonObj.symbol);
      this.setState({ decimalPlace: this.state.decimalPlace + 1 });
    } else {
      if (this.state.currentOperation === "justEqualed") {
        this.updateDisplay(buttonObj.symbol);
        this.updateTotal(buttonObj.val);
        this.setState({ decimaled: false });
        this.setState({ decimalPlace: 1 });
      } else {
        if (this.state.total !== 0) {
          const newTotal = this.state.total * 10 + buttonObj.val;
          this.updateTotal(newTotal);
          this.updateDisplay(this.state.display + buttonObj.symbol);
        } else {
          this.updateTotal(buttonObj.val);
          if (this.state.display !== "0") {
            this.updateDisplay(this.state.display + buttonObj.symbol);
          } else {
            this.updateDisplay(buttonObj.symbol);
          }
        }
      }
    }
  }

  handleOperator(e) {
    let btnId = e.target.id;
    switch (btnId) {
      case "clear":
        this.updateDisplay("0");
        this.updateTotal(0);
        this.setState({ currentOperation: null });
        this.setState({ decimaled: false });
        this.setState({ decimalPlace: 1 });
        this.setState({ oldNum: 0 });
        this.setState({ newNum: 0 });
        break;
      case "decimal":
        if (this.state.decimaled === false) {
          this.updateDisplay(this.state.display + OPERATORS[btnId].symbol);
          this.setState({ decimaled: true });
        }
        break;
      case "equals":
        if (this.state.currentOperation !== "justEqualed") {
          const newResult = this.executeOperations();
          this.setState({ currentOperation: "justEqualed" });
          this.setState({ oldNum: newResult });
          this.updateDisplay(newResult);
          this.updateTotal(0);
        }
        break;
      default:
        if (this.state.currentOperation === null) {
          this.setState({ oldNum: this.state.total });
          this.updateTotal(0);
          this.updateDisplay(this.state.display + OPERATORS[btnId].symbol);
          this.setState({ currentOperation: OPERATORS[btnId].operation });
          this.setState({ decimaled: false });
          this.setState({ decimalPlace: 1 });
        } else if (this.state.currentOperation === "justEqualed") {
          this.setState({ currentOperation: OPERATORS[btnId].operation });
          this.updateDisplay(this.state.display + OPERATORS[btnId].symbol);
        } else {
          let newDisplay = this.state.display.toString();
          this.setState({ decimaled: false });
          this.setState({ decimalPlace: 1 });
          if (
            newDisplay.endsWith("+") ||
            newDisplay.endsWith("-") ||
            newDisplay.endsWith("/") ||
            newDisplay.endsWith("*")
          ) {
            this.updateDisplay(
              newDisplay.replace(/[+\-*/]$/, OPERATORS[btnId].symbol)
            );
            this.setState({ currentOperation: OPERATORS[btnId].operation });
          } else {
            let newResult = this.executeOperations();
            this.updateDisplay(newDisplay + OPERATORS[btnId].symbol);
            this.setState({ oldNum: newResult });
            this.setState({ newNum: 0 });
            this.updateTotal(0);
            this.setState({ currentOperation: OPERATORS[btnId].operation });
          }
        }
        break;
    }
  }

  executeOperations() {
    this.setState({ decimaled: false });
    this.setState({ decimalPlace: 1 });
    switch (this.state.currentOperation) {
      case "addition":
        const addResult = doAddition(this.state.oldNum, this.state.total);
        this.setState({
          newNum: addResult
        });
        return addResult;
      case "subtraction":
        const subResult = doSubtraction(this.state.oldNum, this.state.total);
        this.setState({
          newNum: subResult
        });
        return subResult;
      case "multiplication":
        const multResult = doMultiplication(
          this.state.oldNum,
          this.state.total
        );
        this.setState({
          newNum: multResult
        });
        return multResult;
      case "division":
        const divResult = doDivision(this.state.oldNum, this.state.total);
        this.setState({
          newNum: divResult
        });
        return divResult;
      default:
        break;
    }
  }

  updateDisplay(dispStr) {
    this.setState({ display: dispStr });
  }

  updateTotal(numTotal) {
    this.setState({ total: numTotal });
  }

  render() {
    return (
      <div id="main" className="container">
        <div id="display">{this.state.display}</div>
        <span id="numPad">
          {NUMBERS.map(num => (
            <NumberButton
              numObj={num}
              onClick={() => this.concatNumbers(num)}
            />
          ))}
        </span>
        <span id="operPad">
          {Object.keys(OPERATORS).map(keyName => (
            <OperatorButton
              operKey={keyName}
              operVal={OPERATORS[keyName].symbol}
              onClick={e => this.handleOperator(e)}
            />
          ))}
        </span>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<JavaScriptCalculator />, rootElement);
