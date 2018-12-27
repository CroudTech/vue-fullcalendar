# vue-fullcalendar
[![npm version](https://badge.fury.io/js/vue-full-calendar.svg)](https://badge.fury.io/js/vue-full-calendar)
[![Build Status](https://travis-ci.org/CroudSupport/vue-fullcalendar.svg?branch=master)](https://travis-ci.org/CroudSupport/vue-fullcalendar)


## Installation
```
npm install --save vue-full-calendar
```
Or for Vue 1.x users
```
npm install --save vue-full-calendar@0.0.3
```

Installing the plugin will globally add the `full-calendar` component to your project.

```js
//main.js
import FullCalendar from 'vue-full-calendar'
Vue.use(FullCalendar)
```

But you can also import the standalone component to add locally or for more complex installations.

```js
// foo.vue
import { FullCalendar } from 'vue-full-calendar'
export default {
  components: {
    FullCalendar,
  },
}
```

### jQuery

Please note that fullcalendar depends on jQuery, but you won't need to add it to your project manually, fullcalendar will handle this for you automatically if jQuery is not detected.

### CSS
As of version 2.0, we have removed the automatic import of the fullcalendar.css, you will need to explicitly import this css file in your project.
```js
import 'fullcalendar/dist/fullcalendar.css'
```

## Example App
I have created a simple Vue 2 webpack application as an example/playground
https://github.com/BrockReece/vue-fullcalendar-example

or try out this [Code Sandbox](https://codesandbox.io/s/5xlp873rkl)

### Scheduler
For those wanting to use the scheduler plugin, this [Code Sandbox](https://codesandbox.io/s/qlp8jvko3j) shows you a full working example. 

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

## Custom Config
You can pass any custom [options](https://fullcalendar.io/docs/) through to fullcalendar by using the `config` prop, this includes extra event handlers.
```html
<full-calendar :events="events" :config="config" />
...
<script>
...
  data() {
    return {
      events: [],
      config: {
        weekends: false,
        drop(...args) {
          //handle drop logic in parent
        },
      },
    }
  },
...
</script>
```

## Locale
You can set the language of your calendar by importing the corresponding locale file and setting the `locale` key in the config prop. For example, to set up the Calendar in French...

```html
<full-calendar :events="events" :config="config" />
...
<script>
import 'fullcalendar/dist/locale/fr'
...
  data() {
    return {
      events: [],
      config: {
        locale: 'fr',
      },
    }
  },
...
</script>
```
[Code Sandbox](https://codesandbox.io/s/8yl1xwk388)

*Note: You won't need to set the locale config key if your app only imports a single locale file*

## Further Props
You can edit the look and feel of fullcalendar by passing through extra props. These all have sensible defaults

- __header__ - [obj] - [docs](http://fullcalendar.io/docs/display/header/)
- __defaultView__ - ['agendaWeek'] - [docs](http://fullcalendar.io/docs/views/defaultView/)
- __editable__ - [true] - [docs](http://fullcalendar.io/docs/event_ui/editable/)
- __selectable__ - [true] -  [docs](http://fullcalendar.io/docs/selection/selectable/)
- __selectHelper__ - [true] - [docs](http://fullcalendar.io/docs/selection/selectHelper/)
- __config__ - [true] - Pass your own custom config straight through to fullcalendar

## Methods 
Sometimes you may need to manipulate the Calendar from your parent component, you can use `fireMethod` for this. This works with anything in the [Fullcalendar docs](https://fullcalendar.io/docs/) suffixed with `(method)` and it will dynamically handle as many arguments as needed.
```html
<full-calendar :events="events" ref="calendar" />
...
<script>
...
  data() {
    return {
      events: [],
    }
  },
  
  methods: {
    next() {
      this.$refs.calendar.fireMethod('next')
    },
    changeView(view) {
      this.$refs.calendar.fireMethod('changeView', view)
    },
  },
...
</script>
```

## Events and Hooks

### Emitted
- __event-selected(event, jsEvent, view)__ - Triggered on eventClick()
- __event-mouseover(event, jsEvent, view)__ - Triggered on eventMouseover()
- __event-mouseout(event, jsEvent, view)__ - Triggered on eventMouseout()
- __event-drop(event)__ - Triggered on eventDrop()
- __event-resize(event)__ - Triggered on eventResize()
- __event-created(event)__ - Triggered on select()
- __event-receive(event)__ - Triggered on eventReceive()
- __event-render(event)__ - Triggered on eventRender()
- __view-render(view, element)__ - Triggered on viewRender()
- __day-click(date, jsEvent, view)__ - Triggered on dayClick()

You can listen for these events using the following markup

```html
<full-calendar :event-sources="eventSources" @event-selected="eventSelected"></full-calendar>
```
### Listens on
- __render-event(event)__ - Adds a new event to calendar
- __remove-event(event)__ - Removes event from calendar
- __rerender-events()__ - Rerenders events to reflect local changes
- __refetch-events()__ - Makes another JSON call to event sources
- __reload-events()__ - Removes all events and adds all events in this.events

You can trigger these events in the parent component like so...

```html
<full-calendar ref="calendar" :event-sources="eventSources"></full-calendar>
...
<script>
...
  methods: {
    refreshEvents() {
      this.$refs.calendar.$emit('refetch-events')
    },
  }
...
</script>
```
