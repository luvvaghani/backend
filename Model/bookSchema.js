const { default: mongoose } = require("mongoose");

let bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [String],
});


module.exports = mongoose.model("Book", bookSchema);

