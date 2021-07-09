<template>
    <h1>{{ coin.asset_id_base }}</h1>
    <select 
      v-model="selectedNumberOfDays"
      @change="getChartData"
    >
      <option 
        v-for="day in numberOfDays"
        :key="day"
        :label="day"
        :value="day"
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
    id: {
      type: String,
      required: true
    }
  },
  components: {
    Vue3ChartJs,
  },
  setup (props) {
    const apiUrl = process.env.VUE_APP_API_URL;
    const chartRef = ref(null)
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
    const numberOfDays = [
      30,
      60,
      90,
      365
    ]
    const selectedNumberOfDays = ref('30')
    let coin = reactive({})
  
    const getCoinData = () => {
      // todo break up the props into individual variables
      // const url = `${apiUrl}/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=7`
      axios.get(`${apiUrl}/coins/${props.id}`)
      .then(response => {
        console.log(response)
        // coin = response.data
        Object.assign(coin, response.data)
      })
    }

    const getChartData = () => {
      // todo: break the following variable into individual variables
      // const url = `${apiUrl}coins/${props.id}/market_chart?vs_currency=usd&days=14&interval=7`
      const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedNumberOfDays.value}&interval=daily`
      axios.get(url)
      .then(response => {
        console.log(response)
        lineChart.data.datasets[0].data = response.data.prices.map(price => {
          return price[1]
        })
        // const selectedPeriodObject = timePeriods.value.find(period => {
        //   console.log(period.period_id === selectedTimePeriod.value)
        //   return period.period_id === selectedTimePeriod.value
        // })

        // const timesToShowMinutes = ['minute', 'hour']

        // const timeFormat = timesToShowMinutes.includes(selectedPeriodObject.unit_name) ? 'MM/DD HH:mm' : 'MM/DD'
        const timeFormat = 'MM/DD'
        lineChart.data.labels = response.data.prices.map(price => {
          return dayjs(price[0]).format(timeFormat) 
        })
        chartRef.value.update(250)
      })
    }

    // const getTimePeriods = () => {
    //   // todo: move into store
    //   axios.get(`${apiUrl}/v1/ohlcv/periods`)
    //   .then(response => {
    //     timePeriods.value = response.data
    //   })
    // }
    
    onMounted(() => {
      // getTimePeriods()
      getCoinData()
      getChartData()
    })
    return {
      chartRef,
      coin,
      getChartData,
      lineChart,
      selectedNumberOfDays,
      numberOfDays
    }
  }
}
</script>

<style scoped>
</style>
