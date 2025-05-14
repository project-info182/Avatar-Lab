import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import TemplateSelect from './TemplateSelect';
import EnterTranscript from './EnterTranscript';
import VideoOutput from './VideoOutput';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/templates" component={TemplateSelect} />
        <Route path="/enter-transcript" component={EnterTranscript} />
        <Route path="/video-output" component={VideoOutput} />
      </Switch>
    </Router>
  );
};

export default App;
