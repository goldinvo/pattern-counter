// props: onChange, onSubmit, value
function PatternForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <label>
        Pattern: 
        <textarea value={props.value} onChange={props.onChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default PatternForm;