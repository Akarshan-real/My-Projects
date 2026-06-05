import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { UserNameContextProvider } from './context/userName'
import { TodoProvider } from './context/todos';

createRoot(document.getElementById('root')!).render(
  <UserNameContextProvider>
    <TodoProvider>
      <App />
    </TodoProvider>
  </UserNameContextProvider>
)
