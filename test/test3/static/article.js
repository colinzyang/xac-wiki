(function ($) {

    //添加图片注释
    var converter = new showdown.Converter({ tables: 'true',underline:'true' });
    $("article img").each(function () {
        note = converter.makeHtml($(this).prop('alt'))
        var img_note = $('<p></p>').attr("class", "img-note").html(note);
        if (!$(this).hasClass("lazy")) {
            $(this).addClass("lazy");
        }
        if (typeof ($(this).attr("data-src")) === 'undefined') {
            $(this).attr("data-src", $(this).prop("src"));
        }
        $(this).addClass("lazy");
        $(this).after(img_note);
    });

    var lazyLoadInstance = new LazyLoad({});

    //生成目录
    var titles = [];
    if($("article h2,article h3").length > 15){
        $("article h2").each(function(i, e){
            $(this).attr("id", "heading-" + i);
            titles.push({
                name: e.tagName,
                id: e.id,
                //text: "> " + e.innerText,
                text: e.innerText,
                top: $(e).offset().top
            });
    
        });
    }else{
        $("article h2,article h3").each(function(i, e){
            $(this).attr("id", "heading-" + i);
            titles.push({
                name: e.tagName,
                id: e.id,
                //text: "> " + e.innerText,
                text: e.innerText,
                top: $(e).offset().top,
            });
    
        });
    }
    titles.forEach(e => {
        var content_link = $("<a></a>").attr("href", "#" + e.id).attr("class", "catalog-" + e.name).text(e.text);
        if (e.name === 'H2') {
            $(".catalog-list").append($("<li></li>").append(content_link));
        } else {
            $(".catalog-list").append($("<ul></ul>").append($("<li></li>").append(content_link)));
        }
    });


    //目录隐藏,目录跟随内容
    var catalog = $(".catalog");
    var current = $('.catalog-H2').eq(0)
    document.addEventListener('DOMContentLoaded',function(){
        $(window).scroll(() => {
            var scroll = $(window).scrollTop();
            
            for(var i in titles){
                y = $('#'+titles[i].id).offset().top;
                if (y - scroll > 200) {
                    break;
                }
                current = $('.catalog-H2,.catalog-H3').eq(i);
            }
            
            if(!current.hasClass('active')){
                $('.catalog .active').removeClass('active');
                current.addClass('active');
            }
    
    
        });
    });
    
    



})(jQuery);

