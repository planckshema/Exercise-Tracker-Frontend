/**
 * Vuetify3 Plugin
 */
import { createVuetify } from "vuetify";

// Misc
import { loadFonts } from "./webfontloader";
loadFonts();

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: "#FF4500", //flame orange
    secondary: "#FFD700", //golden yellow
    accent: "#FF6347", //tomato red
    success: "#FF8C00", // dark orange
    error: "#EE5044",
    goldenRod: "#DAA520",
    deepRed: "#B22222",
    fireRed: "#FF0000",
    fireOrange: "#FF6A00",
    mahogany: "#C04000",
    darkBrownCharcoal:"#2B1B17",
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

export default vuetify;
