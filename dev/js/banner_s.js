
$(() => {
    //设置banner高度
    let height = 500 / (900 / w);
    if (w < 1024) {
        $('.banner_true').height(height);
    }
    let img_status = 0;
    $('.am-slider').flexslider();

    ajax_('/bannerList', {
        'lang': language
    }, 0, cms_host).then(data => {

        data.forEach(el => {
            let img = new Image();
            img.src = w > 599 ? el.bannerPicture : el.mobilePicture;


            img.onload = () => {
                img_status = img_status + 1;
                console.log(img.height);

                if (img_status === data.length) {
                    if (w > 599) {
                        data.forEach(el => {
                            $('.am-slider').flexslider('addSlide', `
                            <li class="banner_btn hover" data-content="${el.articleContent ? 1 : 0}" data-url="${el.articleUrl}" data-uuid="${el.uuid}">
                                <div class="bannerBox" style="cursor: pointer;background-image:url(${el.bannerPicture})">
                                   
                                </div>
                            </li>
                        `);
                        });

                    } else {
                        data.forEach(el => {
                            $('.am-slider').flexslider('addSlide', `
                            <li class="banner_btn hover" data-content="${el.articleContent ? 1 : 0}" data-url="${el.articleUrl}" data-uuid="${el.uuid}">
                                <div  class="bannerBoxs" style="cursor: pointer;background-image:url(${el.mobilePicture})">
                                   
                                </div>
                            </li>
                        `);
                        });

                    }


                    $('.am-slider').flexslider('removeSlide', 0);


                    $('.banner_btn').click(e => {
                        let target = e.target.dataset;
                        let currentTarget = e.currentTarget.dataset;

                        let url = target.url === undefined ? currentTarget.url : target.url;
                        let uuid = target.uuid === undefined ? currentTarget.uuid : target.uuid;
                        let content = target.content === undefined ? currentTarget.content : target.content;

                        // l(url);
                        // l(uuid);
                        // l(content);

                        if('0'===content&&!url){

                        }else {
                            url?window.open(url):window.location.href='news_details.html?id='+uuid;
                        }

                    });
                }
            }
        });


    }).catch(data => {
        pop(lang('network_error'));
    })

});