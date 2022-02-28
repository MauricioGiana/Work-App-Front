import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppRouter } from "./routers/AppRouter";
import theme from "./themeConfig";
import { ThemeProvider } from '@mui/material/styles';

export const App = () => {
  return (
    <ThemeProvider theme={theme} >
    <Provider store={store}>
      <AppRouter />
    </Provider>
    </ThemeProvider>
  );
};
