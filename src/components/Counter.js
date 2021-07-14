import './Counter.css'

// Display for counts that can be changed by the user
// props: name, onChange, value, color, controls (optional, for if you want buttons to interact with counter directly in component)
function Counter(props) {
  return (
    <div className={'counter ' + props.color}>
      <form>
        <label htmlFor="counterInput">{props.name}</label>
        <input 
          type="text" maxLength="3"
          autoComplete="off"
          id="counterInput" 
          value={props.value}
          onChange={props.onChange}
        />
      </form>
      {props.controls ? props.controls : null}
    </div>
  );
}

export default Counter;