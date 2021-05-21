<template>
    <h1>{{ coin.asset_id_base }}</h1>
    <!-- {{ timePeriods }} -->
    <select 
      v-model="selectedTimePeriod"
      @change="getChartData"
    >
      <option 
        v-for="period in timePeriods"
        :key="period.period_id"
        :label="period.display_name"
        :value="period.period_id"
      />
    </select>
    <!-- <pre>{{ lineChart }}</pre> -->
    <vue3-chart-js
      v-if="lineChart.data"
      v-bind="{ ...lineChart }"
      ref="chartRef"
    />
    <!-- <pre>{{ historicalData }}</pre> -->
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios';
import dayjs from 'dayjs';
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
// import dataLabels from "chartjs-plugin-datalabels";

export default {
  name: 'Listing',
  props: {
    symbol: {
      type: Number,
      required: true
    }
  },
  components: {
    Vue3ChartJs,
  },
  setup (props) {
    let coin = reactive({})
    let lineChart = reactive({})
    let timePeriods = ref([])
    let selectedTimePeriod = ref('1DAY')
    const exchange = 'GEMINI' // You have to use the GEMINI exchange in the sandbox enviornment
    // const exchange = 'KRAKEN'
    // todo: move this into env variables
  
    const apiUrl = process.env.VUE_APP_API_URL;

    const getCoinData = () => {
      axios.get(`${apiUrl}/v1/symbols?filter_symbol_id=${props.symbol}&filter_exchange_id=${exchange}&filter_asset_id=USD`)
      .then(response => {
        Object.assign(coin, response.data[0])
      })
    }

    const getChartData = () => {
      axios.get(`${apiUrl}/v1/ohlcv/${props.symbol}/latest?period_id=${selectedTimePeriod.value}`)
      .then(response => {
        const priceData = response.data.map(day => {
          return day.price_close
        })
        const labels = response.data.map(day => {
          return dayjs(day.time_close).format('MM/DD') 
        })
        const chartObject = {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: 'Price',
                data: priceData,
                fill: false,
                borderColor: "#B4C5E4",
                backgroundColor: "black",
                tension: 0.05,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Price'
              }
            },
            scales: {
              y: {
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: function(value) {
                      return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                }
              }
            }
          }
        };
        Object.assign(lineChart, chartObject)
      })
    }

    const getTimePeriods = () => {
      // todo: move into store
      axios.get(`${apiUrl}/v1/ohlcv/periods`)
      .then(response => {
        // Object.assign(coin, response.data[0])
        timePeriods.value = response.data
      })
    }
    
    onMounted(() => {
      getTimePeriods()
      getCoinData()
      getChartData()
    })
    return {
      coin,
      getChartData,
      lineChart,
      selectedTimePeriod,
      timePeriods
    }
  }
}
</script>

<style scoped>
</style>
