// ** React Imports
import { Fragment, useState, useRef } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader'
import VerticalNavMenuItems from './VerticalNavMenuItems'
import { Button, Card, CardImg } from 'reactstrap'

// ** Logout Funct.
import { logoutFirebase } from '../../../../../utility/HelperFunc'
import { handleLogout } from '@store/firebase.auth'

// ** Hooks
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// ** Image
import logoutImg from '../../../../../assets/images/revive/logout.png'

const Sidebar = (props) => {
  // ** Props
  const { menuCollapsed, menu, skin, menuData } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** dispatch
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ** logout function
  const handleLogoutFunc = () => {
    logoutFirebase()
    dispatch(handleLogout())
    navigate('/login')
  }

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true)
  }

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block')
      }
    } else {
      if (shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.remove('d-block')
      }
    }
  }

  return (
    <Fragment>
      <div
        className={classnames(
          'main-menu menu-fixed menu-accordion menu-shadow',
          {
            expanded: menuHover || menuCollapsed === false,
            'menu-light': skin !== 'semi-dark' && skin !== 'dark',
            'menu-dark': skin === 'semi-dark' || skin === 'dark',
          }
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu({ ...props })
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader
              setGroupOpen={setGroupOpen}
              menuHover={menuHover}
              {...props}
            />
            {/* Vertical Menu Header Shadow */}
            <div className='shadow-bottom' ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className='main-menu-content'
              options={{ wheelPropagation: false }}
              onScrollY={(container) => scrollMenu(container)}
            >
              <ul className='navigation navigation-main'>
                <VerticalNavMenuItems
                  items={menuData}
                  menuData={menuData}
                  menuHover={menuHover}
                  groupOpen={groupOpen}
                  activeItem={activeItem}
                  groupActive={groupActive}
                  setGroupOpen={setGroupOpen}
                  menuCollapsed={menuCollapsed}
                  setActiveItem={setActiveItem}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                />
              </ul>

              <Card className='ms-2 me-2 pb-1 pt-1 position-relative bg-dark'>
                <CardImg
                  style={{
                    width: '150px',
                    height: '180px',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: '-20px',
                    left: '100px',
                  }}
                  src={logoutImg}
                />
                <div className='d-flex m-2 w-50  flex-column align-items-start'>
                  <h5 className='text-light'>Hey John</h5>
                  <Button color='primary' onClick={handleLogoutFunc}>
                    Logout
                  </Button>
                </div>
              </Card>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Sidebar
