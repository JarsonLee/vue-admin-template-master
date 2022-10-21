<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      class="addBtn"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 品牌管理表 -->
    <el-table border :data="records">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            :alt="row.tmName"
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
      class="pagination"
      @current-change="getCurrentPageList"
      @size-change="sizeChange"
    ></el-pagination>
    <!-- 弹框 -->
    <!-- :visible.sync是一个扳机trigger，可触发自定义事件 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <el-form :rules="rules" :model="tmForm" ref="tmForm">
        <el-form-item label="活动名称" label-width="100px" prop="tmName">
          <el-input
            autocomplete="off"
            v-model="tmForm.tmName"
            ref="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    const validateTmName = (rule, value, callback) => {
      //自定义校验规则
      if (value.length < 2 || value.length > 5) {
        callback(new Error("品牌名称2-5位"));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      page: 1,
      limit: 3,
      dialogFormVisible: false,
      records: [],
      imageUrl: "",
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //运用自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  methods: {
    async getCurrentPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      const result = await this.$api.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    async sizeChange(size) {
      this.limit = size;
      const { page, limit } = this;
      const result = await this.$api.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 <= 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark() {
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          const result = await this.$api.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getCurrentPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showDialog() {
      this.tmForm = { tmName: "", logoUrl: "" };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["input"].focus();
      });
    },
    updateTradeMark(row) {
      //这里是重点，不能让this.tmForm和row同时指向同个地址，不然一改牵涉两个数据
      //this.tmForm =  row;这样不行,这里使用了浅拷贝
      this.tmForm = { ...row };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    deleteTradeMark(row) {
      this.$confirm(`确定删除品牌${row.tmName}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(async () => {
          const result = await this.$api.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除品牌成功",
            });
            this.getCurrentPageList(
              this.records.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getCurrentPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style scoped>
.addBtn {
  margin: 10px 0px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
