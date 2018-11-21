$(() => {
    if (url.includes('id=') && url.split('id=')[1]) {
        let url_arr = url.split('?id='), id;

        if (url_arr[1].includes('&')) {
            id = url_arr[1].split('&')[0];
        } else {
            id = url.split('id=')[1];
        }

        ajax_('/article', {
            'uuid': id,
            'lang': language,
        }, 0, cms_host).then(data => {
            $('.loading').hide(0);

            $("#box").append(`
                 <div class="art_title">${data.articleTitle}</div>
                 <div class="author">${data.articleAuther}
                    <span class="time">${data.createTimeStr}</span>
                 </div>
                 <div class="content">${data.articleContent}</div>
            `);

            //获取第一张图片和短标题
            // l(data);

            //插入常驻图片
            $('.author').after(`
                <img src="../img/news_details_title_bg.png" class="content_title_bg">
            `);

            let titleImg = data.titleImg;

            //如果传过来不显示title img则换成一条线
            if (!titleImg) {
                $('.content_title_bg').after(`
                    <hr>
                `).remove();
            }


            //facebook分享设置
            // $('meta[property="og:image"]').attr('content',data.articlePicture);
            // $('meta[property="og:title"]').attr('content',data.articleTitle);
            // $('meta[property="og:description"]').attr('content',data.articleIntroduction);
        }).catch(data => {
            pop(lang('network_error'));

            //如果没有该语言文章则返回500
            if (data.retCode === 500) {
                window.location.href = '../' + language + '/news.html';
            }
        });
    } else {
        href('home');
    }

    // $('.language_item').click(e => {
    //     let lang_val = e.target.dataset.val;
    //     window.location.href = '../'+lang_val+'/news.html';
    // });
});