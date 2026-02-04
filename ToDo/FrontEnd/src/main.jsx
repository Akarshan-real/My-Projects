import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { userNameContextProvider } from './context/userName.js'
import { TodoProvider } from './context/todos.js';

createRoot(document.getElementById('root')).render(
  <userNameContextProvider>
    <TodoProvider>
      <App />
    </TodoProvider>
  </userNameContextProvider>
)
