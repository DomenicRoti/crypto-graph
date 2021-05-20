<template>
    <h1>Dashboard</h1>
    
    <ul v-if="listings.length">
      <li 
        v-for="coin in listings"
        :key="coin.id"
      >
      <router-link
        :to="{ name: 'Listing', params: { symbol: coin.symbol },}"
      >
        {{ coin.symbol}}
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
      return axios.get(`${apiUrl}/listings`)
        .then(response => {
          console.log('test')
          listings.value = response.data.data
        })
    }
    onMounted(() => {
      getCoinListings()
    })
    return {
      getCoinListings,
      listings
    }
  }
}
</script>

<style scoped>
</style>
