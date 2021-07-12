/**
 * Utility file for formatting values
* @exports utils/formatting
* @category Utils
*/
export default {
  formatDollar (value) {
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
