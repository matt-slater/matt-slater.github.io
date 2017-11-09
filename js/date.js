$(document).ready(function() {
    $.ajax({
        url: "http://34.237.46.112/ifcdate"
    }).then(function(data) {
        $('#date').append(data.day + ", " + data.month + " " + data.date + " " + data.year + " ");

    });
});