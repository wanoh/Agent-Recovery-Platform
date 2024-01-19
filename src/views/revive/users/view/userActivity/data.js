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
    title: 'User Created',
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
    title: 'User Account',
    icon: <Info size={14} />,
    meta: '30 min ago',
    customContent: (
      <div className='d-flex align-items-center'>
        <div className='ms-50'>
          <p>User account balance updated</p>
          <p>User Account profile information modified</p>
          <p>User submitted deposit request</p>
          <p>User lead potential status update</p>
          <p>User lead potential status update by 84748 Admin</p>
          <p>
            User deposit transaction, <em>HS947</em>{' '}
            <Badge color='success'>USD 35,000.00</Badge> , updated by{' '}
            <span className='lead'>Admin</span>
          </p>
          <p>
            User withdrawal transaction, <em>KDX839</em>{' '}
            <Badge color='success'>USD 15,000.00</Badge>, updated by{' '}
            <span className='lead'>Admin</span>
          </p>
        </div>
      </div>
    ),
  },
]
