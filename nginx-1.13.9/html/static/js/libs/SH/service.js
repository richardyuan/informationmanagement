jQuery(function ($) {
    $.sensors = [];
});

(function ($) {
    $.fn.extend({
        registerSensor: function (id, callback) {
            $.sensors[id] = callback;
        },
        runSensor: function (callbackUrl, id, parameters, target) {
            var data;

            if ($.sensors[id] != null && typeof $.sensors[id] == 'function') {
                data = $.sensors[id].call(this, parameters, target);
            } else {
                console.error('sensor [' + id + '] not registered');
            }

            $.fn.sensorCallback(callbackUrl, data, target);
        },
        sensorCallback: function (callbackUrl, data, target) {
            $.post(callbackUrl, data, function (responseTxt, status, data) {
                var response = jQuery.parseJSON(responseTxt);
                $.fn.handleServiceResponse(response, status, null, target)
            });
        },
        prepElement: function () {
            if (this.length > 0) {
                $(this).addClass("last");
                $(this).find("input:first").focus();
            }
        },
        startService: function(container, service){
            $(container).empty();
            $.ajax({
                type: 'GET',
                url: SH_CONTEXT + 'organizations/' + SH_ORGANIZATION + '/services/' + service + '.html',
                success: function (response, textStatus, jqXHR) {
                    if (response.success === true) {
                        $(container).html(response.data.html);
                        $(container).prepElement();
                    } else {
                        $(container).html(response.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                        // not authenticated. reload the page
                        location.reload(true);
                    } else {
                        $(container).html(errorThrown);
                    }
                },
                dataType: 'json'
            });
        },
        callNext: function(service, action, data){
            var url = [
                SH_CONTEXT,
                'async/',
                SH_ORGANIZATION,
                "/",
                service,
                "/next/",
                action,
                ".html"
            ].join("");

            $.ajax({
                type: 'POST',
                url: url,
                success: $.fn.handleServiceResponse,
                error: $.fn.handleServiceError,
                dataType: 'json',
                data: data
            });
        },
        callGoto:function(service, activityId, data, target){
            var url = [
                SH_CONTEXT,
                "organizations/",
                SH_ORGANIZATION,
                "/services/",
                service,
                "/goto/",
                activityId,
                ".html"
            ].join("");

            $.ajax({
                type: 'POST',
                url: url,
                data:data,
                success: function (data, textStatus, jqXHR) {
                    $.fn.handleServiceResponse(data, textStatus, null, target);
                },
                error: $.fn.handleServiceError,
                dataType: 'json',
            });
        },
        handleServiceResponse: function (response, status, options, target) {
            /* enable start/again buttons */
            if (response.success === true) {
                /* append or replace */
                if (response.services ) {
                    $.each(response.services, function (index, service) {
                        if (service.sensor) {
                            $.fn.runSensor(service.sensor.callback, service.sensor.id, service.sensor.parameters, target);
                        } else {
                            $('[data-service="' + service.name + '"] div.activityStack').html(service.html);
                        }
                    });
                } else if (response.data){
                    $(target).find("div.activityWrapper._removeme").remove();
                    $(target).find("div.activityWrapper.unfinished").remove();
                    $(target).find("div.activityWrapper.last").removeClass("last");
                    $(target).find("div.activityStack").append(response.data.html);
                    $(target).find("div.activityWrapper:not(.finished):last").prepElement();
                }
                if (response.reset === true) {
                    // initialize new request
                    $.ajax({
                        type: 'POST',
                        url: SH_CONTEXT + 'async.html',
                        success: function (response, textStatus, jqXHR) {
                            $.fn.handleServiceResponse(response);
                        },
                        dataType: 'json'
                    });
                }
            } else {
                if (response.detail) {
                    alert(response.message + '<pre>' + response.detail + '</pre>');
                } else {
                    alert(response.message);
                    console.log(response);
                }
            }
            //fix for disabled forms on reload
            var form = $('[data-service] form');
            if (form.length) {
                $(form).parents('[data-service]').find("div.activityWrapper:last :input").not(":file").attr('disabled', false).removeClass('disabled');
            }
        },
        beforeSubmit: function (data, form, options) {
            $(form).validate();
            if (!$(form).valid()) {
                return false;
            }

            var serviceDiv = $(form).parents('[data-service]');
            /* disable all inputs while request is pending */
            $(serviceDiv).find("div.activityWrapper:last :input").not(":file").attr('disabled', true).addClass('disabled');
            return true;
        },
        handleServiceError: function (jqXHR, textStatus, errorThrown) {
            location.reload(true);
        }
    });
})(jQuery);


$.xhrPool = [];
$.xhrPool.abortAll = function () {
    $(this).each(function (idx, jqXHR) {
        jqXHR.abort();
    });
    $.xhrPool.length = 0
};

$.ajaxSetup({
    cache: false,
    beforeSend: function (jqXHR, options) {
        if (options.crossDomain === false) {
            var token = $("meta[name='_csrf']").attr("content"),
                header = $("meta[name='_csrf_header']").attr("content");
            jqXHR.setRequestHeader(header, token);
        }
        $.xhrPool.push(jqXHR);
    },
    complete: function (jqXHR) {
        var index = $.xhrPool.indexOf(jqXHR);
        if (index > -1) {
            $.xhrPool.splice(index, 1);
        }
    }
});

$(document).ready(
    function () {
        $(document).on("submit", "[data-service] form", function (event) {
            var target = $(event.target).parents('[data-service]');
            $(this).ajaxSubmit({
                dataType: 'json',
                beforeSubmit: $.fn.beforeSubmit,
                success: function (data, textStatus, jqXHR) {
                    $.fn.handleServiceResponse(data, textStatus, null, target);
                },
                error: $.fn.handleServiceError
            });

            return false;
        });

        $(document).on("click", "[data-service] [goto]", function(event){
            event.stopImmediatePropagation();
            var data = $(this).data();
            var value = $(this).attr("value");
            var go_to = $(this).attr("goto");

            if (go_to.includes(":")) {
                var parts = go_to.split(":");
                var service = parts[0];
                var activityId = parts[1];

                if (value) {
                    data[$(this).attr("name")] = value;
                }

                $.fn.callGoto(service, activityId,data, $(event.target).parents('[data-service]'));
                return false;
            }
        });

        $(document).on("click", "[data-service] input[type=button], [data-service] button", function (event) {
            var data = $(this).data();
            var value = $(this).attr("value");
            var service = $(this).parents('[data-service]').attr("data-service");

            if (value) {
                data[$(this).attr("name")] = value;
            }

            $.fn.callNext(service, $(this).attr("name"), data);

            return false;
        });

        $('[data-service]').each(function () {
            var container = this,service = $(this).attr('data-service');
            $.fn.startService(container, service);

        });


        $.ajax({
            type: 'POST',
            url: SH_CONTEXT + 'async.html',
            success: function (response, textStatus, jqXHR) {
                $.fn.handleServiceResponse(response);
            },
            dataType: 'json'
        });
    });