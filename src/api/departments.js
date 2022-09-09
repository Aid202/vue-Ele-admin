/**
 * 组织架构接口
 *  delete 删除业务
 *  get 获取业务
 *  post 新增/添加业务
 *  put 修改业务
 */
import request from '@/utils/request'

/**
 * 获取组织架构的数据
 */
export function getDepartments() {
  return request({
    url: '/company/department'
    // method: 'get' 默认为get 不需要写
  })
}
/**
 * 删除组织架构的部门
 */
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete' // 接口满足resful接口规范
    // 同样的地址，不同的方法执行不同的业务
  })
}
/**
 * 新增组织架构的部门
 */
export function addDepartments(data) {
  return request({
    url: `/company/department`, // 接口满足resful接口规范
    method: 'post',
    data
  })
}
/**
 * 获取某个部门得详情
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
