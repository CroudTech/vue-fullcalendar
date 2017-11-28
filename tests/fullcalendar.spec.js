import Vue from 'vue/dist/vue'
import VueFullCalendar from '../index'
import moment from 'moment'

import { FullCalendar } from '../index'

Vue.use(VueFullCalendar)
Vue.component('cal', FullCalendar)

window.jQuery = window.$ = require('jquery')

const events = jest.fn()
const vm = new Vue({
    template: '<full-calendar ref="calendar" :event-sources="eventSources" :config="config"></full-calendar>',
    data() {
        return {
            eventSources: [
                {
                    events,
                },
                {
                    events(start, end, timezone, callback) {
                        callback([
                            {
                                title: 'test',
                                start: moment().startOf('isoWeek'),
                                end: moment().startOf('isoWeek').add(1, 'day'),
                                allDay: true,
                            }
                        ])
                    },
                },
            ],
            config: {
                weekends: false,
            },
        }
    },
}).$mount();

describe('VueFullCalendar', () => {
    describe('installing plugin', () => {
        it('load component', () => {
            expect(typeof Vue.options.components['full-calendar']).toEqual('function')
        })

        it('export standalone component', () => {
            expect(typeof Vue.options.components['cal']).toEqual('function')
            expect(Vue.options.components['cal']).toEqual(Vue.options.components['full-calendar'])
        })
    })

    describe('handle eventSources', () => {
        it('should call callback', () => {
            vm.$refs.calendar.fireMethod('fetchEvents', moment(), moment().add(7, 'd'))
            expect(events).toBeCalled()
        })

        it('should add events to calendar', () => {
            expect(vm.$refs.calendar.fireMethod('clientEvents').length).toEqual(1)            
        })
    })

    describe('handle firemethod', () => {
        it('should be transparent', () => {
            expect($(vm.$refs.calendar.$el).fullCalendar('getDate')).toEqual(vm.$refs.calendar.fireMethod('getDate'))
        })
        
        it('should set current view', () => {
            vm.$refs.calendar.fireMethod('changeView', 'agendaDay')
            expect($(vm.$refs.calendar.$el).fullCalendar('getView').name).toEqual('agendaDay')
        })
    })

    describe('handle custom config', () => {
        it('should have set weekends options', () => {
            expect($(vm.$refs.calendar.$el).fullCalendar('option', 'weekends')).toEqual(false)
        })
    })
})