import './PatternForm.css'

// props: onChange, onSubmit, value
function PatternForm(props) {
  return (
    <form onSubmit={props.onSubmit} class='PatternForm'>
      <label>Input Pattern Below: </label>
      <textarea value={props.value} onChange={props.onChange} />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default PatternForm;