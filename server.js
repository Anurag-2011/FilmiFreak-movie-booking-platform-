const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const uri = process.env.MONGO_URI;
console.log('MONGO_URI:', uri);

if (!uri) {
    console.error('Error: MONGO_URI is not defined in .env file');
    process.exit(1);
}

const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    monitorCommands: true //command monitoring
});

async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB Atlas connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

const db = client.db('movie_slot');
const bookingsCollection = db.collection('bookings');

app.get('/api/booking/seats', async (req, res) => {
    const { date, time, movie } = req.query;
    try {
        const bookings = await bookingsCollection.find({ date, time, movie }).toArray();
        const bookedSeats = bookings.flatMap(booking => booking.seats);
        res.json({ bookedSeats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/booking/book', async (req, res) => {
    const { date, day, time, movie, seats, amount } = req.body;
    const booking = {
        date, day, time, movie, seats, amount,
        createdAt: new Date()
    };
    try {
        const result = await bookingsCollection.insertOne(booking);
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));