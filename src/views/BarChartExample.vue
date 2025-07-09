<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chart = ref<HTMLElement | null>(null);

onMounted(() => {
  if (chart.value) {
    const myChart: echarts.ECharts = echarts.init(chart.value);
    const option: echarts.EChartsOption = {
      title: {
        text: '示例柱状图',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['搜索引擎', '直接访问', '邮件营销', '联盟广告', '视频广告']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [1048, 735, 580, 484, 300],
        type: 'bar'
      }]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
      console.log('点击了柱状图的：', params.name);
    });
  }
});
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.chart {
  width: 600px;
  height: 400px;
}
</style>