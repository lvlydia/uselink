$(() => {
    let arr = [];

    ajax_('/channels', {
        'lang': language
    }, 0, cms_host).then(data => {
        l(data);
        //放入tab
        data.forEach(el => {
            arr.push(el.channelType);

            //生成tab
            $(".tab_box").append(`
                <div class="hover tab" data-type="${el.channelType}" id="${el.channelType}_tab">${el.channelName}</div>
            `);

            //生成content
            $('.container').append(`
                        <div id="${el.channelType}" class="tab_content row">
                            <div class="loading">
                                <div class="loading_circle"></div>
                            </div>
                        </div>
            `)
        });


        let tab = $('.tab');
        let content = $('.tab_content');

        function def() {
            $('#' + arr[0] + '_tab').addClass('active');
            $('#' + arr[0]).show();
            get_list(arr[0]);
        }

        //是否是app打开
        if (url.includes('type=')) {
            let urlArr = url.split('?')[1].split('&'), type = undefined;

            for (let q of urlArr) {
                if (q.includes('type')) {
                    type = q.split('=')[1];
                }
            }

            if (type) {

                $('.tab').removeClass('active');
                $('#' + type + '_tab').addClass('active');

                //隐藏并显示对应内容
                content.hide();
                $('#' + type).show();

                get_list(type);

            } else {
                def()
            }
        } else {
            def()
        }
        // if (url.includes('type=') && url.split('type=')[2] === 'news') {
        //     content.eq(2).show();
        //     let tab = $('.tab');
        //     tab.eq(2).addClass('active');
        //     get_list(arr[2]);
        //
        // } else if (url.includes('type=') && url.split('type=')[1] === 'activity') {
        //     content.eq(1).show();
        //     let tab = $('.tab');
        //     tab.eq(1).addClass('active');
        //     get_list(arr[1]);
        //
        // } else if (url.includes('type=') && url.split('type=')[0] === 'announcement') {
        //     //默认显示咨询
        //     content.eq(0).show();
        //     tab.eq(0).addClass('active');
        //     //获取咨询
        //     get_list(arr[0]);
        //
        // } else {
        //     content.eq(0).show();
        //     tab.eq(0).addClass('active');
        //     get_list(arr[0]);
        // }

        //点击tab进行切换
        tab.click(e => {
            //获取点击类型
            let type = e.target.dataset.type;
            let index = $(e.target).index();
            $('.tab').removeClass('active');
            $(e.target).addClass('active');

            //隐藏并显示对应内容
            content.hide();
            content.eq(index).show();

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
            l(data.length);
            l(data);
            console.log(data);
            $('.loading').hide(0);
            $("#" + type).empty();
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

                                    <span class="viewTimes"><span class="iconfont  icon-yanjing" style="margin-right: 10px;"></span>${el.viewTimes}</span>
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