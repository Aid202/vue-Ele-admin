// 组织架构的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/departments', // 路由地址  /departments
  name: 'departments',
  component: Layout,
  children: [{
    // 二级路由什么都不写，表示为二级路由的默认组件
    path: '', // 这里不用写 什么都不写，表示 /departments 不但有布局 layout => 组织架构
    component: () => import('@/views/departments'),
    // 路由的原信息 存储数据，可以放任意内容
    meta: {
      title: '组织架构', // 因为 左侧导航 读取了 title属性
      icon: 'tree'
    }
  }]
}
