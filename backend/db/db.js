import mongoose from "mongoose";

// console.log("uri:", process.env.MONGO_URI);

function connect() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log(error);
    });
}

export default connect;
