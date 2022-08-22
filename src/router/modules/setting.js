// 公司设置的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/setting', // 路由地址  /employees
  name: 'setting',
  component: Layout,
  children: [{
    // 二级路由什么都不写，表示为二级路由的默认组件
    path: '',
    component: () => import('@/views/setting'),
    // 路由的原信息 存储数据，可以放任意内容
    meta: {
      title: '公司设置' // 因为 左侧导航 读取了 title属性
    }
  }]
}
