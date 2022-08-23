// 权限管理的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/permission', // 路由地址  /permission
  name: 'permission',
  component: Layout,
  children: [{
    // 二级路由什么都不写，表示为二级路由的默认组件
    path: '', // 这里不用写 什么都不写，表示 /employees 不但有布局 layout => 员工主页
    component: () => import('@/views/permission'),
    // 路由的原信息 存储数据，可以放任意内容
    meta: {
      title: '权限管理', // 因为 左侧导航 读取了 title属性
      icon: 'lock'
    }
  }]
}
