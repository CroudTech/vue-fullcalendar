<template>
    <div v-el:calendar id="calendar"></div>
</template>

<script>
    require('fullcalendar')

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
        },

        ready() {
            const cal = $(this.$els.calendar),
                self = this

            $(this.$els.calendar).fullCalendar({
                header: this.header,
                defaultView: this.defaultView,
                editable: this.editable,
                selectable: this.selectable,
                selectHelper: this.selectHelper,
                aspectRatio: 2,
                timeFormat: 'HH:mm',
                events: self.events,
                eventSources: self.eventSources,

                eventRender(event, element) {
                    if (this.sync) {
                        self.events = cal.fullCalendar('clientEvents')
                    }
                },

                eventDestroy(event) {
                    if (this.sync) {
                        self.events = cal.fullCalendar('clientEvents')
                    }
                },

                eventClick(event) {
                    self.$dispatch('event-selected', event)
                },

                eventDrop(event) {
                    self.$dispatch('event-drop', event)
                },

                eventResize(event) {
                    self.$dispatch('event-resize', event)
                },

                select(start, end, jsEvent) {
                    self.$dispatch('event-created', {
                        start,
                        end,
                        allDay: !start.hasTime() && !end.hasTime(),
                    })
                },
            })
        },

        watch: {
            events: {
                deep: true,
                handler(val) {
                    $(this.$els.calendar).fullCalendar('rerenderEvents')
                },
            }
        },

        events: {
            'remove-event'(event) {
                $(this.$els.calendar).fullCalendar('removeEvents', event.id)
            },
            'rerender-events'(event) {
                $(this.$els.calendar).fullCalendar('rerenderEvents')
            },
            'refetch-events'(event) {
                $(this.$els.calendar).fullCalendar('refetchEvents')
            },
            'render-event'(event) {
                $(this.$els.calendar).fullCalendar('renderEvent', event)
            },
            'reload-events'() {
                $(this.$els.calendar).fullCalendar('removeEvents')
                $(this.$els.calendar).fullCalendar('addEventSource', this.events)
            },
            'rebuild-sources'() {
                $(this.$els.calendar).fullCalendar('removeEvents')
                this.eventSources.map(event => {
                    $(this.$els.calendar).fullCalendar('addEventSource', event)
                })
            },
        },
    }
</script>
