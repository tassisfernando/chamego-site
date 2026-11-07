import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import { useUiStore } from './store/useUiStore'

const queryClient = new QueryClient()

export function AppProviders() {
  const isDarkMode = useUiStore((state) => state.isDarkMode)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#7c3aed',
          },
        },
      }),
    [isDarkMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
