// import React from 'react'
// import ReactDOM from 'react-dom/client'
import React from './react'
import ReactDOM from './react-dom'

const element = React.createElement('div', {
  className: 'title',
  style: {
    color: 'red',
  }
}, React.createElement('span', null, 'hello'), 'world')
ReactDOM.render(element, document.getElementById('root')!)
