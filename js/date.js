$(document).ready(function() {
    $.ajax({
        url: "https://ifc.cfapps.io/ifcdate"
    }).then(function(data) {
        $('#date').append(data.day + ", " + data.month + " " + data.date + " " + data.year + " ");

    });
});