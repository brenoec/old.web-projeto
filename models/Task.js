
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  context: String,
  title: String,
  order: Number,
  dueDate: Date,
});

module.exports = mongoose.model('Task', TaskSchema);
