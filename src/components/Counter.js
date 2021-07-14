import './Counter.css'

// props: name, onChange, value, color, controls(optional)
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