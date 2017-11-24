import FullCalendar from './components/FullCalendar.vue'

export default {
    install: function (Vue, options) {
        Vue.component('full-calendar', FullCalendar);
    },
}
export { FullCalendar }
