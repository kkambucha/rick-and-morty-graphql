import React from 'react';

import {Search} from './components/Search/Search';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
          <Search />
      </header>
    </div>
  );
}

export default App;
