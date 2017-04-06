var items, item, red, green, blue, yellow;
red = "240, 128, 128";
blue = "128, 184, 240";
green = "176, 187, 85";
yellow = "246, 235, 97";

items = [red, blue, green, yellow];
item = items[Math.floor(Math.random() * items.length)];
$(function () {

    $("body").css(
        "background-image", "linear-gradient(rgba(" + item + ", 0.89), rgba(" + item + ", .95)), url(/assets/img/sunflower.jpg)"
    );

});
