// useState allows us to store our API or certain values inside of it that we can use when we are rendering our API on to our page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
	const [users, setUsers] = useState([]);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	// useNavigate allows user to be redirected to the login page after signing up in this case
	useEffect(() => {
		// fetchUsers();
	}, []);

	// Function to see all registered users in the database
	// const fetchUsers = () => {
	// 	axios.get('http://localhost:3001/register').then((res) => {
	// 		console.log(res.data);
	// 	});
	// };

	// Handling register form
	const handleRegister = (event) => {
		// preventDefault prevents the page from refreshing
		event.preventDefault();
		axios
			.post('http://localhost:3001/register', {
				email,
				username,
				password,
			})
			.then(() => {
				alert('Registration successful');
				setEmail('');
				setUsername('');
				setPassword('');
				// fetchUsers();
				navigate('/login');
			})
			.catch((error) => {
				console.log('Unable to register user');
			});
	};

	return (
		<div className='h-screen flex items-center justify-center'>
			<div className='bg-blue-500 rounded-lg shadow-md p-8'>
				<form
					className='text-center w-[600px] h-[400px]'
					onSubmit={handleRegister}
				>
					{/* Email Input */}
					<label>Email</label>
					<br />
					<input
						className='w-[400px] h-[40px] rounded-xl bg-white-700 p-2'
						type='text'
						placeholder='Email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<br />
					<br />
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
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
