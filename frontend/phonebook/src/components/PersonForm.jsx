import PropTypes from 'prop-types'

const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

PersonForm.propTypes = {
  newName: PropTypes.string.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  newNumber: PropTypes.string.isRequired,
  handleNumberChange: PropTypes.func.isRequired,
  addPerson: PropTypes.func.isRequired,
}

export default PersonForm
