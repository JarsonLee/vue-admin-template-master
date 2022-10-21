<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i class="iconfont icon-info"></i>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count"],
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: rgb(188 186 186);
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
  height: 30px;
  line-height: 16px;
}

.week {
  margin-right: 14px;
}
</style>
