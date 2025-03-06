const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://yuchandewar:GBXDMnfHnRhTfuuP@cluster0.ut37e.mongodb.net/map', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema and model
const positionSchema = new mongoose.Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
}); 

const Position = mongoose.model('Position', positionSchema);

// Routes
app.post('/positions', async (req, res) => {
    const { latitude, longitude, userId } = req.body;
    console.log(latitude, longitude, userId);
    const newPosition = new Position({ latitude, longitude, userId });

    const userexist = await Position.findOne({ userId});
    if (userexist) {
        const updatedPosition = await Position.findOneAndUpdate
        ({ userId }, { latitude, longitude }, { new: true });
        updatedPosition.save();
        res.status(201).json(updatedPosition);

    } else {
    

    try {
        const savedPosition = await newPosition.save();
        res.status(201).json(savedPosition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
});

app.get('/positions', async (req, res) => {
    try {
        const positions = await Position.find();
        res.status(200).json(positions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
); 
 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});