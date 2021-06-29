// props: name, onChange, value
function Counter(props) {
    return (
        <div>
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
        </div>
    );
}

export default Counter;