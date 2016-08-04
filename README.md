# vue-fullcalendar

## Installation

```
npm install --save vue-full-calendar
```

and use in your project

```js
Vue.use(require('vue-full-calendar'))
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

## Event Sources

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


