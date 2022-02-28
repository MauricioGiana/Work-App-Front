import { createTheme } from "@mui/material";

const themeConfig = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: 'unset' } },
        },
    },
});

export default themeConfig;

