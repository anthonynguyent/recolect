import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
	{
		image: String,
		uploadedById: {
			type: String,
			required: true,
		},
	},
	{
		collection: 'images',
	}
);

const image = mongoose.model('images', imageSchema);

export default image;
