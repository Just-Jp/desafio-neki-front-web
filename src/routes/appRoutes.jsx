import { Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/login/login'
import RegisterPage from '../pages/register/register'
import HomePage from '../pages/home/home'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<LoginPage/>}></Route>
            <Route path='/register' element={<RegisterPage/>}></Route>
            <Route path='/home' element={<HomePage/>}></Route>        
        </Routes>
    )
}