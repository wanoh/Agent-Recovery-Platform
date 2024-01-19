// ** Icons Import
import {
  User,
  Users,
  Download,
  Upload,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Home,
  UserX,
} from 'react-feather'

export default [
  {
    id: 'leads',
    title: 'Leads',
    icon: <UserX size={20} />,
    navLink: '/leads',
  },
  {
    id: 'user',
    title: 'Users',
    icon: <Users size={20} />,
    navLink: '/user',
  },
  {
    id: 'deposits',
    title: 'Deposits',
    icon: <Download size={20} />,
    navLink: '/deposits',
  },
  {
    id: 'withdrawals',
    title: 'Withdrawals',
    icon: <Upload size={20} />,
    navLink: '/withdrawals',
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: <CreditCard size={20} />,
    navLink: '/Payments',
  },
  {
    id: 'tickets',
    title: 'Tickets',
    icon: <MessageSquare size={20} />,
    navLink: '/tickets',
  },
  {
    id: 'businesspProfile',
    title: 'Business Profile',
    icon: <ShoppingBag size={20} />,
    navLink: '/business-profile',
  },
]
