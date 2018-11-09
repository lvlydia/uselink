$(() => {
    let arr = ['news', 'activity'];


    ajax_('/channels', {
        'lang': language
    }, 0, cms_host).then(data => {
        //放入tab
        data.forEach(el => {
            $(".tab_box").append(`
                <div class="hover tab" data-type="${el.channelType}" id="${el.channelType}_tab">${el.channelName}</div>
            `);
        });


        let tab = $('.tab');
        let box = $('.tab_content');


        if(url.includes('type=')&&url.split('type=')[1]==='activity'){
            let box = $('.tab_content');
            box.eq(1).show();
            let tab = $('.tab');
            tab.eq(1).addClass('active');


            //获取咨询
            get_list(arr[1]);
        }else {

            //默认显示咨询
            box.eq(0).show();
            tab.eq(0).addClass('active');


            //获取咨询
            get_list(arr[0]);
        }


        //点击tab进行切换
        tab.click(e => {
            //获取点击类型
            let type = e.target.dataset.type;
            let index = $(e.target).index();
            $('.tab').removeClass('active');
            $(e.target).addClass('active');

            //隐藏并显示对应内容
            box.hide();
            box.eq(index).show();

            get_list(type);
        })
    }).catch(data => {
        pop(lang('network_error'));
    });


    function get_list(type) {
        ajax_('/alist', {
            'lang': language,
            'channelType': type,
        }, 0, cms_host).then(data => {
            l(data);
            $("#" + type).empty();
            $('.loading').hide(0);
            if (data.length > 0) {
                $('#' + type).find('.empty').hide(0);

                data.forEach(el => {
                    $("#" + type).append(`
                    

                        <div class="news_card hover" data-uuid="${el.uuid}" data-url="${el.articleUrl}">
                            <div class="left">
                                <img src="${el.articlePicture}">
                            </div>

                            <div class="right">
                                <h3>${el.articleTitle}</h3>

                                <p class="content">${el.articleIntroduction}</p>

                                <p class="info">
                                    <span class="articleAuther">${el.articleAuther}</span>

                                    <span class="createTimeStr">${el.createTimeStr}</span>

                                    <span class="viewTimes">${el.viewTimes}</span>
                                </p>
                            </div>
                        </div>
                        
                        
                    `);
                });

                $('.news_card').click(e => {
                    let uuid = e.currentTarget.dataset.uuid;
                    let url = e.currentTarget.dataset.url;

                    url ? window.open(url) : window.location.href = 'news_details.html?id=' + uuid;
                })

            } else {
                $('#' + type).append(`
                                        <p class="empty">${lang('empty')}</p>

                `)
            }

        }).catch(data => {
            pop(lang('network_error'));
        });
    }
});