import React from 'react';
import { SchoolProvider } from './context/SchoolContext';
import { Layout } from './components/layout/Layout';

export function App() {
  return (
    <SchoolProvider>
      <Layout />
    </SchoolProvider>
  );
}

export default App;
