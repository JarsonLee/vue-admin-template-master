<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <el-dropdown>
        <span><i class="el-icon-more"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><LineCharts /></el-col>
        <el-col :span="12"><LineCharts /></el-col>
      </el-row>
      <el-table border :data="tableData" class="table">
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column label="搜索关键字" width="180"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        class="pagination"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from "./LineCharts";
export default {
  name: "Search",
  data() {
    return {
      tableData: [{}],
    };
  },
  components: {
    LineCharts,
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.el-icon-more {
  cursor: pointer;
}

.table {
  margin: 10px 0;
}

.pagination {
  float: right;
}
</style>
