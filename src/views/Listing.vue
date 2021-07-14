<template>
    <h1>{{ coin.asset_id_base }}</h1>
    timePeriods
    <select
      v-model="selectedTimePeriod"
      @change="getChartData"
    >
      <option
        v-for="period in timePeriods"
        :key="period.days"
        :label="period.label"
        :value="period"
      />
    </select>
    <vue3-chart-js
      :type="lineChart.type"
      :data="lineChart.data"
      :options="lineChart.options"
      ref="chartRef"
    />
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import 'chartjs-adapter-dayjs';
import Formatting from '@/utils/formatting';

export default {
  name: 'Listing',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    Vue3ChartJs,
  },
  setup(props) {
    const apiUrl = process.env.VUE_APP_API_URL;
    const numberOfDays = [
      30,
      60,
      90,
      365,
    ];
    const timePeriods = [
      {
        days: 30,
        label: 'Month',
        stepSize: 1,
      },
      {
        days: 60,
        label: '2 Months',
        stepSize: 1,
      },
      {
        days: 90,
        label: '3 Months',
        stepSize: 1,
      },
      {
        days: 365,
        label: 'Year',
      },
    ];
    const selectedTimePeriod = ref(timePeriods[0]);
    const chartRef = ref(null);
    const lineChart = reactive({
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: 'rgb(22, 82, 240)',
            borderWidth: 2,
            backgroundColor: 'rgb(22, 82, 240)',
            fill: false,
            label: 'Price',
            pointRadius: 0,
          },
        ],
      },
      options: {
        interaction: {
          caretSize: 0,
          displayColors: false,
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Price',
          },
        },
        responsive: true,
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback(value) {
                return Formatting.formatDollar(value);
              },
            },
          },
          x: {
            type: 'time',
            time: {
              displayFormats: {
                month: 'MMM YY',
              },
            },
          },
        },
      },
    });

    const coin = reactive({});

    const getCoinData = () => {
      axios.get(`${apiUrl}/coins/${props.id}`)
        .then((response) => {
          Object.assign(coin, response.data);
        });
    };

    const getChartData = () => {
      // todo: break the following variable into individual variables
      const url = `${apiUrl}/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedTimePeriod.value.days}`;
      axios.get(url)
        .then((response) => {
          lineChart.data.datasets[0].data = response.data.prices.map((price) => price[1]);
          lineChart.data.labels = response.data.prices.map((price) => new Date(price[0]));
          chartRef.value.update(250);
        });
    };

    onMounted(() => {
      getCoinData();
      getChartData();
    });
    return {
      chartRef,
      coin,
      getChartData,
      lineChart,
      selectedTimePeriod,
      numberOfDays,
      timePeriods,
    };
  },
};
</script>
