<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="tm in tradeMarkList"
          :key="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="描述"
        v-model="spu.description"
      ></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlerSuccess"
        :file-list="spuImageList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-select
        :placeholder="`还有${unSelectSaleAttr.length}未选择`"
        v-model="attrIdAndAttrName"
      >
        <el-option
          :label="unselect.name"
          :value="`${unselect.id}:${unselect.name}`"
          v-for="unselect in unSelectSaleAttr"
          :key="unselect.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrIdAndAttrName"
        @click="addSaleAttr"
        >添加销售属性</el-button
      >
      <el-table border :data="spu.spuSaleAttrList">
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              closable
              :disable-transitions="false"
              :key="tag.id"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              v-if="row.inputVisible"
              @blur="handleInputConfirm(row)"
              :ref="$index"
              @keyup.native.enter="$event.target.blur()"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="addSaleAttrValue(row, $index)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spu.spuSaleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      /* 添加和修改的业务逻辑是类似的，但是要发送给服务器的数据要注意
      对于对象类型的数据，添加这边要做好预设处理，以便按保存按钮的时候
      可以发送给服务器需要的对应的数据，这点很重要，具体需要什么
      数据可以参考接口文档 */
      spu: {
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndAttrName: "",
    };
  },
  computed: {
    unSelectSaleAttr() {
      //过滤掉未被选择的数组选项在select中进行展示
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    async initSpuData(spu) {
      let spuResult = await this.$api.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$api.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuImageResult = await this.$api.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      let saleResult = await this.$api.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    addSaleAttrValue(row, index) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    /* @keyup.native.enter="$event.target.blur()"
    此处的回车不能让其触发handleInputConfirm函数，
    不然会导致handleInputConfirm函数执行两次，出现
    提示‘属性值不能相同’，方法就是让回车触发blur事件
    此时下面的函数只会执行一次 */
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == inputValue
      );
      if (result) {
        this.$message("属性值不能相同");
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          //这个时一个经典的用法，电路逻辑运算，666，多看看
          //只要不是null对象，其他的转为布尔值都为真，注意
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });

      let result = await this.$api.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      Object.assign(this._data, this.$options.data());
    },
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      let tradeMarkResult = await this.$api.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let saleResult = await this.$api.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    cancel() {
      this.$emit("changeScene", {
        scene: 0,
        flag: this.spu.id ? "修改" : "添加",
      });
      /* vue骚操作，重置复杂对象的值，让面板清空的骚操作
Object.assign(this._data, this.$options.data());
Object.assign方法是让后面的覆盖掉前面的，重要！！！！！！！ */
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
