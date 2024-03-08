import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Profile() {
	const { username } = useParams();

	// Fetch user data for profile section
	const [user, setUser] = useState({});

	// NEEDS CHANGING
	const [isOwnerProfile, setIsOwnerProfile] = useState(false);

	// Fetch images for image gallery section
	const [image, setImage] = useState(null);
	const [allImage, setAllImage] = useState(null);

	// Image overlay preview
	const [showImageOverlay, setShowImageOverlay] = useState(false);
	// Stores image source for display purposes
	const [overlayImage, setOverlayImage] = useState(null);
	// Stores the unique ID for backend operations
	const [overlayImageID, setOverlayImageID] = useState(null);

	useEffect(() => {
		// Fetch user profile based on the username from the URL
		fetchUserProfile(username);
		displayImages();
	}, [username]);

	const fetchUserProfile = async (requestedUsername) => {
		const token = localStorage.getItem('token');

		try {
			const result = await axios.get(
				`http://localhost:3001/profile/${requestedUsername}`,
				{
					headers: {
						Authorization: `${token}`,
					},
				}
			);

			setIsOwnerProfile(result.data.isOwnerProfile);
			setUser(result.data.user);
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	};

	// Images actions
	const displayImages = async () => {
		const token = localStorage.getItem('token');

		try {
			const result = await axios.get(
				`http://localhost:3001/get-image/${username}`,
				{
					headers: {
						Authorization: `${token}`,
					},
				}
			);
			setAllImage(result.data.data);
		} catch (error) {
			console.error('Error fetching images:', error);
		}
	};

	// Show the preview overlay and store the image and imageID in states
	const handleImageClick = (clickedImage, clickedImageID) => {
		setShowImageOverlay(true);
		setOverlayImage(clickedImage);
		setOverlayImageID(clickedImageID);
	};

	const closeImageOverlay = () => {
		setShowImageOverlay(false);
		setOverlayImage(null);
	};

	// User's own profile actions
	const handleSubmitImage = async (e) => {
		// Prevents reloading
		e.preventDefault();

		// Retrieve the token from local storage
		const token = localStorage.getItem('token');

		const formData = new FormData();
		formData.append('image', image);

		// Axios function to pass the form data to the backend API
		try {
			const result = await axios.post(
				'http://localhost:3001/upload-image',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `${token}`,
					},
				}
			);

			console.log(result.data);
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	const onInputChange = (e) => {
		// Log getting the first image uploaded
		console.log(e.target.files[0]);
		setImage(e.target.files[0]);
	};

	const handleImageDelete = async (clickedImageID) => {
		try {
			const token = localStorage.getItem('token');
			const result = await axios.delete(
				`http://localhost:3001/delete-image/${clickedImageID}`,
				{
					headers: {
						Authorization: `${token}`,
					},
				}
			);
			// console.log(result.data);

			// Update the image gallery after deletion
			displayImages();

			// NOT BEST PRACTICE TO RELOAD PAGE (Temporary fix)
			// It's better practice to update the UI after a successful deletion operation rather than refreshing the entire page
			window.location.reload();
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center'>
					<img
						src={user.profilePicture} // PROFILE PICTURE PLACEHOLDER
						alt='Profile Picture'
						className='w-12 h-12 rounded-full mr-4'
					/>
					<div className='flex flex-col'>
						<h2 className='text-2xl font-bold'>
							{user.username || 'Username Error'}
						</h2>
						<p className='text-sm'>{user.bio || 'I Collect:'}</p>
					</div>
				</div>

				{/* User's own profile action */}
				{isOwnerProfile && (
					<form
						onSubmit={handleSubmitImage}
						className='w-full max-w-sm bg-white rounded-lg shadow-md p-4'
					>
						<div className='flex items-center justify-between'>
							<input
								type='file'
								accept='image/*'
								onChange={onInputChange}
								className='w-full bg-gray-100 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							></input>
							<button
								type='submit'
								className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								Submit
							</button>
						</div>
					</form>
				)}
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4'>
				{allImage == null
					? ''
					: allImage.map((data) => (
							<img
								key={data._id}
								src={require(`../uploads/${data.image}`)}
								className='w-full h-64 object-cover rounded-lg hover:opacity-75 transition-opacity duration-300'
								onClick={() =>
									handleImageClick(
										require(`../uploads/${data.image}`),
										data._id
									)
								}
							/>
					  ))}
			</div>

			{showImageOverlay && (
				<div className='fixed inset-0 bg-black bg-opacity-75 z-50'>
					<div className='absolute inset-0 flex items-center justify-center'>
						<img
							src={overlayImage}
							alt=''
							className='w-full h-full object-contain'
						/>
						<button
							className='bg-white text-black px-4 py-2 rounded-md'
							onClick={closeImageOverlay}
						>
							Close
						</button>
						{isOwnerProfile && (
							<button
								className='bg-red-500 text-white px-4 py-2 rounded-md'
								onClick={() =>
									handleImageDelete(overlayImageID)
								}
							>
								Delete
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Profile;
