const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It should be in the format XX-XXXXXXX or XXX-XXXXXXXX.`,
    },
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
