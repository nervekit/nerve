import mongoose from "mongoose";

const main = async () => {
  const uri = "mongodb://127.0.0.1:27017/nerve";
  await mongoose.connect(uri);
};

await main();
