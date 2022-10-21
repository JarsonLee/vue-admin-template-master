<template>
  <div>
    <el-table border :data="records">
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(kg)"
        width="80"
        prop="weight"
      ></el-table-column>
      <el-table-column label="价格" width="80" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-sort-down"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 此处的:visible.sync同步联动很重要，去掉sync修饰符，则点击遮罩是没有反应的，
    其原理应熟知！！！！ -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }}-{{ attr.skuId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" :alt="item.imgName" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 5,
      records: [],
      total: 0,
      skuInfo: {},
      show: false,
    };
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$api.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    async sale(row) {
      let result = await this.$api.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    async cancel(row) {
      let result = await this.$api.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    async getSkuInfo(sku) {
      this.show = true;
      let result = await this.$api.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  text-align: right;
  font-size: 18px;
}
.el-col {
  margin: 10px 10px;
}
/* 这里运用了深度选择器！！！！！ */
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
.el-carousel__item img {
  width: 35%;
  height: 95%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
>>> .el-carousel__container .el-carousel__arrow {
  background-color: rgba(61, 162, 154, 0.677);
}
</style>
