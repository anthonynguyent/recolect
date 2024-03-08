// npm start
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

function App() {
	const isUserSignedIn = !!localStorage.getItem('token');

	return (
		<div className='App'>
			<Navbar />
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignUp />} />
				{isUserSignedIn && (
					<Route path='/profile/:username' element={<Profile />} />
				)}
			</Routes>
		</div>
	);
}

export default App;
