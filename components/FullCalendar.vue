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
                eventRender(event, element) {
                    self.events = cal.fullCalendar('clientEvents')
                },

                eventDestroy(event) {
                    self.events = cal.fullCalendar('clientEvents')
                },

                eventClick(event) {
                    //cal.fullCalendar('removeEvents', event._id)
                    self.$dispatch('event-selected', event)
                },

                select(start, end, jsEvent) {
                    cal.fullCalendar('renderEvent', {
                        title: 'Available',
                        start,
                        end,
                    }, true)
                },
            })
        }
    }
</script>

