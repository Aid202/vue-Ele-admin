<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <!-- <span slot="before">共16条记录</span> -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">Excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">Excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="list">
        <!-- 在表格中，显示序号为 type="index" -->
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column width="120px" label="头像" align="center">
          <!-- 插槽 -->
          <template v-slot="{ row }">
            <img v-imageerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px" @click="showQrCode">
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" :formatter="formatEmployment" prop="formOfEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column align="center" label="入职状态" sortable="" prop="enableState">
          <template>
            <el-switch :value="enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="入职时间" sortable="" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <!-- 通过作用域插槽获取id  通过解构 row 获取id -->
          <!-- v-slot=“{row}” -->
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination :current-page="page.page" :page-size="page.size" :total="page.total" layout="prev, pager, next" @current-change="changePage" />
      </el-row>
    </div>
    <!-- 放置弹层组件 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee, getEmployeeSimple } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployee from './components/add-employee.vue'
import QrCode from 'qrcode'
// import { formatDate } from '@/filters'
export default {
  components: { AddEmployee },
  data() {
    return {
      list: [], // 列表数据
      page: {
        page: 1,
        size: 10,
        total: 0 // 总数
      },
      enableState: 1,
      loading: false, // 显示遮罩层
      showDialog: false, // 显示弹层
      showCodeDialog: false // 显示二维码弹层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // newPage是最新页码
    changePage(newPage) {
      this.page.page = newPage // 赋值最新页码
      this.getEmployeeList() // 重新拉取数据
    },
    formatEmployment(row, column, cellValue, index) { // 格式化聘用形式
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      console.log(id)
      try {
        console.log(id)
        await this.$confirm('确定删除该员工么？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (err) {
        console.log(err)
      }
    },
    exportData() {
      // 因为数据中的key是英文，想要导出的表头是中文的话，需要将中文和英文做对应
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出
        // 导出  header 表头从哪里来
        //       data  数据从哪里来
        const { rows } = await getEmployeeSimple({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data 就是要导出的结构
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表'
        })
        // excel.export_json_to_excel({
        //   header: ['姓名', '工号'],
        //   data: [['张三', 6666], ['李四', 50000]],
        //   filename: '员工工资表'
        // })
        // 要转化 数据结构 要和 表头对应上
        // 要求转化出来的标题是 中文
      })
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style>

</style>
