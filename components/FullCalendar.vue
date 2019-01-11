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

            selectMirror: {
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
                    selectMirror: this.selectMirror,
                    aspectRatio: 2,
                    timeFormat: 'HH:mm',
                    events: this.events,
                    eventSources: this.eventSources,

                    eventRender(...args) {
                        if (this.sync) {
                            self.events = self.calendar.getEvents()
                        }
                        self.$emit('event-render', ...args)
                    },

                    eventDestroy(event) {
                        if (this.sync) {
                            self.events = self.calendar.getEvents()
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

                    dateClick(...args){
                        self.$emit('date-click', ...args)
                    },
                    select(info) {
                        self.$emit('event-created', info)
                    }
                }
            },
        },

        mounted() {
            const cal = this.$el

            this.$on('remove-event', (event) => {
                if(event && event.id){
                    let eventObj = this.calendar.getEventById(event.id);
                    eventObj.remove();
                }
            })

            this.$on('rerender-events', () => {
                this.calendar.rerenderEvents()
            })

            this.$on('refetch-events', () => {
                this.calendar.refetchEvents()
            })

            this.$on('add-event', (event) => {
                this.calendar.addEvent(event)
            })

            this.$on('reload-events', (events) => {
                events = events || this.events
                this.removeEvents();
                this.calendar.addEventSource(events)
            })

            this.$on('rebuild-sources', () => {
                this.removeEvents();
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
            removeEvents() {
                this.calendar.batchRendering(() => {
                    this.events.forEach(event => {
                        let eventObj = this.calendar.getEventById(event.id)
                        eventObj.remove()
                    });
                });
            }
        },

        watch: {
            events: {
                deep: true,
                handler(val) {
                    this.removeEvents()
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
