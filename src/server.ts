import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

createApp().then(({ app, httpServer }) => { 
  httpServer.listen(PORT, () => {  
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
});
