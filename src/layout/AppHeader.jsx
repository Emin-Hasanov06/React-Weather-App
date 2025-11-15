import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const headerStyle = {
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 15
}

const CssTextField = styled(TextField)({
  '& label': {
    color: '#a3a3a3ff',
  },
  '& label.Mui-focused': {
    color: '#a3a3a3ff',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#28364bff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#28364bff',
    },
    '&:hover fieldset': {
      borderColor: '#28364bff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#28364bff',
    },
    '& input::placeholder': {
      color: 'red',
      opacity: 1,
    },
    '& input': {
      color: '#fff',
    },
  },
});

const submitBtn = {
  padding: "0 10px",
  width: 70,
  border: "none",
  borderRadius: 10,
  backgroundColor: "#28364bff",
  cursor: "pointer",
  color: "white",
}

export default function AppHeader({ onSubmitCity }) {
  const [input, setInput] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() === "") return;
    onSubmitCity(input)
    setInput("")
  }

  return (
    <Grid size={{ xs: 6, md: 12 }} style={headerStyle}>
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '50vw' } }}
        noValidate
        autoComplete="off"
        style={{ display: "flex" }}
        onSubmit={handleSubmit}
      >
        <CssTextField onChange={(e) => setInput(e.target.value)} value={input} label="Поиск города..." id="custom-css-outlined-input" size="small" sx={{ sm: 12 }} />
        <button style={submitBtn}>Найти</button>
      </Box>
    </Grid>
  )
}