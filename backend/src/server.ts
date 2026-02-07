import app from "./app.js"
import "dotenv/config"

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("app is running...");
    console.log(`listening to port ${PORT}`);
});