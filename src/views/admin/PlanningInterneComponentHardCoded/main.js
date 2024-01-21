const React = require("react");
const ReactDOM = require("react-dom");
const App = require("./App");
const { GlobalStyle } = require("./styles");

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(GlobalStyle, null),
    React.createElement(App, null)
  )
);
