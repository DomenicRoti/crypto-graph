<template>
    <h1>Dashboard</h1>
    
    <table v-if="coins.length">
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>% Change</th>
      </tr>
      <tr 
        v-for="coin in coins"
        :key="coin.id"
        class="coin-row"
      >
        <td>
          <router-link
            :to="{ name: 'Listing', params: { id: coin.id },}"
          >
            <div class="flex">
              <img :src="coin.image" />
              <span class="flex name">
                <span>{{ coin.name}}</span>
                <span>{{ Formatting.uppercase(coin.symbol) }}</span>
              </span>
              
            </div>
          </router-link>
        </td>
        <td>
          {{Formatting.formatDollar(coin.current_price)}}
        </td>
        <td>
          {{coin.price_change_percentage_24h}}%
        </td>
      </tr>
    </table>
    <span v-else>Loading</span>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Formatting from '@/utils/formatting'

export default {
  name: 'Dashboard',
  setup () {
    const store = useStore()
    return {
      coins: computed(() => store.state.coins.coins),
      Formatting
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    margin: auto;
  }
  td {
    padding-bottom: 15px;
    padding-right: 15px;
  }
  td, th {
    text-align: left;
  }
  .coin-row {
    color: $cg-black;
    
    .flex {
      flex-direction: row;
      align-items: center;
    }

    .name {
      flex-direction: column;
      flex-grow: 1;
    }

    img {
      max-width: 50px;
      margin-right: 16px;
    }
  }
</style>
