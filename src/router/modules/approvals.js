// 审批的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/approvals', // 路由地址  /approvals
  name: 'approvals',
  component: Layout,
  children: [{
    // 二级路由什么都不写，表示为二级路由的默认组件
    path: '', // 这里不用写 什么都不写，表示 /approvals 不但有布局 layout => 审批
    component: () => import('@/views/approvals'),
    // 路由的原信息 存储数据，可以放任意内容
    meta: {
      title: '审批', // 因为 左侧导航 读取了 title属性
      icon: 'tree-table'
    }
  }]
}
