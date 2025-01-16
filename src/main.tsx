import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <CurrencyProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CurrencyProvider>
  </ThemeProvider>
);
