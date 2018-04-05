var app = angular.module("ts", ["ngRoute", 'ui.utils','datatables','datatables.buttons', 'chart.js'])
            .run(function($location) {
				$location.path('/data/');
                bootstrap.init();
            });

var ts = {

    toArray: function ( x ) {
        if (!Array.isArray(x) && x !== undefined ) {
            dataObject = $.extend(true, {}, x)
            x = [];
            x.push(dataObject);
        }
        return x;
    },
    formatDate: function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    },
    formatDateForDatepicker: function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        
        return [day, month, year].join('/');
    }
};