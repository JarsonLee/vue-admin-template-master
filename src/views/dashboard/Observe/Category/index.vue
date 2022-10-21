<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="flag" size="medium">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      flag: "全部渠道",
    };
  },
  mounted() {
    let mychart = this.$echarts.init(this.$refs.charts);
    mychart.setOption({
      title: {
        text: "视频广告",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {},
      series: [
        {
          name: "销售额类别占比",
          type: "pie",
          radius: ["40%", "70%"],
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "搜索引擎" },
            { value: 580, name: "直接访问" },
            { value: 484, name: "邮件营销" },
            { value: 300, name: "联盟广告" },
          ],
        },
      ],
    });

    mychart.on("mouseover", (params) => {
      const { name, value } = params.data;
      mychart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts {
  height: 300px;
}
</style>
