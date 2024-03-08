import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './config.js';

function authenticateToken(req, res, next) {
	const token = req.headers['authorization'];

	if (!token) return res.status(401).json({ error: 'Unauthorized' });

	jwt.verify(token, SECRET_KEY, (err, user) => {
		if (err) {
			console.error('Token verification error:', err);
			return res.status(403).json({ error: 'Forbidden' });
		}

		req.user = user;
		next();
	});
}

export default authenticateToken;

// SECOND ONE IS USING PROMISES FOR ASYNC

// import jwt from 'jsonwebtoken';
// import { SECRET_KEY } from './config.js';

// function authenticateToken(req, res, next) {
// 	const token = req.headers['authorization'];

// 	console.log('Received token in authentication middleware:', token);

// 	if (!token) return res.status(401).json({ error: 'Unauthorized' });

// 	return new Promise((resolve, reject) => {
// 		jwt.verify(token, SECRET_KEY, (err, user) => {
// 			if (err) {
// 				console.error('Token verification error:', err);
// 				return reject({ error: 'Forbidden' });
// 			}

// 			req.user = user;
// 			resolve();
// 		});
// 	})
// 		.then(() => next())
// 		.catch((error) => res.status(403).json(error));
// }

// export default authenticateToken;
