/**
 * Utility file for formatting values
* @exports utils/formatting
* @category Utils
*/
export default {
  formatDollar (value) {
    return '$' + value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  },
  uppercase (value) {
    return value.toUpperCase()
  }
}
