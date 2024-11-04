import PropTypes from 'prop-types'
import Person from './Person'

const People = ({ people, deletePerson }) => (
  <>
    {people.map(person => 
      <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id, person.name)} />
    )}
  </>
)

People.propTypes = {
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ).isRequired,
  deletePerson: PropTypes.func.isRequired,
}

export default People
