require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.static(path.join(__dirname, 'dist')))

const url = process.env.MONGODB_URI

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error.message)
  )

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(
        persons.map((person) => ({
          id: person._id,
          name: person.name,
          number: person.number,
        }))
      )
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date()
      res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json({
          name: person.name,
          number: person.number,
          id: person._id,
        })
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) return res.status(400).json({ error: 'name is required' })
  if (!body.number)
    return res.status(400).json({ error: 'number is required' })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json({
        id: savedPerson._id,
        name: savedPerson.name,
        number: savedPerson.number,
      })
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json({
          id: updatedPerson._id,
          name: updatedPerson.name,
          number: updatedPerson.number,
        })
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
