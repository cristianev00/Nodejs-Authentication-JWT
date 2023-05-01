const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // load environment variables from .env file

// Set up database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query({
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    });
    const user = result.rows[0];

    if (
      !user ||
      !password ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      res.status(401).json({ message: "Usuario o Contraseña Inválidos" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Check if user with given username or email already exists
  const query = {
    text: "SELECT * FROM users WHERE username = $1 OR email = $2",
    values: [username, email],
  };

  try {
    const result = await pool.query(query);
    const existingUser = result.rows[0];

    if (existingUser) {
      if (existingUser.username === username) {
        res.status(400).json({ message: "Username already exists" });
      } else if (existingUser.email === email) {
        res.status(400).json({ message: "Email already exists" });
      }
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const insertQuery = {
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
        values: [username, email, hashedPassword],
      };

      const result = await pool.query(insertQuery);
      const userId = result.rows[0].id;

      // Generate JWT token and send it back to client
      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.json({ token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    // verify the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decodedToken.userId;

    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };
    const result = await pool.query(query);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // generate a new token with a refreshed expiration time
    const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token: newToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};
