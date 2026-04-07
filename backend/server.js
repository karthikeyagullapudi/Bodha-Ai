import 'dotenv/config';
import app from './app.js';
import connectDb from './src/config/db.js';

connectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
