<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        placeholder="规格描述"
        type="textarea"
        rows="4"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in attrInfoList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option
              :label="attrValue.valueName"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :value="`${attr.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
        >
          <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80"> </el-table-column>
        <el-table-column label="图片"
          ><template slot-scope="{ row }">
            <img
              :src="row.imgUrl"
              style="width: 100px; height: 100px"
            /> </template
        ></el-table-column>
        <el-table-column label="名称" prop="imgName"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              v-if="row.isDefault == 0"
              @click="changeDefault(row)"
              >设置默认</el-button
            >
            <el-button v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      //数据的收集,待发送的数据
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,

        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",

        skuDefaultImg: "",
        skuImageList: [],

        skuAttrValueList: [],

        skuSaleAttrValueList: [],
      },
      spu: {},
      imageList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      let result = await this.$api.spu.reqSpuImageLIst(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      let result1 = await this.$api.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      let result2 = await this.$api.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    handleSelectionChange(params) {
      this.imageList = params;
    },
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScenes", 0);
      Object.assign(this._data, this.$options.data());
    },
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      let result = await this.$api.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功!" });
        this.$emit("changeScenes", 0);
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
