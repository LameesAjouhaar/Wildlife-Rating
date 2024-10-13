// src/App.tsx
import React from 'react';
import AnimalList from './components/AnimalList';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wildlife Rating</h1>
      <AnimalList />
    </div>
  );
};

export default App;
