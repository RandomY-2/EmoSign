import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Start from './component/startPage/Start';
import Detection from './component/signDetection/detection';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Start />
        </Route>
        <Route exact path='/detection'>
          <Detection />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
