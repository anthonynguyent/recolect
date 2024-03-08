import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
	const [users, setUsers] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		// fetchUsers();
	}, []);

	// Function to see all registered users in the database
	// const fetchUsers = () => {
	// 	axios.get('http://localhost:3001/register').then((res) => {
	// 		console.log(res.data);
	// 	});
	// };

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post('http://localhost:3001/login', {
				username,
				password,
			});

			const token = response.data.token;
			// alert('Login successful');
			setUsername('');
			setPassword('');

			// Fetch user data to get the username from the server
			const userResponse = await axios.get(
				`http://localhost:3001/profile/${username}`,
				{
					headers: {
						Authorization: `${token}`,
					},
				}
			);
			// fetchUsers();

			// Navigate to the user's profile using the fetched username
			navigate(`/profile/${username}`);

			// Refresh the page
			window.location.reload();

			// Save the token to local storage
			localStorage.setItem('token', token);
		} catch (error) {
			console.log('ERROR: Login failed');
		}
	};

	// setUsername, setPassword: Whenever a user types into the respective fields, the values are saved for their respective fields and onSubmit will be taken to MongoDB
	return (
		<div className='h-screen flex items-center justify-center'>
			<div className='bg-blue-500 rounded-lg shadow-md p-8'>
				<form
					className='text-center w-[600px] h-[400px]'
					onSubmit={handleLogin}
				>
					{/* Username Input */}
					<label>Username</label>
					<br />
					<input
						className='w-[400px] h-[40px] rounded-xl bg-white-700 p-2'
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<br />
					<br />
					{/* Password Input */}
					<label>Password</label>
					<br />
					<input
						className='w-[400px] h-[40px] rounded-xl bg-white-700 p-2'
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<br />
					<br />
					{/* Button */}
					<button
						className='w-[200px] h-[50px] border hover:bg-green-900'
						type='submit'
					>
						Log In
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
