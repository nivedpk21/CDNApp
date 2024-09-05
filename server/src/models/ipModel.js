const mongoose = require("mongoose");
require("dotenv").config();

const dbuser = process.env.MONGODB_USER;
const dbpassword = process.env.MONGODB_PASSWORD;
mongoose.connect(
  `mongodb+srv://${dbuser}:${dbpassword}@cluster0.cuiosip.mongodb.net/cdnDB?retryWrites=true&w=majority&appName=Cluster0`
);
const schema = mongoose.Schema;
const ipSchema = new schema({
  ip: { type: String },
  count: { type: String },
});
const ipModel = mongoose.model("ip_tb", ipSchema);
module.exports = ipModel;
