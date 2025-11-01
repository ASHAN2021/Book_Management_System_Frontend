'use client';

import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ApolloProvider } from '@apollo/client/react';
import { initializeApollo } from '@/lib/apolloClient';
import Layout from '@/components/Layout';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={initializeApollo()}>
              <Layout>{children}</Layout>
            </ApolloProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}