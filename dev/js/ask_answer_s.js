$(() => {

    function nodeToString ( node ) {
        var tmpNode = document.createElement( "div" );
        tmpNode.appendChild( node.cloneNode( true ) );
        var str = tmpNode.innerHTML;
        tmpNode = node = null; // prevent memory leaks in IE
        return str;
    }


    ajax_('/getFaqArticleList', {
        'lang': language
    }, 0, cms_host).then(data => {
        // l(data);
        Object.keys(data).forEach(key => {
            let content = document.createElement('div');
            $(content).attr('class','box');

            data[key].forEach(el => {
                // l(el.articleTitle);
                // l(el.articleContent);
                $(content).append(`
                    <div class="title">${el.articleTitle}</div>
                        <div class="one">${el.articleContent}</div>
                `);

            });

            $('#content').append(`
                        <div class="menu1">
                            <img class="item" src="../img/group_up.png" alt="">
                            ${key}
                        </div>
                       ${nodeToString(content)}
            `);






            // 截取文件名
            function getUrlFileName(url) {
                return url.substr(url.lastIndexOf('/') + 1);
            }

            // 一级标题
            $('.box').eq(0).show().siblings('.box').hide();
            $('.menu1').eq(0).find('img').attr('src','../img/group_down.png');

            $('.menu1').unbind('click').click(e=> {
                var Item = $(e.target);

                $('.menu1').find('img').attr('src','../img/group_up.png');

                if (getUrlFileName(Item.find('img').attr('src')) === "group_up.png") {
                    Item.find('img').attr('src','../img/group_down.png');
                } else {
                    Item.find('img').attr('src','../img/group_up.png');
                }

                Item.next().toggle(200).siblings('.box').hide(200);
            });

            // 二级问题
            $('.one').hide();
            $('.title').unbind('click').click(function () {
                $(this).next().slideToggle(200).siblings('.one').hide(200);
            });
        });
    }).catch(data => {
        l(data);
    })

});






