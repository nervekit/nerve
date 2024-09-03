import mongoose from "mongoose";

const main = async () => {
  const uri = "mongodb://root:example@127.0.0.1:27017/nerve?authSource=admin";
  const options = { serverSelectionTimeoutMS: 5000 };
  await mongoose.connect(uri, options);
};

await main();
