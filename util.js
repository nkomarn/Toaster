class Util {
    formatCommas(s) {
        return s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

module.exports = Util