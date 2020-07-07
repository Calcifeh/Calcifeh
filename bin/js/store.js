$(document).ready(function() {
    $('#navbar ul li a').pxgradient({
        step: 1,
        colors: ['#a66e53', '#7b6052'],
        dir: 'y'
    }).hover(function() {
        $(this).removeClass('sn-pxg');
        $(this).html($(this).children('.pxg-source').first().text());
        $(this).pxgradient({
            step: 1,
            colors: ['#d47018', '#ef9c1d'],
            dir: 'y'
        })
    }, function() {
        $(this).removeClass('sn-pxg');
        $(this).html($(this).children('.pxg-source').first().text());
        $(this).pxgradient({
            step: 1,
            colors: ['#a66e53', '#7b6052'],
            dir: 'y'
        })
    });
    $('#pbonline').pxgradient({
        step: 1,
        colors: ['#ffffff', '#b7b7b7'],
        dir: 'y'
    });
    $('.colbody h3').pxgradient({
        step: 1,
        colors: ['#bf9b52', '#997d45'],
        dir: 'y'
    });
});

(function($) {
    if(parseInt($("#outermain").height()) < 622) {
        $("#outermain").css("background", "none");
    }
})(jQuery);

var _ = new Neo({ history: false, prototypes: true });
var _body = _.select("body", "tag").first();
var categories = _.select("category", "class");
var _categories = _.select("items-category", "class");
var items = _.select("item", "class");
var basket = _.select("basket", "id");
var filled = _.select("basket_filled", "id");
var empty = _.select("basket_empty", "id");
var total_credits = _.select("total_credits", "id");
var products = _.select("products", "id");
var back = _.select(".items-category:not(.credits) .button", "query_all");
var purchase = _.select("purchase", "id");
var myCredits = _.select("my_credits", "id");
var title = _.select("newstitle", "class").first();
var search = _.select("search", "id");
var results = _.select("search_results", "id");
var container = _.select("search_container", "id");
var container2 = _.select("products_container", "id");

categories.call("bind", ["click", function(e) {

    var target = e.node;
    var category = target.attribute("data-category");
    var _category = _categories.filter(function(node) {
        return node.attribute("data-category") == category;
    }).first();

    if(_.isDefined(_category)) {
        products.addClass("hidden");
        _category.removeClass("hidden");
        title.inner("Products - "+target.select("name", "class").first().inner());
    }

}]);

if(_body.hasClass("logged-in") && _.isDefined(purchase)) {

    items.call("bind", ["click", function(e) {

        var target = e.node;
        var name = target.attribute("name");
        var credits = parseInt(target.attribute("data-credits"));
        var image = target.select("img", "tag").first();
        var hashCode = target.attribute("data-tip");

        var item = _.create("a").addClass("manstat");
        var left = _.create("div").addClass("manleft");
        var _image = _.create("img");

        _image.attribute("src", image.attribute("src"));
        item.attribute("data-tip", hashCode);
        item.attribute("data-credits", credits);
        item.append(document.createTextNode(name.ellipses(18)));
        item.attribute("href", "#").bind("click", removeItem);
        item.attribute("name", name.toLowerCase().replaceAll(" ", "_"));
        item.attribute("title", "Remove the "+name+" from your basket.");
        basket.append(item.append(left.append(_image)));

        empty.addClass("hidden");
        filled.removeClass("hidden");

        updateCredits(credits);

    }]);

}

back.call("bind", ["click", function(e) {

    e.preventDefault();

    _categories.call("addClass", ["hidden"]);
    products.removeClass("hidden");
    title.inner("Products");

}]);

if(_.isDefined(purchase)) {

    purchase.bind("click", function(e) {

        (e || window.event).preventDefault();

        var credits = parseInt(myCredits.inner());
        var total = parseInt(total_credits.inner());

        if(total > credits) {
            alert("You do not have enough credits to purchase this item(s).");
        } else {

            var inputs = basket.select("manstat", "class");
            var query = "?";

            if(inputs.size() <= 0) {
                alert("You do not have any items in your basket.");
                return;
            }

            inputs.each(function(input) {
                query += input.attribute("name") + "=" + input.attribute("data-tip") + "&";
            });

            _.ajax().call(document.location.origin + "/purchase" + query, function(request, data) {
                console.log(data);
                if(data == "EMPTY") {
                    alert("You do not have any items in your basket.");
                } else if(data == "INSUFFICIENT_CREDITS") {
                    alert("You do not have enough credits to purchase this item(s)");
                } else if(data == "NO_BANK_SPACE") {
                    alert("You do not have sufficient bank space to store the items in your basket.");
                } else if(data == "LIMITED_ITEM") {
                    alert("One of the limited items in your basket has run out of stock");
                } else if(data == "ONLINE_SUCCESS" || data == "OFFLINE_SUCCESS") {
                    basket.children().call("remove");
                    total_credits.call("inner", [0]);
                    myCredits.call("inner", [parseInt(myCredits.inner()) - total]);
                    alert("The items have been successfully added to your in-game bank.");
                } else {
                    alert("An error has occurred.");
                }
            }, false);

        }

    });

}

if(_.isDefined(search)) {

    search.bind(["keyup", "keydown", "change"], function() {

        var keyword = search.value().toLowerCase();
        var back = _.create("a").attribute("href", "#");
        var _return = function() {
            _categories.call("addClass", ["hidden"]);
            products.removeClass("hidden");
            title.inner("Products");
            container2.removeClass("hidden");
            container.addClass("hidden");
        };

        back.inner("Return to the shop overview");
        back.bind("click", function(e) {
            e.preventDefault();
            _return();
        });
        results.children().call("remove");

        if(keyword.length >= 3) {

            results.append(back.addClass("button"));

            items.each(function(item) {

                var name = item.select("name", "class").first().inner().toLowerCase();

                if(_.contains(name, keyword)) {
                    results.append(item);
                }

            });

            results.append(_.create("div").addClass("clear-fix"));

            if(results.children().size() > 0) {
                container2.addClass("hidden");
                container.removeClass("hidden");
            }

        } else {
            _return();
        }

    });

}

function removeItem(e) {

    updateCredits("-" + e.node.attribute("data-credits"));

    e.preventDefault();
    e.node.remove();

    if(basket.children().size() <= 0) {
        empty.removeClass("hidden");
        filled.addClass("hidden");
    }

}

function updateCredits(amount) {

    var current = parseInt(total_credits.inner());

    amount = parseInt(amount);
    total_credits.inner(current + amount);

}