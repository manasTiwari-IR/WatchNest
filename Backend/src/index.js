import dotenv from 'dotenv';
import {app} from './app.js';
import {connectDB} from './db/index.js';
dotenv.config({
    path: './.env'
})

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});