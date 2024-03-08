import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// Think of this as putting all the detail (eggs) into a variable (basket) to use later
// 'users' is the collection name
const user = mongoose.model('users', userSchema);

export default user;
