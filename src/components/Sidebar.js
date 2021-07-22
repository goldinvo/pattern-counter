import logo from './saucyboy.svg'
import './Sidebar.css'

// props: title, description, info
function Sidebar(props) {
  return (
    <aside className='sidebar'>
      <div className='header'>
        <div id='title'>{props.title}</div>
        <div>{props.description}</div>  
        <div>{props.info}</div>
      </div>
      <a href='https://goldinvo.com' className='link'>
        <img src={logo} alt=''></img>
        goldinvo.com
      </a>
    </aside>
  )
}

export default Sidebar;