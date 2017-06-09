import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './index.scss';

var React = require('react');
var ReactDOM = require('react-dom');

var App = require('./components/App');

ReactDOM.render(<App/>, document.getElementById('app'));
