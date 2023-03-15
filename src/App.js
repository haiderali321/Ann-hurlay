// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Navigator from './navigation/index'
// import { Provider } from 'redux';
// import store from './store/store/index';

const Routes = ({ match }) => (
  <Router>

    <Route exact path="/">
      <Navigator />
    </Route>

  </Router>
);

export default Routes;

