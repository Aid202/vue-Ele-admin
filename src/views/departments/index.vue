<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <el-row type="flex" justify="space-between">
          <!-- 左侧 -->
          <el-col>
            <span>高高高有限公司</span>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <el-col>
                <!-- 下拉菜单 -->
                <el-dropdown>
                  <!-- 内容 -->
                  <span>
                    操作
                    <i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 下拉选项 -->
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
          <!-- /右侧 -->
        </el-row>
        <!-- 放置一个 el=-ree -->
        <el-tree :data="data" :props="defaultProps" :default-expand-all="true" />
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
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
