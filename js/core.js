var items, item, red, green, blue;
red = "240, 128, 128";
blue = "128, 184, 240";
green = "153, 255, 204";
items = [red, blue, green];
item = items[Math.floor(Math.random() * items.length)];
$(function () {

    $("body").css(
        "background-image", "linear-gradient(rgba(" + item + ", 0.89), rgba(" + item + ", .95)), url(/assets/img/sunflower.jpg)"
    );

});
