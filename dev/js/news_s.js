$(() => {


    // ==================================
    //       关于分页
    // ==================================
    var page = 1;
    let total;
    let newnum;
    // var data = {
    //     'pageNum':page,  //(从第几页开始)
    //     'pageSize': 10   //（每页显示几条数据）
    // };

    //分页区间
    function page_interval(page_num){
        if(page_num<=5){
            if(page_num>1){
                render(1,page_num);
                $('.page_btn_box').show();
            }else{
                $('.page_btn_box').hide();
            }
        }else{
            render(1,5);
            $('.page_btn_box').show();
        }
    }


    // 渲染分页按钮
    function render(begin,page_num){
        //获取分页按钮容器
        let page_btn_box = $(".other_page");
        //清空容器
        page_btn_box.empty();
        //渲染
        for(let q = begin; q <= page_num; q++){
            page_btn_box.append(`
               <div class="page_num_item btn" data-num="${q}">${q}</div>
        `)
        }
    }


    let arr = [];    // ["announcement", "activity", "news"]

    ajax_('/channels', {
        'lang': language
    }, 0, cms_host).then(data => {
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
            first(arr[0]);
            every(arr[0]);
            last(arr[0]);
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
            first(type);
            every(type);
            last(type);
         })
        }).catch(data => {
            pop(lang('network_error'));
        });



    // 首页按钮
    function first(type){
       $(".first_page_btn").unbind('click').click(function (){
           ajaxAdd_('/alist', {
               'lang': language,
               'channelType': type,
               'pageNum':page,
               'pageSize': 3
           }, 0, cms_host).then(res => {
               console.log(res);
               for_(res);
               let page_num = res.version;
               if (page_num <= 5) {
                   if (page_num > 1) {
                       render(1, page_num);
                       $('.page_btn_box').show();
                   } else {
                       $('.page_btn_box').hide();
                   }
               } else {
                   render(1, 5);
                   $('.page_btn_box').show();
               }

               for (let el of $('.page_num_item')) {
                   let active_num = $(el)[0].dataset.num;
                   if (parseInt(active_num) === 1) {
                       $(el).addClass('active');
                   }
               }

               $('.loading').hide(0);
               $("#" + type).empty();
               if (res.data.length > 0) {
                   $('#' + type).find('.empty').hide(0);
                   let data =res.data;
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


           }).catch(res => {
               console.log('报错');
           });
       });

   }

    //尾页按钮
    function last(type) {
        $(".last_page_btn").unbind('click').click(function () {
            ajaxAdd_('/alist', {
                'lang': language,
                'channelType': type,
                'pageNum':total,
                'pageSize': 3
            }, 0, cms_host).then(res => {
                console.log(res);
                for_(res);
                let page_num = res.version;
                if (page_num <= 5) {
                    if (page_num > 1) {
                        render(1, page_num);
                        $('.paging').show();
                    } else {
                        $('.paging').hide();
                    }
                } else {
                    render(page_num - 4, page_num);
                    $('.paging').show();
                }

                for (let el of $('.page_num_item')) {
                    console.log(el);
                    let active_num = $(el)[0].dataset.num;
                    console.log(active_num);
                    if (parseInt(active_num) === parseInt(page_num)) {
                        $(el).addClass('active')
                    }
                }

                $('.loading').hide(0);
                $("#" + type).empty();
                if (res.data.length > 0) {
                    $('#' + type).find('.empty').hide(0);
                    let data =res.data;
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

            }).catch(res => {
                console.log('报错');
            });
        })
    };

    // 页面每一页
    function every(type) {
        $(".other_page").unbind('click').on('click', '.page_num_item', function (e) {
            let num = e.target.dataset.num;
            if (!(total <= 5)) {
                // console.log(!(total <= 5));    //true
                //点击页数右侧两个大于总页数
                if (parseInt(num) + 2 >= total) {
                    //从总页数向左进行渲染
                    render(total - 4, total);
                    //点击页数左侧两个小于0
                } else if (num - 2 <= 0) {
                    //从1开始向右渲染
                    render(1, 5);
                } else {
                    //将点击的页数居中
                    render(num - 2, parseInt(num) + 2);
                }
            } else {
                $('.page_num_item').removeClass('active');  // 如果total是5的话，active类 就取消
            }

            ajaxAdd_('/alist', {
                'lang': language,
                'channelType': type,
                'pageNum':num,
                'pageSize': 3
            }, 0,cms_host).then(res => {
                // console.log(res);
                for_(res, num ? 1 : 0 );
                $('.loading').hide(0);
                $("#" + type).empty();
                if (res.data.length > 0) {
                    $('#' + type).find('.empty').hide(0);
                    let data =res.data;
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

            for (let el of $('.page_num_item')) {
                let active_num = $(el)[0].dataset.num;
                if (active_num === num) {
                    $(el).addClass('active');
                }
            }

        });
    };


    function for_(res,num=2) {
        var list_length = res.data.length;
        if(list_length === 0){
            $('.paging').hide();
        }else{
            $('.paging').show();
        }
        total = res.version;

        if(num === 0 || num ===2){
            page_interval(total);
            //第一页选中状态
            $('.other_page').find('.page_num_item').eq(0).addClass('active');
        }

    }

    function get_list(type) {
        ajaxAdd_('/alist', {
            'lang': language,
            'channelType': type,
            'pageNum':page,
            'pageSize': 3
        }, 0, cms_host).then(res => {
            // console.log(res);
            for_(res);
            $('.loading').hide(0);
            $("#" + type).empty();
            if (res.data.length > 0) {
                $('#' + type).find('.empty').hide(0);
                let data =res.data;
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