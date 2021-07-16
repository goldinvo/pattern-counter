import logo from './saucyboy.svg'
import './Sidebar.css'

// props: title, description, info
function Sidebar(props) {
  return (
    <aside className='sidebar'>
      <header>
        <span id='title'>{props.title}</span>
        <div>{props.description}</div>  
      </header>
      <div>{props.info}</div>
      <a href='https://goldinvo.com'>
        <img src={logo} alt=''></img>
        goldinvo.com
      </a>
    </aside>
  )
}

export default Sidebar;