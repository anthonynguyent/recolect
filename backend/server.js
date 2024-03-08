// npx nodemon server
import { PORT, usersDBURI, SECRET_KEY } from './config.js';
import authenticateToken from './authMiddleware.js';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

// Importing schema
import user from './models/userSchema.js';
import image from './models/imageSchema.js';

// Connect to express app
const app = express();

// Setting up a simple route for checking if the API is working
app.get('/', (request, response) => {
	console.log(request);
	return response.status(200).send('API is working');
});

// Connecting to MongoDB and starting the Express app
mongoose
	.connect(usersDBURI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(
				`App is connected to database and listening to port: ${PORT}`
			);
		});
	})
	.catch((error) => {
		console.log(error);
	});

// Using cors middleware to handle cross-origin requests (CORS) and have express use its built in json parsing middleware
// Connecting to middleware should generally be right after connecting to the database
app.use(bodyParser.json());
app.use(cors());

// Routes
// User Registration
// POST REGISTER
// Using the express app to make a post request and posting data into the /register path
app.post('/register', async (req, res) => {
	try {
		// Send a request of the information that's posted in the body
		const { email, username, password } = req.body;
		// 10 is how difficult the hash will be
		const hashedPassword = await bcrypt.hash(password, 10);
		// Creating a new schema
		const newUser = new user({ email, username, password: hashedPassword });

		// Don't need to check if user is in database here because user schema has unique: true identifiers for email and username so handleRegister in SignUp.js will throw an error if it detects the same email or username signing up again

		await newUser.save();
		res.status(201).json({ message: 'User successfully created' });
	} catch (error) {
		res.status(500).json({ message: 'ERROR: User failed to create' });
	}
});

// GET REGISTERED USERS
app.get('/register', async (req, res) => {
	try {
		const users = await user.find();
		res.status(201).json(users);
	} catch (error) {
		res.status(500).json({ error: 'ERROR: Unable to get users' });
	}
});

// POST LOGIN
app.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		const foundUser = await user.findOne({ username });
		const isPasswordValid = await bcrypt.compare(
			password,
			foundUser.password
		);
		if (!foundUser || !isPasswordValid) {
			return res.status(401).json({ error: 'Invalid crendentials' });
		}
		const token = jwt.sign(
			{
				userID: foundUser._id,
				userName: foundUser.username,
			},
			SECRET_KEY,
			{
				expiresIn: '1hr',
			}
		);

		res.json({ message: 'Login successful', token });
	} catch (error) {
		res.status(500).json({ error: 'ERROR: Failed to login' });
	}
});

// POST UPLOAD IMAGE
// Multer's method
// Defining 2 things: Destination and filename
// Destination and filename accepts a function with 3 arguments: a request, a file, and a callback function
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Called after a file is received, if you want to handle errors, updated 'null', '/tmp/my-uploads' is the destination
		cb(null, '../frontend/src/uploads/');
	},
	// Filename change to make every image uploaded unique to prevent same names
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-';
		cb(null, uniqueSuffix + file.originalname);
	},
});

const upload = multer({ storage: storage });

// Uploading a single file in our const submitImage formdata in Profile.js
// When uploading the image, the user's token is authenticated so that the user's data will be attached to the photo and the uploaded photo is then linked to the userwho uploaded it
app.post(
	'/upload-image',
	authenticateToken,
	upload.single('image'),
	async (req, res) => {
		// console.log(req.body);
		// res.send('Upload successful');
		try {
			const imageName = req.file.filename;
			const currentUserID = req.user.userID;

			await image.create({
				image: imageName,
				uploadedById: currentUserID,
			});
			res.status(200).json({ message: 'Image successfully uploaded' });
		} catch (error) {
			res.status(500).json({ error: 'ERROR: Image failed to upload' });
		}
	}
);

// GET IMAGES
app.get('/get-image/:username', authenticateToken, async (req, res) => {
	try {
		const requestedUsername = req.params.username;

		// Find the user based on the requested username
		const requestedUser = await user.findOne({
			username: requestedUsername,
		});

		if (!requestedUser) {
			return res.status(404).json({ error: 'ERROR: User not found' });
		}

		const images = await image.find({ uploadedById: requestedUser._id });

		res.status(200).send({ data: images });
	} catch (error) {
		res.status(500).json({ error: 'ERROR: No images found' });
	}
});

// DELETE IMAGE
app.delete('/delete-image/:imageID', authenticateToken, async (req, res) => {
	try {
		// This section is not needed as I can just findByIdAndDelete
		const currentUserID = req.user.userID;

		// References the :imageID in the route
		const imageID = req.params.imageID;
		// Since photos cannot be shown or clicked on by those who aren't authenticated with the the token and id attached to the token, this check seems optional, but helps security
		// Extra check if the image exists and is uploaded by the current user
		const imageToDelete = await image.findOne({
			_id: imageID,
			uploadedById: currentUserID,
		});
		if (!imageToDelete) {
			return res
				.status(404)
				.json({ error: 'Image not found or unauthorized' });
		} else {
			// Delete image from the filesystem to save space
			const imagePath = `../frontend/src/uploads/${imageToDelete.image}`;
			fs.unlinkSync(imagePath);

			// Delete image from MongoDB
			await image.findByIdAndDelete(imageID);

			res.status(200).send({ message: 'Image successfully deleted' });
		}
	} catch (error) {
		res.status(500).json({ error: 'ERROR: Image failed to delete' });
	}
});

// VIEW PROFILE (AUTH GIVEN DEPENDING ON LOGGED IN USER OR SEARCHED USERS)
app.get('/profile/:username', authenticateToken, async (req, res) => {
	try {
		// Extract username from URL path
		const requestedUsername = req.params.username;

		// Username of the authenticated (Logged in) user
		const authenticatedUsername = req.user.userName;

		const foundRequestedUser = await user.findOne({
			username: requestedUsername,
		});

		// If foundRequestedUser is NOT FOUND
		if (!foundRequestedUser) {
			return res.status(404).json({ error: 'ERROR: User not found' });
		}

		// If foundRequestedUser IS FOUND
		const publicUserData = {
			username: foundRequestedUser.username,
		};

		// Check if the requested user is the authenticated user
		const isOwnerProfile = authenticatedUsername === requestedUsername;

		// Sending isOwnerProfile through server side is much better security wise because if it is done through client side, a user can edit the values using developer tools and other means to trick the webpage into thinking they are the user for any profile
		return res.json({ user: publicUserData, isOwnerProfile });
	} catch (error) {
		res.status(500).json({
			error: 'ERROR: Error fetching user profile',
		});
	}
});
