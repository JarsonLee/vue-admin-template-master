<template>
  <a :title="title" style="margin: 10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  // 在props出现的属性就不会再this.$attrs中出现了
  props: ["title"],
};
</script>

<style lang="less" scoped></style>
