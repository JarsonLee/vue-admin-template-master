<template>
  <el-row :gutter="10">
    <el-col :span="12"> <Search /> </el-col>
    <el-col :span="12"> <Category /></el-col>
  </el-row>
</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
  name: "Observe",
  components: {
    Search,
    Category,
  },
};
</script>

<style lang="less" scoped></style>
