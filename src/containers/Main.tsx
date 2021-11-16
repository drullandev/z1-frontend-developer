import React from 'react';
import ComponentSheet  from '../components/ComponentSheet'

function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to my test! ;)</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Keep calm, I'm now refreshing my React Knowledge! ;)
        </a>
      </header>
      <div>
        <ComponentSheet/>
      </div>
    </div>
  );
}

export default Main