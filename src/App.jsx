import "./App.css"
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppMain from "./layout/AppMain";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 800,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function App() {
  return (
    <Box sx={{
      flexGrow: 1,
    }} style={{ backgroundColor: "#0c121e" }}  className="main-container">
      <Grid container spacing={2} theme={theme} style={{ paddingInline: 15 }}>
        <AppMain />
      </Grid>
    </Box >
  );
}

