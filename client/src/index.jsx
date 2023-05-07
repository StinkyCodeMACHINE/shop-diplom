import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import UserStore from './store/UserStore.js'; //mobx заменить (navbar затронут)
import DeviceStore from './store/DeviceStore.js';

export const Context = createContext(null)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Context.Provider value = {{
    user: new UserStore(),
    device: new DeviceStore()
  }}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Context.Provider>
);
