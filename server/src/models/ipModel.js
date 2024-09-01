const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://nivedpk21:nivedpk21@cluster0.cuiosip.mongodb.net/cdnDB?retryWrites=true&w=majority&appName=Cluster0"
);
const schema = mongoose.Schema;
const ipSchema = new schema({
  ip: { type: String },
  count: { type: String },
});
const ipModel = mongoose.model("ip_tb", ipSchema);
module.exports = ipModel;
