import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
