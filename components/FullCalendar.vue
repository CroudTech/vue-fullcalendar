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
        },
        data() {
            return {
                ready: false,
            }
        },
        ready() {
            const cal = $(this.$els.calendar),
                self = this

            $(this.$els.calendar).fullCalendar({
                header: {
                    left:   'prev,next today',
                    center: 'title',
                    right:  'month,agendaWeek,agendaDay'
                },
                defaultView: 'agendaWeek',
                editable: true,
                selectable: true,
                selectHelper: true,
                aspectRatio: 2,
                timeFormat: 'HH:mm',
                events: self.events,
                eventAfterAllRender() {
                    self.ready = true
                },

                eventRender(event, element) {
                    self.events = cal.fullCalendar('clientEvents')
                },

                eventDestroy(event) {
                    self.events = cal.fullCalendar('clientEvents')
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
                $(this.$els.calendar).fullCalendar('removeEvents', event._id)
            },
        },
    }
</script>
