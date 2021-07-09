<template>
    <h1>Dashboard</h1>
    
    <ul v-if="listings.length">
      <li 
        v-for="coin in listings"
        :key="coin.id"
      >
      <router-link
        :to="{ name: 'Listing', params: { id: coin.id },}"
      >
        {{ coin.name}}
        <img :src="coin.image" />
        Market Cap: {{ coin.market_cap }}
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
      // todo break the next line up into an array of params
      axios.get(`${apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        .then(response => {
          listings.value = response.data
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
