import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState('ass')

  useEffect(() => {
    axios
      .get("http://localhost:5500/api/stuff")
      .then((res) => setMsg(res.data.msg))
      .catch((err) => console.log(err));
  }, []);

  const changeMsg = () => {
    axios
      .post("http://localhost:5500/api/stuff")
      .then((res) => {
        setMsg(res.data.msg)
      })
      .catch((err) => console.log(err))

  }

  return (
    <div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src="/assets/react.svg"
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <button onClick={changeMsg}>
        ass is
      </button>
      <p className="read-the-docs">{msg}</p>
    </div>
  );
}

export default App
