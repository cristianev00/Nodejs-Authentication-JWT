const app = require('./app.js');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;

dotenv.config(); // load environment variables from .env file

// start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
