import mongoose from "mongoose";

const uri = "mongodb://swadistchai_db:swadistchai_db@ac-yzyndjx-shard-00-00.24cjepa.mongodb.net:27017,ac-yzyndjx-shard-00-01.24cjepa.mongodb.net:27017,ac-yzyndjx-shard-00-02.24cjepa.mongodb.net:27017/tealeaf-db?ssl=true&replicaSet=atlas-yzyndjx-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected using standard format");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
