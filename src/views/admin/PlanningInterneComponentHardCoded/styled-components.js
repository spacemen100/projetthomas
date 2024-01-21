require("styled-components");

const { Theme } = require("./styles");

// Extend the DefaultTheme interface in styled-components
require("styled-components").DefaultTheme = Theme;
