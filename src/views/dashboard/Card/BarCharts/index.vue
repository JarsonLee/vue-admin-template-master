<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
export default {
  name: "BarCharts",
  mounted() {
    let lineCharts = this.$echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          //特别地，当只有一个轴为类目轴（axis.type 为 'category'）的时候，数据可以简化用一个一维数组表示
          // 它其实是下面这种形式的简化：
          // data: [[0, 23], [1, 44], [2, 55], [3, 19]]
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8],
          color: "cyan",
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip: {},
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
