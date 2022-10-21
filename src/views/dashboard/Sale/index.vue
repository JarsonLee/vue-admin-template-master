<template>
  <el-card>
    <div slot="header" class="header">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          v-model="date"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span>123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  // data数据自带的数据，天生就有
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  //第一次运行，相关数据发生变化时运行
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  //相关数据发生变化时运行
  watch: {
    title() {
      this.setOption();
    },
    listState() {
      this.setOption();
    },
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setOption() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYearAxis
                : this.listState.userFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
  },
  mounted() {
    this.mycharts = this.$echarts.init(this.$refs.charts);
  },
};
</script>

<style scoped>
.el-card {
  margin: 10px 0px;
}
>>> .el-card__header {
  border-bottom: none;
}

.header {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.right {
  position: absolute;
  right: 0px;
}
.el-tabs {
  width: 100%;
}

.right span {
  margin: 0px 10px;
}
.el-date-editor {
  width: 250px;
  margin: 0px 20px;
}

.charts {
  width: 100%;
  height: 300px;
}

ul {
  list-style: none;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  border-radius: 50%;
  background: black;
  color: white;
}
ul li span:last-of-type {
  float: right;
  margin-right: 6px;
}
ul li span:first-of-type {
  float: left;
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 6px;
  text-align: center;
}
</style>
