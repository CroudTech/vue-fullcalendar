# vue-fullcalendar

## Installation

```
npm install --save vue-full-calendar
```

and use in your project

```js
Vue.use(require('vue-full-calendar'))
```
### jQuery

Please note that fullcalendar depends on jQuery, so it will need to be included in your project for this vue plugin to work

```js
window.jQuery = window.$ = require('jquery')
```

## Basic Usage

You can pass an array of fullclendar objects through the props

```html
<full-calendar :events="events"></full-calendar>
...
<script>
...
  data() {
    return {
      events: [
        {
            title  : 'event1',
            start  : '2010-01-01',
        },
        {
            title  : 'event2',
            start  : '2010-01-05',
            end    : '2010-01-07',
        },
        {
            title  : 'event3',
            start  : '2010-01-09T12:30:00',
            allDay : false,
        },
      ]
    }
  }
...
</script>
```
More event options can be found at http://fullcalendar.io/docs/event_data/Event_Object/

## Using a JSON Feed

```html
<full-calendar :event-sources="eventSources"></full-calendar>
...
<script>
...
  data() {
    return {
      eventSources: [
        {
          events(start, end, timezone, callback) {
            self.$http.get(`/myFeed`, {timezone: timezone}).then(response => {
              callback(response.data.data)
            })
          },
          color: 'yellow',
          textColor: 'black',
        },
        {
          events(start, end, timezone, callback) {
            self.$http.get(`/anotherFeed`, {timezone: self.timezone}).then(response => {
              callback(response.data.data)
            })
          },
          color: 'red',
        },
      ]
    }
  }
...
</script>
```

## Further Props
You can edit the look and feel of fullcalendar by passing through extra props. These all have sensible defaults

- __header__ - [obj] - [docs](http://fullcalendar.io/docs/display/header/)
- __defaultView__ - ['agendaWeek'] - [docs](http://fullcalendar.io/docs/views/defaultView/)
- __editable__ - [true] - [docs](http://fullcalendar.io/docs/event_ui/editable/)
- __selectable__ - [true] -  [docs](http://fullcalendar.io/docs/selection/selectable/)
- __selectHelper__ - [true] - [docs](http://fullcalendar.io/docs/selection/selectHelper/)

## Events and Hooks

### Dispatched
- __event-selected(event)__ - Triggered on eventClick()
- __event-drop(event)__ - Triggered on eventDrop()
- __event-resize(event)__ - Triggered on eventResize() 
- __event-created(event)__ - Triggered on select()

### Listens on
- __render-event(event)__ - Adds a new event to calendar
- __remove-event(event)__ - Removes event from calendar
- __rerender-events()__ - Rerenders events to reflect local changes
- __refetch-events()__ - Makes another JSON call to event sources 
