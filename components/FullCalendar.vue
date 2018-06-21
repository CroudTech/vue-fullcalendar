<template>
    <div ref="calendar" id="calendar"></div>
</template>

<script>
    import defaultsDeep from 'lodash.defaultsdeep'
    const FullCalendar = require('fullcalendar/dist/fullcalendar')

    export default {
        props: {
            events: {
                default() {
                    return []
                },
            },

            eventSources: {
                default() {
                    return []
                },
            },

            editable: {
                default() {
                    return true
                },
            },

            selectable: {
                default() {
                    return true
                },
            },

            selectHelper: {
                default() {
                    return true
                },
            },

            header: {
                default() {
                    return {
                        left:   'prev,next today',
                        center: 'title',
                        right:  'month,agendaWeek,agendaDay'
                    }
                },
            },

            defaultView: {
                default() {
                    return 'agendaWeek'
                },
            },

            sync: {
                default() {
                    return false
                }
            },

            config: {
                type: Object,
                default() {
                    return {}
                },
            },
        },

        data() {
            return {
                calendar: null,
            }
        },

        computed: {
            defaultConfig() {
                const self = this
                return {
                    header: this.header,
                    defaultView: this.defaultView,
                    editable: this.editable,
                    selectable: this.selectable,
                    selectHelper: this.selectHelper,
                    aspectRatio: 2,
                    timeFormat: 'HH:mm',
                    events: this.events,
                    eventSources: this.eventSources,

                    eventRender(...args) {
                        if (this.sync) {
                            self.events = self.calendar.clientEvents()
                        }
                        self.$emit('event-render', ...args)
                    },

                    eventDestroy(event) {
                        if (this.sync) {
                            self.events = self.calendar.clientEvents()
                        }
                    },

                    eventClick(...args) {
                        self.$emit('event-selected', ...args)
                    },

                    eventDrop(...args) {
                        self.$emit('event-drop', ...args)
                    },

                    eventReceive(...args) {
                        self.$emit('event-receive', ...args)
                    },

                    eventResize(...args) {
                        self.$emit('event-resize', ...args)
                    },

                    dayClick(...args){
                        self.$emit('day-click', ...args)
                    },
                    select(start, end, jsEvent, view, resource) {
                        self.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                            view,
                            resource
                        })
                    }
                }
            },
        },

        mounted() {
            const cal = this.$el,
                self = this

            this.$on('remove-event', (event) => {
                if(event && event.hasOwnProperty('id')){
                    this.calendar.removeEvents(event.id);
                }else{
                    this.calendar.removeEvents(event);
                }
            })

            this.$on('rerender-events', () => {
                this.calendar.rerenderEvents()
            })

            this.$on('refetch-events', () => {
                this.calendar.refetchEvents()
            })

            this.$on('render-event', (event) => {
                this.calendar.renderEvent(event)
            })

            this.$on('reload-events', () => {
                this.calendar.removeEvents()
                this.calendar.addEventSource(this.events)
            })

            this.$on('rebuild-sources', () => {
                this.calendar.removeEventSources()
                this.eventSources.map(event => {
                    this.calendar.addEventSource(event)
                })
            })

            this.calendar = new FullCalendar.Calendar(cal, defaultsDeep(this.config, this.defaultConfig))
            this.calendar.render()
        },

        methods: {
            fireMethod(...options) {
                return this.calendar[options.shift()](...options)
            },
        },

        watch: {
            events: {
                deep: true,
                handler(val) {
                    this.calendar.removeEvents()
                    this.calendar.addEventSource(this.events)
                },
            },
            eventSources: {
                deep: true,
                handler(val) {
                    this.$emit('rebuild-sources')
                },
            },
        },

        beforeDestroy() {
            this.$off('remove-event')
            this.$off('rerender-events')
            this.$off('refetch-events')
            this.$off('render-event')
            this.$off('reload-events')
            this.$off('rebuild-sources')
        },
    }
</script>
