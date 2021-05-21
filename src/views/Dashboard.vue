<template>
    <h1>Dashboard</h1>
    
    <ul v-if="listings.length">
      <li 
        v-for="coin in listings"
        :key="coin.id"
      >
      <router-link
        :to="{ name: 'Listing', params: { symbol: coin.symbol_id },}"
      >
        {{ coin.asset_id_base}}
      </router-link>
      </li>
    </ul>
    <span v-else>Loading</span>
</template>

<script>
import { onMounted } from 'vue'
import axios from 'axios';
 import { ref } from 'vue'

export default {
  name: 'Dashboard',
  setup () {
    let listings = ref([])
    const getCoinListings = () => {
      const apiUrl = process.env.VUE_APP_API_URL;
      const exchange = 'GEMINI' // You have to use the GEMINI exchange in the sandbox enviornment
      // const exchange = 'KRAKEN'
      axios.get(`${apiUrl}/v1/symbols?filter_exchange_id=${exchange}&filter_asset_id=USD`)
        .then(response => {
          listings.value = response.data.splice(0, 50)
        })
    }
    onMounted(() => {
      getCoinListings()
    })
    return {
      listings
    }
  }
}
</script>

<style scoped>
</style>
