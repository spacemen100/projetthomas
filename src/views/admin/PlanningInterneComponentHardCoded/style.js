const { normalize } = require("styled-normalize");
const styled = require("styled-components").default;
const { createGlobalStyle } = require("styled-components");

const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

const ColorType = [
  "black",
  "grey400",
  "grey600",
  "blue900",
  "blue100",
  "blue300",
  "blue400",
  "blue200",
  "red400",
  "white"
];

const Theme = {
  colors: {
    black: "#1C222F",
    grey400: "#D2D2D2",
    grey600: "#777777",
    blue900: "#3B3C5F",
    blue100: "#F8F8FD",
    blue300: "#C9E5FF",
    blue400: "#0A11EB",
    blue200: "#E6F3FF",
    red400: "#EF4444",
    white: "#FFFFFF"
  },
  navHeight: "44px"
};

const marginPaddingReset = `
margin: 0;
padding: 0;
`;

const truncate = `
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
`;

const StyledSchedulerFrame = styled.div`
  margin: 10rem 10rem;
  position: relative;
  width: 40vw;
  height: 40vh;
`;

module.exports = {
  GlobalStyle,
  ColorType,
  Theme,
  marginPaddingReset,
  truncate,
  StyledSchedulerFrame
};
