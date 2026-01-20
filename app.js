const { useState } = React;

const operatorLabels = {
  "/": "÷",
  "*": "×",
  "-": "−",
  "+": "+",
};

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
      return;
    }

    setDisplay((prev) => (prev === "0" ? String(digit) : prev + digit));
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay((prev) => {
      if (prev === "0") {
        return prev;
      }
      return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
    });
  };

  const inputPercent = () => {
    setDisplay((prev) => {
      const value = parseFloat(prev);
      if (Number.isNaN(value)) {
        return "0";
      }
      return String(value / 100);
    });
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (storedValue == null) {
      setStoredValue(inputValue);
    } else if (operator) {
      const currentValue = storedValue || 0;
      let nextValue = currentValue;

      switch (operator) {
        case "/":
          nextValue = currentValue / inputValue;
          break;
        case "*":
          nextValue = currentValue * inputValue;
          break;
        case "+":
          nextValue = currentValue + inputValue;
          break;
        case "-":
          nextValue = currentValue - inputValue;
          break;
        default:
          break;
      }

      setStoredValue(nextValue);
      setDisplay(String(nextValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (operator == null || storedValue == null) {
      return;
    }
    performOperation(null);
  };

  const handleKey = (key) => {
    if (Number.isFinite(Number(key))) {
      inputDigit(key);
    } else if (key === ".") {
      inputDecimal();
    } else if (key === "Escape") {
      clearAll();
    } else if (["/", "*", "-", "+"].includes(key)) {
      performOperation(key);
    } else if (key === "Enter" || key === "=") {
      handleEquals();
    }
  };

  React.useEffect(() => {
    const onKeyDown = (event) => {
      handleKey(event.key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <div className="calculator-display" aria-live="polite">
        <div className="display-top">
          <span className="display-operator">
            {operator ? operatorLabels[operator] : ""}
          </span>
          <span className="display-value">{display}</span>
        </div>
        <p className="display-hint">Type on your keyboard or tap a button.</p>
      </div>
      <div className="calculator-grid">
        <button type="button" className="key key-muted" onClick={clearAll}>
          AC
        </button>
        <button type="button" className="key key-muted" onClick={toggleSign}>
          ±
        </button>
        <button type="button" className="key key-muted" onClick={inputPercent}>
          %
        </button>
        <button
          type="button"
          className="key key-operator"
          onClick={() => performOperation("/")}
        >
          ÷
        </button>

        <button type="button" className="key" onClick={() => inputDigit(7)}>
          7
        </button>
        <button type="button" className="key" onClick={() => inputDigit(8)}>
          8
        </button>
        <button type="button" className="key" onClick={() => inputDigit(9)}>
          9
        </button>
        <button
          type="button"
          className="key key-operator"
          onClick={() => performOperation("*")}
        >
          ×
        </button>

        <button type="button" className="key" onClick={() => inputDigit(4)}>
          4
        </button>
        <button type="button" className="key" onClick={() => inputDigit(5)}>
          5
        </button>
        <button type="button" className="key" onClick={() => inputDigit(6)}>
          6
        </button>
        <button
          type="button"
          className="key key-operator"
          onClick={() => performOperation("-")}
        >
          −
        </button>

        <button type="button" className="key" onClick={() => inputDigit(1)}>
          1
        </button>
        <button type="button" className="key" onClick={() => inputDigit(2)}>
          2
        </button>
        <button type="button" className="key" onClick={() => inputDigit(3)}>
          3
        </button>
        <button
          type="button"
          className="key key-operator"
          onClick={() => performOperation("+")}
        >
          +
        </button>

        <button type="button" className="key key-wide" onClick={() => inputDigit(0)}>
          0
        </button>
        <button type="button" className="key" onClick={inputDecimal}>
          .
        </button>
        <button type="button" className="key key-equals" onClick={handleEquals}>
          =
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);
