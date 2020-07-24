import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import store from './store'
import Main from './pages/main'
import Routes from './routes'

function App() {
  return (

    <Provider store={store}>
      <div className="App">
        <Routes/>
      </div>
    </Provider>


  );
}

export default App;
