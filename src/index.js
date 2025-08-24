// index.js
import connectDB from './database/server.js'
import app from './app.js';

// Connect to MongoDB
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

});

