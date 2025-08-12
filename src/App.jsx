import { useState } from 'react'
import RegisterPage from './pages/register/register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegisterPage/>
    </>
  )
}

export default App