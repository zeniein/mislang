import { 
  DashboardIcon, 
  UsersIcon, 
  SettingsIcon,
  EmailIcon,
  ContentIcon,
  TodoIcon,
  ScheduleIcon
} from '../components/icons'

export interface MenuItem {
  path: string
  label: string
  icon: any
}

export const menuItems: MenuItem[] = [
  {
    path: '/admin',
    label: '控制台',
    icon: DashboardIcon
  },
  {
    path: '/admin/content',
    label: '内容管理',
    icon: ContentIcon
  },
  {
    path: '/admin/todo',
    label: '待办事项',
    icon: TodoIcon
  },
  {
    path: '/admin/schedule',
    label: '日程安排',
    icon: ScheduleIcon
  },
  {
    path: '/admin/users',
    label: '用户管理',
    icon: UsersIcon
  },
  {
    path: '/admin/email-templates',
    label: '邮件模板',
    icon: EmailIcon
  },
  {
    path: '/admin/settings',
    label: '系统设置',
    icon: SettingsIcon
  }
]
