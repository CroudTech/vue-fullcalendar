'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var defaultsDeep = _interopDefault(require('lodash.defaultsdeep'));
require('fullcalendar');
var $ = _interopDefault(require('jquery'));

var FullCalendar = { render: function render() {
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

        selectHelper: {
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

    computed: {
        defaultConfig: function defaultConfig() {
            var self = this;
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

                eventRender: function eventRender() {
                    if (this.sync) {
                        self.events = cal.fullCalendar('clientEvents');
                    }

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    self.$emit.apply(self, ['event-render'].concat(_toConsumableArray(args)));
                },
                eventDestroy: function eventDestroy(event) {
                    if (this.sync) {
                        self.events = cal.fullCalendar('clientEvents');
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
                dayClick: function dayClick() {
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    self.$emit.apply(self, ['day-click'].concat(_toConsumableArray(args)));
                },
                select: function select(start, end, jsEvent, view, resource) {
                    self.$emit('event-created', {
                        start: start,
                        end: end,
                        allDay: !start.hasTime() && !end.hasTime(),
                        view: view,
                        resource: resource
                    });
                }
            };
        }
    },

    mounted: function mounted() {
        var _this = this;

        var cal = $(this.$el);

        this.$on('remove-event', function (event) {
            if (event && event.hasOwnProperty('id')) {
                $(_this.$el).fullCalendar('removeEvents', event.id);
            } else {
                $(_this.$el).fullCalendar('removeEvents', event);
            }
        });

        this.$on('rerender-events', function () {
            $(_this.$el).fullCalendar('rerenderEvents');
        });

        this.$on('refetch-events', function () {
            $(_this.$el).fullCalendar('refetchEvents');
        });

        this.$on('render-event', function (event) {
            $(_this.$el).fullCalendar('renderEvent', event);
        });

        this.$on('reload-events', function () {
            $(_this.$el).fullCalendar('removeEvents');
            $(_this.$el).fullCalendar('addEventSource', _this.events);
        });

        this.$on('rebuild-sources', function () {
            $(_this.$el).fullCalendar('removeEventSources');
            _this.eventSources.map(function (event) {
                $(_this.$el).fullCalendar('addEventSource', event);
            });
        });

        cal.fullCalendar(defaultsDeep(this.config, this.defaultConfig));
    },


    methods: {
        fireMethod: function fireMethod() {
            var _$;

            return (_$ = $(this.$el)).fullCalendar.apply(_$, arguments);
        }
    },

    watch: {
        events: {
            deep: true,
            handler: function handler(val) {
                $(this.$el).fullCalendar('removeEvents');
                $(this.$el).fullCalendar('addEventSource', this.events);
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
        Vue.component('full-calendar', FullCalendar);
    }
};

exports['default'] = index;
exports.FullCalendar = FullCalendar;
