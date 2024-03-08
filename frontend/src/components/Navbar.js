import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
	const isUserSignedIn = !!localStorage.getItem('token');
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');

	const handleSignOut = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	const handleSearchInputChange = (e) => {
		setSearchQuery(e.target.value);
	};

	// TO-DO: When searching a profile that doesn't exist, should show alert, as of now it shows a blank profile page of that address
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		// Redirect to the profile page of the searched user
		navigate(`/profile/${searchQuery}`);

		// Refresh the page
		window.location.reload();

		// Clear the search query after redirection
		setSearchQuery('');
	};

	// TO-DO: Clicking Recolect string in navbar should do two things; if user is logged in, return to profile, if user is not logged in, return to login page
	const handleReturnToProfile = () => {};

	return (
		<nav className='bg-gradient-to-r from-f7f7f7 to-ffffff shadow-sm text-black px-6 py-4 flex items-center justify-between'>
			{!isUserSignedIn ? (
				<Link to='/' className='font-bold text-xl tracking-wide'>
					Recolect
				</Link>
			) : (
				// TO DO: Make it so clicking on 'Recolect' while logged in redirects the user to their own profile
				<span className='font-bold text-xl tracking-wide'>
					Recolect
				</span>
			)}
			<div className='ml-auto flex space-x-6'>
				{isUserSignedIn ? (
					<>
						<div className='flex items-center'>
							<input
								type='text'
								placeholder='Search for a profile...'
								value={searchQuery}
								onChange={handleSearchInputChange}
								className='border border-gray-300 px-2 py-1 rounded-md focus:outline-none w-full'
							/>
							<button
								type='submit'
								onClick={handleSearchSubmit}
								className='ml-2 bg-gray-300 hover:bg-gray-400 text-black font-medium px-2 py-1 rounded-md focus:outline-none'
							>
								Search
							</button>
						</div>
						<button
							className='hover:text-red-700 decoration-solid'
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					</>
				) : (
					<>
						<Link
							to='/login'
							className='hover:text-blue-700 decoration-solid'
						>
							Log In
						</Link>
						<Link
							to='/signup'
							className='hover:text-blue-700 decoration-solid'
						>
							Sign Up
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
