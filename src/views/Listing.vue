<template>
    <h1>{{ coin.asset_id_base }}</h1>
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
    <vue3-chart-js
      :type="lineChart.type"
      :data="lineChart.data"
      :options="lineChart.options"
      ref="chartRef"
    />
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios';
import dayjs from 'dayjs';
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

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
    const apiUrl = process.env.VUE_APP_API_URL;
    const chartRef = ref(null)
    const exchange = 'GEMINI' // You have to use the GEMINI exchange in the sandbox enviornment
    // const exchange = 'KRAKEN'
    // todo: move this into env variable
    const lineChart = reactive({
      type: "line",
      data: {
        datasets: [
          {
            label: 'Price',
            // data: priceData,
            fill: false,
            borderColor: "#B4C5E4",
            backgroundColor: "black",
            tension: 0.05
          }
        ]
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
    });
    const timePeriods = ref([])
    const selectedTimePeriod = ref('1DAY')
    let coin = reactive({})
  
    const getCoinData = () => {
      axios.get(`${apiUrl}/v1/symbols?filter_symbol_id=${props.symbol}&filter_exchange_id=${exchange}&filter_asset_id=USD`)
      .then(response => {
        Object.assign(coin, response.data[0])
      })
    }

    const getChartData = () => {
      axios.get(`${apiUrl}/v1/ohlcv/${props.symbol}/latest?period_id=${selectedTimePeriod.value}`)
      .then(response => {
        lineChart.data.datasets[0].data = response.data.map(day => {
          return day.price_close
        })
        const selectedPeriodObject = timePeriods.value.find(period => {
          console.log(period.period_id === selectedTimePeriod.value)
          return period.period_id === selectedTimePeriod.value
        })

        const timesToShowMinutes = ['minute', 'hour']

        const timeFormat = timesToShowMinutes.includes(selectedPeriodObject.unit_name) ? 'MM/DD HH:mm' : 'MM/DD'
        lineChart.data.labels = response.data.map(day => {
          return dayjs(day.time_close).format(timeFormat) 
        })
        chartRef.value.update(250)
      })
    }

    const getTimePeriods = () => {
      // todo: move into store
      axios.get(`${apiUrl}/v1/ohlcv/periods`)
      .then(response => {
        timePeriods.value = response.data
      })
    }
    
    onMounted(() => {
      getTimePeriods()
      getCoinData()
      getChartData()
    })
    return {
      chartRef,
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
