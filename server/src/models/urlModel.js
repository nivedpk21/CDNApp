const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://nivedpk21:nivedpk21@cluster0.cuiosip.mongodb.net/cdnDB?retryWrites=true&w=majority&appName=Cluster0"
);

const schema = mongoose.Schema;
const urlSchema = new schema({
  url: { type: String },
  order: { type: String },
});
const urlModel = mongoose.model("url_tb", urlSchema);
module.exports = urlModel;
