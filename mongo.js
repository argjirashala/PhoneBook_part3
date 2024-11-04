const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const url = `mongodb+srv://argjirashala:${password}@phonebook.mb81o.mongodb.net/?retryWrites=true&w=majority&appName=Phonebook`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

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
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It should be in the format XX-XXXXXXX or XXX-XXXXXXXX.`,
    },
  },
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error adding person:", error.message);
      mongoose.connection.close();
    });
} else {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
