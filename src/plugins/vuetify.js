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
    teal: "#63BAC0",
    blue: "#196CA2",
    darkblue: "#032F45",
    fireRed: "#FF0000",
    fireOrange: "#FF6A00",
    fireYellow: "#FFC107",
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
