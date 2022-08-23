<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" />
        <!-- 放置一个 el=-ree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <tree-tools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import TreeTools from './components/tree-tools.vue'
export default {
  components: { treeTools },
  component: {
    TreeTools
  },
  data() {
    return {
      company: { name: '高高高有限公司 ', manager: '负责人'},
      departs: [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{ name: '董事会', manager: '孙权' }]
        },
        { name: '行政部', manager: '曹丕' },
        { name: '人事部', manager: '曹植' }],
      defaultProps: {
        label: 'name'
        // children: 'children'
      }
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
