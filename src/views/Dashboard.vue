<template>
    <h1>Dashboard</h1>
    <coin-market-cap-graph />
    <coin-table />
</template>

<script>
import CoinTable from '@/components/CoinTable';
import CoinMarketCapGraph from '@/components/CoinMarketCapGraph';

export default {
  name: 'Dashboard',
  components: {
    CoinMarketCapGraph,
    CoinTable,
  },
};
</script>
