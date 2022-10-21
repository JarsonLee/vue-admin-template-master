<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <span class="iconfont icon-info"></span>
    </div>
    <div class="main">
      <span>12321</span>
      <span>17.1</span>
      <span class="iconfont icon-caret-up"></span>
      <span class="iconfont icon-caret-down"></span>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineCharts",
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
          type: "line",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
          //转折点设置透明
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: "blue",
          },
          //区域渐变
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue",
                },
                {
                  offset: 1,
                  color: "#fff",
                },
              ],
              global: false,
            },
          },
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  color: #aba9a9;
}
.header span {
  margin-right: 6px;
}

.main {
  margin: 10px 0px;
}
.main span:nth-child(1) {
  margin-right: 30px;
  font-size: 20px;
}
.main span:nth-child(2) {
  margin-right: 8px;
  font-size: 14px;
}

.charts {
  height: 50px;
}
</style>
