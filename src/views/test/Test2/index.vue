<template>
  <div>
    <el-button
      type="success"
      v-show="$store.state.user.buttons.indexOf('btn.Test2.update') != -1"
      >修改按钮</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Test2",
};
</script>

<style lang="less" scoped></style>
