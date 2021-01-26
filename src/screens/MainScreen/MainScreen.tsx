import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {
    FarmComposition,
    Pool1Composition,
    Pool2Composition,
} from 'compositions';

import 'assets/scss/index.scss';

class MainScreen extends Component {
    public render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact={true} component={FarmComposition} />
                    <Route path='/farm-wethlp' exact={true} component={Pool1Composition} />
                    <Route path='/farm-uni' exact={true} component={Pool2Composition} />
                </Switch>
            </Router>
        );
    }
}

export default MainScreen;