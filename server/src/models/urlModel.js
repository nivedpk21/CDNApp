const mongoose = require("mongoose");
const dbuser = process.env.MONGODB_USER;
const dbpassword = process.env.MONGODB_PASSWORD;
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://${dbuser}:${dbpassword}@cluster0.cuiosip.mongodb.net/cdnDB?retryWrites=true&w=majority&appName=Cluster0`
);

const schema = mongoose.Schema;
const urlSchema = new schema({
  url: { type: String },
  order: { type: String },
});
const urlModel = mongoose.model("url_tb", urlSchema);
module.exports = urlModel;
