import React from 'react';
import Header from '../../components/Header'
import DocumentValidator  from '../../components/DocumentValidator'

function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
      </header>
      <body>
        <DocumentValidator/>
      </body>
    </div>
  )
}

export default Main