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
        l(data);
        data.forEach(el => {

            let img = new Image();

            img.src = el.articlePicture;

            img.onload = () => {
                img_status = img_status + 1;

                if (img_status === data.length) {

                    data.forEach(el => {
                        $('.am-slider').flexslider('addSlide', `
                            <li class="banner_btn hover" data-content="${el.articleContent ? 1 : 0}" data-url="${el.articleUrl}" data-uuid="${el.uuid}">
                                <div style="cursor: pointer">
                                    <img src="${el.articlePicture}"/>
                                </div>
                            </li>
                        `);
                    });


                    $('.am-slider').flexslider('removeSlide', 0);


                    $('.banner_btn').click(e => {
                        let url = e.target.dataset.url;
                        let uuid = e.target.dataset.uuid;
                        let content = e.target.dataset.content;

                        l('0'===content);
                        l(!url);

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


    // $.ajax({
    //     type: "post",
    //     url:  hosts + "/bannerList",
    //     data: {
    //         'lang':language
    //     },
    //     async: false,
    //     contentType: "application/x-www-form-urlencoded",
    //     success:function (result) {
    //         console.log(result.data);
    //         console.log(window.language);
    //         let datas = result.data;
    //         let bodyHtml=[];
    //         // for (let j = 0; j < 2; j++) {
    //         for (let i = 0; i < datas.length; i++) {
    //             let addHtml = `<li><div class="banner_imgss" id="` + datas[i].uuid + `" style="cursor: pointer">
    //                                    <img style="width:100%;height:600px" src="` + datas[i].articlePicture + `"/>
    //                                </div>
    //                            </li>`;
    //             bodyHtml.join("");
    //             bodyHtml.push(addHtml);
    //         }
    //         // }
    //         $(".am-slides").append(bodyHtml);
    //         bannerClick();
    //     }
    // });
    //
    // function bannerClick() {
    //     $(".banner_imgss").on("click", function () {
    //         sessionStorage.uuid = this.id;
    //         window.open("news_details.html");
    //     });
    // }
});