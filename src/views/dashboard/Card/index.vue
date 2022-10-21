<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span class="week"
                >周同比&nbsp;56.67%<span
                  class="iconfont icon-caret-up"
                ></span></span
              ><span
                >日同比&nbsp;19.16%<span class="iconfont icon-caret-down"></span
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额￥&nbsp;12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日访问量&nbsp;1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts />
            </template>
            <template slot="footer">
              <span>转换率&nbsp;64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressCharts />
            </template>
            <template slot="footer">
              <span class="week"
                >周同比&nbsp;12%<span
                  class="iconfont icon-caret-up"
                ></span></span
              ><span
                >日同比&nbsp;11%<span class="iconfont icon-caret-down"></span
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Detail from "./Detail";
import LineCharts from "./LineCharts";
import BarCharts from "./BarCharts";
import ProgressCharts from "./ProgressCharts";
export default {
  name: "Card",
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressCharts,
  },
};
</script>
<style scoped></style>
