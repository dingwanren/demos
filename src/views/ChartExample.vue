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
        text: '示例饼图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        { 
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ],
          emphasis: { 
            itemStyle: { 
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
      console.log('点击了饼图的：', params.name);
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