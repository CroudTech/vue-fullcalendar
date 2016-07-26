var FullCalendar = require('./components/FullCalendar.vue');

module.exports = {
    install: function (Vue, options) {
        Vue.component('full-calendar', FullCalendar);
    },
}
