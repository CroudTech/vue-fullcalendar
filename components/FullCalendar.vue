<template>
    <div ref="calendar" id="calendar"></div>
</template>

<script>
    import _ from 'lodash'
    import 'fullcalendar'

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

                    eventRender(event, element, view) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                        self.$emit('event-render', event, element, view)
                    },

                    eventDestroy(event) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                    },

                    eventClick(event, jsEvent, view) {
                        self.$emit('event-selected', event, jsEvent, view)
                    },

                    eventDrop(event) {
                        self.$emit('event-drop', event)
                    },

                    eventResize(event) {
                        self.$emit('event-resize', event)
                    },

                    dayClick(date, jsEvent, view){
                      self.$emit('day-click', date, jsEvent, view)
                    },

                    select(start, end, jsEvent) {
                        self.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                        })
                    },
                }
            },
        },

        mounted() {
            const cal = $(this.$el),
                self = this

            this.$on('remove-event', (event) => {
                $(this.$el).fullCalendar('removeEvents', event.id)
            })

            this.$on('rerender-events', () => {
                $(this.$el).fullCalendar('rerenderEvents')
            })

            this.$on('refetch-events', () => {
                $(this.$el).fullCalendar('refetchEvents')
            })

            this.$on('render-event', (event) => {
                $(this.$el).fullCalendar('renderEvent', event)
            })

            this.$on('reload-events', () => {
                $(this.$el).fullCalendar('removeEvents')
                $(this.$el).fullCalendar('addEventSource', this.events)
            })

            this.$on('rebuild-sources', () => {
                $(this.$el).fullCalendar('removeEvents')
                this.eventSources.map(event => {
                    $(this.$el).fullCalendar('addEventSource', event)
                })
            })

            cal.fullCalendar(_.defaultsDeep(this.config, this.defaultConfig))
        },

        methods: {
            fireMethod(...options) {
                $(this.$el).fullCalendar(...options)
            },
        },

        watch: {
            events: {
                deep: true,
                handler(val) {
                    $(this.$el).fullCalendar('removeEvents')
                    $(this.$el).fullCalendar('addEventSource', this.events)
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
