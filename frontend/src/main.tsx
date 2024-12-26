import { createTheme, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './home/Home.tsx'
import './index.css'
import Login from './login/Login.tsx'
import Cadastro from './register/Register.tsx'

const theme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        style: {
          padding: '0px',
        }
      }
    },
    MuiDivider: {
      defaultProps: {
        style: {
          fontSize: '5px'
        }
      }
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Cadastro />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
