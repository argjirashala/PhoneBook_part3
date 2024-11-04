import PropTypes from 'prop-types'

const Person = ({ person, deletePerson }) => (
  <p>{person.name} {person.number} <button onClick={deletePerson}>delete</button></p>
)

Person.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
  deletePerson: PropTypes.func.isRequired,
}

export default Person
