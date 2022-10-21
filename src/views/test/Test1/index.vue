<template>
  <div>
    <el-button
      type="success"
      v-show="$store.state.user.buttons.indexOf('btn.Test1.remove') != -1"
      >删除按钮</el-button
    >
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.Test1.add') != -1"
      >添加按钮</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Test1",
};
</script>

<style lang="less" scoped></style>
