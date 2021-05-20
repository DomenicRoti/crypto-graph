<template>
    <h1>Coin</h1>
    <pre>{{ coin }}</pre>
    <pre>{{ historicalData }}</pre>
</template>

<script>
import { onMounted } from 'vue'
import axios from 'axios';
import { reactive } from 'vue'

export default {
  name: 'Listing',
  props: {
    symbol: {
      type: Number,
      required: true
    }
  },
  setup (props) {
    console.log(props)
    let coin = reactive({})
    let historicalData = reactive({})
    const getCoinData = () => {
      const apiUrl = process.env.VUE_APP_API_URL;

      return axios.get(`${apiUrl}/v1/ohlcv/${props.symbol}/latest?period_id=1MTH`)
        .then(response => {
          // console.log(response.data)
          historicalData.value = response.data
        })
    }
    onMounted(() => {
      getCoinData()
    })
    return {
      getCoinData,
      coin,
      historicalData
    }
  }
}
</script>

<style scoped>
</style>
