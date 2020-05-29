import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import GlobalStyle from './styles/global';

ReactDOM.render(
  <>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    <GlobalStyle/>
  </>,
  document.getElementById('root')
);
