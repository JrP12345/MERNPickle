import { app } from "./app.js";
import { connectDB } from "./database/db.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Backend is Running On ${process.env.PORT}`);
});
