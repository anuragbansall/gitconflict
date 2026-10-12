import { createServer } from "node:http";
import app from "./src/app.js";
import { attachWebSocketTerminal } from "./services/terminal.service.js";
import { sql } from "./src/db.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
attachWebSocketTerminal(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  sql`SELECT 1`
    .then(() => console.log("DB connected — ready to test"))
    .catch((err) => console.error("DB not reachable:", err.message));
});
