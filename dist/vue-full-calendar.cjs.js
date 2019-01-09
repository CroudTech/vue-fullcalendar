'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var defaultsDeep = _interopDefault(require('lodash.defaultsdeep'));

var FullCalendar = require('fullcalendar/dist/fullcalendar');

var FullCalendar$1 = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "calendar", attrs: { "id": "calendar" } });
    }, staticRenderFns: [],
    props: {
        events: {
            default: function _default() {
                return [];
            }
        },

        eventSources: {
            default: function _default() {
                return [];
            }
        },

        editable: {
            default: function _default() {
                return true;
            }
        },

        selectable: {
            default: function _default() {
                return true;
            }
        },

        selectMirror: {
            default: function _default() {
                return true;
            }
        },

        header: {
            default: function _default() {
                return {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                };
            }
        },

        defaultView: {
            default: function _default() {
                return 'agendaWeek';
            }
        },

        sync: {
            default: function _default() {
                return false;
            }
        },

        config: {
            type: Object,
            default: function _default() {
                return {};
            }
        }
    },

    data: function data() {
        return {
            calendar: null
        };
    },


    computed: {
        defaultConfig: function defaultConfig() {
            var self = this;
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

                eventRender: function eventRender() {
                    if (this.sync) {
                        self.events = self.calendar.getEvents();
                    }

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    self.$emit.apply(self, ['event-render'].concat(_toConsumableArray(args)));
                },
                eventDestroy: function eventDestroy(event) {
                    if (this.sync) {
                        self.events = self.calendar.getEvents();
                    }
                },
                eventClick: function eventClick() {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    self.$emit.apply(self, ['event-selected'].concat(_toConsumableArray(args)));
                },
                eventDrop: function eventDrop() {
                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    self.$emit.apply(self, ['event-drop'].concat(_toConsumableArray(args)));
                },
                eventReceive: function eventReceive() {
                    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = arguments[_key4];
                    }

                    self.$emit.apply(self, ['event-receive'].concat(_toConsumableArray(args)));
                },
                eventResize: function eventResize() {
                    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        args[_key5] = arguments[_key5];
                    }

                    self.$emit.apply(self, ['event-resize'].concat(_toConsumableArray(args)));
                },
                dateClick: function dateClick() {
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    self.$emit.apply(self, ['date-click'].concat(_toConsumableArray(args)));
                },
                select: function select(info) {
                    self.$emit('event-created', {
                        start: info.start,
                        end: info.end,
                        allDay: !info.start.hasTime() && !info.end.hasTime(),
                        view: info.view,
                        resource: info.resource
                    });
                }
            };
        }
    },

    mounted: function mounted() {
        var _this = this;

        var cal = this.$el;

        this.$on('remove-event', function (event) {
            if (event && event.hasOwnProperty('id')) {
                var eventObj = _this.calendar.getEventById(event.id);
                eventObj.remove();
            }
        });

        this.$on('rerender-events', function () {
            _this.calendar.rerenderEvents();
        });

        this.$on('refetch-events', function () {
            _this.calendar.refetchEvents();
        });

        this.$on('add-event', function (event) {
            _this.calendar.addEvent(event);
        });

        this.$on('reload-events', function (events) {
            events = events || _this.events;
            _this.removeEvents();
            _this.calendar.addEventSource(events);
        });

        this.$on('rebuild-sources', function () {
            _this.removeEvents();
            _this.eventSources.map(function (event) {
                _this.calendar.addEventSource(event);
            });
        });

        this.calendar = new FullCalendar.Calendar(cal, defaultsDeep(this.config, this.defaultConfig));
        this.calendar.render();
    },


    methods: {
        fireMethod: function fireMethod() {
            var _calendar;

            for (var _len7 = arguments.length, options = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                options[_key7] = arguments[_key7];
            }

            return (_calendar = this.calendar)[options.shift()].apply(_calendar, _toConsumableArray(options));
        },
        removeEvents: function removeEvents() {
            var _this2 = this;

            this.calendar.batchRendering(function () {
                _this2.events.forEach(function (event) {
                    var eventObj = _this2.calendar.getEventById(event.id);
                    eventObj.remove();
                });
            });
        }
    },

    watch: {
        events: {
            deep: true,
            handler: function handler(val) {
                this.removeEvents();
                this.calendar.addEventSource(this.events);
            }
        },
        eventSources: {
            deep: true,
            handler: function handler(val) {
                this.$emit('rebuild-sources');
            }
        }
    },

    beforeDestroy: function beforeDestroy() {
        this.$off('remove-event');
        this.$off('rerender-events');
        this.$off('refetch-events');
        this.$off('render-event');
        this.$off('reload-events');
        this.$off('rebuild-sources');
    }
};

var index = {
    install: function install(Vue, options) {
        Vue.component('full-calendar', FullCalendar$1);
    }
};

exports['default'] = index;
exports.FullCalendar = FullCalendar$1;
