<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 label-width设置所有标题的宽度 -->
    <el-form ref="deptForm" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width: 80%" placeholder="1-100个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      dafault: false
    },
    treeNode: {
      type: Object,
      default: null // 默认值
    }
  },
  data() {
    // 检查部门名称是否重复
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        // depts.filter(item => item === this.formData.pid)
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 新增
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 要求编码和所有的部门编码不能重复 由于历史数据没有code 添加一个强制条件，value不能为空
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构下已经存在${value}这个编码`)) : callback()
    }
    return {
      formData: { // 表单的四个参数
        name: '',
        code: '',
        manager: '',
        introduce: ''// 部门介绍
      },
      rules: { // 校验规则 { key: 数组 }
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOk() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          // 区分为新增还是编辑
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 新增
            // 将 id 设为 pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 表单校验通过
          // 告诉父组件，更新数据
          // 触发一个自定义事件，告诉父组件
          this.$emit('addDepts')
          // 此时将修改showDialog的值
          // update:props名称
          // 关闭弹出层事件
          this.$emit('update:showDialog', false)
          this.$message('添加部门成功')
          // 关闭dialog的时候会触发 el-dialog的close事件  所以这里不需要重复调用btnCancel事件
        }
      })
    },
    btnCancel() {
      // 充值数据，因为resetFields 只能重置表单上的数据，非表单上的（编辑中的id）不能被重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''// 部门介绍
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验
      // resetFields() 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 可以重置数据，但只能重置定义在 data 中得字段
      this.$refs.deptForm.resetFields()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
