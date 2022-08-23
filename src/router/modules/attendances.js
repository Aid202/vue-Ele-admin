// 考勤的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/attendances', // 路由地址  /approvals
  name: 'attendances',
  component: Layout,
  children: [{
    // 二级路由什么都不写，表示为二级路由的默认组件
    path: '', // 这里不用写 什么都不写，表示 /attendances 不但有布局 layout => 考勤
    component: () => import('@/views/attendances'),
    // 路由的原信息 存储数据，可以放任意内容
    meta: {
      title: '考勤', // 因为 左侧导航 读取了 title属性
      icon: 'skill'
    }
  }]
}
