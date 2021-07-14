<template>
  <div class="chart-container">
    <vue3-chart-js
      :type="doughnutChart.type"
      :data="doughnutChart.data"
      :options="doughnutChart.options"
      ref="chartRef"
    />
  </div>
</template>

<script>
import {
  computed, ref, reactive, watchEffect,
} from 'vue';
import { useStore } from 'vuex';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import Formatting from '@/utils/formatting';

export default {
  name: 'CoinTable',
  components: {
    Vue3ChartJs,
  },
  setup() {
    const store = useStore();
    const chartRef = ref(null);
    const doughnutChart = reactive({
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Coins By Market Cap',
          hoverOffset: 4,
        }],
      },
      options: {
        interaction: {
          caretSize: 0,
        },
        plugins: {
          title: {
            display: true,
            text: 'Top 10 Coins by Market Cap',
          },
          tooltip: {
            callbacks: {
              label(item) {
                return `${item.label.toUpperCase()}: $${item.formattedValue}`;
              },
            },
          },
        },
      },
    });

    const getDynamicColor = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgb(${r},${g},${b})`;
    };

    const getChartData = (coins) => {
      const topTenCoins = coins.splice(0, 10);
      doughnutChart.data.datasets[0].data = topTenCoins.map((coin) => coin.market_cap);
      doughnutChart.data.labels = topTenCoins.map((coin) => coin.symbol);
      doughnutChart.data.datasets[0].backgroundColor = topTenCoins.map(() => getDynamicColor());
      if (!chartRef.value) {
        return;
      }
      chartRef.value.update(250);
    };

    const coins = computed(() => store.state.coins.coins);

    watchEffect(() => {
      if (coins.value.length) {
        getChartData([...coins.value]);
      }
    });

    return {
      coins,
      chartRef,
      doughnutChart,
      Formatting,
      getChartData,
      getDynamicColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  max-width: 400px;
  margin: 0 auto 15px;
}
</style>
