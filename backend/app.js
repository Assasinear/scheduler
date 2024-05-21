const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const app = express();



// Middleware

app.use(express.json());

app.use(cors());



// MongoDB connection

mongoose.connect('mongodb+srv://mayorshinrus:Kw0Z1uzpVc4gQffz@cluster0.j0nr64x.mongodb.net' , { useNewUrlParser: true, useUnifiedTopology: true, })

    .then(() => console.log('Connected to MongoDB'))

    .catch((err) => console.error('MongoDB connection error:', err));



// Routes

const authRouter = require('./routes/auth');

const roomsRouter = require('./routes/rooms');

const teachersRouter = require('./routes/teachers');

const groupsRouter = require('./routes/groups');

const schedulesRouter = require('./routes/schedules');

const timeSlotsRouter = require('./routes/timeSlots');

const profileRouter = require('./routes/profile');



app.use('/api/auth', authRouter);

app.use('/api/rooms', roomsRouter);

app.use('/api/teachers', teachersRouter);

app.use('/api/groups', groupsRouter);

app.use('/api/schedules', schedulesRouter);

app.use('/api/timeSlots', timeSlotsRouter);

app.use('/api/profile', profileRouter);



// Listening

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});