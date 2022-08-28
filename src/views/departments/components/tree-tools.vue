<template>
  <el-row
    type="flex"
    justify="space-between"
    style="width: 100%; height: 20px"
  >
    <!-- 左侧 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
    <!-- /右侧 -->
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    // 定义传入属性
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击 删除、新增、编辑时触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门
        // 当前点击的部门 this.treeNode 下 添加子部门
        this.$emit('addDepts', this.treeNode) // 触发一个自定义事件 告诉父组件，显示弹层
      } else if (type === 'edit') {
        // 编辑部门
      } else {
        // 删除部门
        this.$confirm('确定删除' + this.treeNode.name + '么？').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 等到成功的时候，调用接口删除 但是后端变化，前端未变。重新获取
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>
</style>
