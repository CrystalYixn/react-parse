import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'))

class Count extends React.Component {
  state = { count: 0 }
  render() {
    const { count } = this.state
    return (
      <>
        <div>{count}</div>
        <button
          onClick={() => {
            this.setState({
              count: count + 1,
            })
          }}
        >
          +1
        </button>
      </>
    )
  }
}

root.render(<Count />)

// fetch('https://jsonplaceholder.typicode.com/todos/1')
//   .then(response => response.json())
//   .then(json => console.log(json))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
