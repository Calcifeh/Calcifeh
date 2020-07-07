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

var _ = new Neo({ history: false });
var news = _.select("news-item", "class");
var newsBody = _.select("postbod", "class").first();
var newsAvatar = _.select("news_avatar", "class");
var newsDate = _.select("newsdate", "class").first();
var slides = _.select("slide", "class");

news.call("bind", [ "click", function(e) {

    e.preventDefault();

    var target = e.node;
    var content = target.select("post_content", "class").first();
    var postTitle = content.select("post_title", "class").first();
    var postBody = content.select("post_body", "class").first();
    var postAvatar = content.select("post_avatar", "class").first();
    var postAuthor = content.select("post_author", "class").first();

    newsDate.inner(postAuthor.inner());
    newsAvatar.call("attribute", [ "src", postAvatar.attribute("src") ])
    newsBody.inner("<div class=\"postbodtitle\">"+postTitle.inner()+"</div>"+postBody.inner());

} ]);

setInterval(function() {

    var showing = false;

    slides.each(function(slide) {
        if(slide.hasClass("show")) {
            showing = true;
        }
    });

    if(showing) {

        var showed = slides.filter(function(item) {
            return item.hasClass("show");
        }).first();

        showed.removeClass("show");
        showed.next().addClass("show");

    } else {
        slides.first().addClass("show");
    }

}, 5000);