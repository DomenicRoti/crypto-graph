<template>
    <h1>Dashboard</h1>
    
    <ul v-if="coins.length">
      <li 
        v-for="coin in coins"
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
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup () {
    const store = useStore()
    return {
      coins: computed(() => store.state.coins.coins),
    }
  }
}
</script>

<style scoped>
</style>
