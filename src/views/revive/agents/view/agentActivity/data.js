import { Fragment } from 'react'

import Avatar from '@components/avatar'
import AvatarGroup from '@components/avatar-group'

import pdf from '@src/assets/images/icons/file-icons/pdf.png'
import ceo from '@src/assets/images/portrait/small/avatar-s-9.jpg'
import interview from '@src/assets/images/portrait/small/avatar-s-20.jpg'
import user1 from '@src/assets/images/portrait/small/avatar-s-25.jpg'
import user2 from '@src/assets/images/portrait/small/avatar-s-7.jpg'
import user3 from '@src/assets/images/portrait/small/avatar-s-10.jpg'

import {
  Button,
  UncontrolledCollapse,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'reactstrap'

import {
  Share2,
  MessageSquare,
  PhoneCall,
  PenTool,
  User,
  FileText,
  MapPin,
  ShoppingBag,
  Server,
  Download,
  Upload,
  UserPlus,
  Info,
} from 'react-feather'

const avatarGroupIcons = [
  {
    title: 'Mostowy Vinnie',
    img: user1,
    imgHeight: 30,
    imgWidth: 30,
  },
  {
    title: 'Rieske Elicia',
    img: user2,
    imgHeight: 30,
    imgWidth: 30,
  },
  {
    title: 'Rossignol Julee',
    img: user3,
    imgHeight: 30,
    imgWidth: 30,
  },
]

export const iconsData = [
  {
    title: 'Agent Created',
    icon: <UserPlus size={14} />,
    meta: '12 min ago',
    customContent: (
      <div className='d-flex align-items-center'>
        <div className='ms-50'>
          <p className='mb-1'>johndoe@gmail.com account was created by Admin</p>
          <p className='mb-0'>johndoe@gmail.com registered from 192.93.01.0</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Agent Account',
    icon: <Info size={14} />,
    meta: '30 min ago',
    customContent: (
      <div className='d-flex align-items-center'>
        <div className='ms-50'>
          <p>Agent account balance updated</p>
          <p>Agent Account profile information modified</p>
          <p>Agent submitted deposit request</p>
          <p>Agent lead potential status update</p>
          <p>Agent lead potential status update by 84748 Admin</p>
        </div>
      </div>
    ),
  },
]
