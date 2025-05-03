import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignupPage from './component/(auth)/signup.jsx'
import LoginPage from './component/(auth)/login.jsx'
import DashboardPage from './component/dashboard.jsx'
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    {/* <SignupPage />
    <LoginPage />
    <DashboardPage/> */}
    </BrowserRouter>
)
