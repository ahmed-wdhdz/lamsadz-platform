import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/components.css'
import './styles/animations.css'

import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary loading
    },
  },
});

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id_for_dev';
console.log("VITE_GOOGLE_CLIENT_ID is:", clientId);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <LanguageProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
