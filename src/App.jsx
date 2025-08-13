import { useState } from 'react'
import RegisterPage from './pages/register/register'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/appRoutes'
import HomePage from './pages/home/home'

function App() {
    const [count, setCount] = useState(0)

    return (
        <BrowserRouter>
            <AppRoutes/>
        </BrowserRouter>
        // <HomePage/>
    );
}

export default App