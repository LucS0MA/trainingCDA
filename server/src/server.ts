import { app, initializeDatabase } from "./index";
import * as dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, async () => {
  await initializeDatabase();
  console.log(`🚀 server started on ${process.env.PORT} ! 🚀`);
});
