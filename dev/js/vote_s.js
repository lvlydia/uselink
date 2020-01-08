$(() => {
    let lang_;
    let keyWords = undefined;

    language === 'zh' ? lang_ = language : language === 'ko' ? lang_ = language : language === 'zh-TW' ? lang_ = 'zh' : lang_ = 'en';

    function set_bg() {
        //set bg
        let win_w = $(window).width(), bg = $('.bgbox');

        //mobile  mobile_voted_bg_zh.jpg mobile_voted_bg_en.jpg
        win_w > 768 ? bg.css({
                "background": "url('../img/voted-web-bg_" + lang_ + ".jpg') center top",
                "background-size": "cover"
            }) :
            bg.css({
                "background-image": "url('../img/mobile_voted_bg_" + lang_ + "_top.png'),url('../img/mobile_voted_bg_bottom.png')",
                "background-color": " #4f1de4",
                "background-repeat": "no-repeat, no-repeat, repeat-y",
                "background-size": "100% auto",
                "background-position": "center top, center bottom, center bottom",
            });
    }

    set_bg();

    $(window).resize(() => {
        set_bg();
    });

    //循环放入投票item
    function for_(vote_box, rows) {
        console.log(rows);
        //清空盒子
        vote_box.empty();

        for (const [index, el] of rows.entries()) {
            //定义id
            let c = 'QRcode' + index, super_icon;

            //是否是超级节点
            super_icon = el.status === 1 ? '<div class="super_icon"><span class="icon-collection_fill iconfont  star"></span></div>' : '<div class="super_icon" style="display: none"></div>';

            vote_box.append(`
                        <div class="col-md-3 col-sm-4 col-xs-6" >
                            <div style="text-align: center;margin: 0 auto;">
                                <div class="circle">
                                    <div  id=` + c + `></div>
                                    ` + super_icon + `
                                     
                                </div>

                                <div class="text" >
                                    <p>
                                        <span>` + lang('account') + `:</span>
                                        <span>${el.delegateName}</span>
                                    </p>

                                    <p>
                                        <span>` + lang('votes') + `:</span>
                                        <span>${el.voteNum}</span>
                                    </p>

                                    <p>
                                        <span>` + lang('ranking') + `:</span>
                                        <span>${el.ranking}</span>
                                    </p>

                                    <p>
                                        <span>` + lang('share') + `:</span>
                                        <span>${el.shareRate * 100 + '%'}</span>
                                    </p>
                                </div>

                                <a href="javascript:void(0);" class="vote_btn btn_bc" data-delegatename="${el.delegateName}">` + lang('help_vote') + `</a>
                            </div>
                        </div>
                     `);


            // 添加二维码
            new QRCode(document.getElementById(c), {
                text: el.delegateName,
                width: 140,
                height: 140,
            });
        }
    }

    //get vote info
    let page = 1;
    const rows = 20;
    let vote_box = $('#vote_box');

    let ajax = new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            contentType: 'application/json; charset=utf-8',
            url: host + '/vote',
            dataType: "json",
            data: JSON.stringify({
                page: page,
                rows: rows,
                keyWords: keyWords,
            }),
            success: function (data) {
                if (data.retCode === 200) {
                    let res = data.data;
                    let rows = res.rows;
                    // window.total = res.total;
                    for_(vote_box, rows);
                    resolve(res.total);
                } else {
                    throw new Error('error')
                }
            },
            error: function () {
                console.log('ERROR');
                reject('error')
            }
        });
    });


    // 渲染分页按钮
    function render(begin, page_num) {
        //获取分页按钮容器
        let page_btn_box = $('.other_page');
        //清空容器
        page_btn_box.empty();

        //渲染
        for (let q = begin; q <= page_num; q++) {
            page_btn_box.append(`
                <div class="change_page" data-num="${q}">${q}</div>
            `);
        }
    }

    //分页区间
    function page_interval(page_num) {
        if(page_num<=5){
            if(page_num>1) {
                render(1, page_num);
                $('.paging').show();
            }else {
                $('.paging').hide();
            }
        }else {
            render(1, 5);
            $('.paging').show();
        }
    }

    //分页系统
    function page_(total) {

        //向上取整获得页数
        if(total>20){

        }

        let page_num = Math.ceil(total / 20);  // 对一个数进行上舍入。 (返回值为:大于等于 x，并且与它最接近的整数)（获取总页数）
        l(page_num);


        page_interval(page_num);

        //第一页选中状态
        $('.other_page').find('.change_page').eq(0).addClass('active');

        //点击第一页按钮时
        $('.first_page').unbind('click').click(() => {
            ajax_('/vote', {
                page: 1,
                rows: rows,
                keyWords: keyWords,
            }).then((data) => {
                for_(vote_box, data.rows);
            });

            if(page_num<=5){
                if(page_num>1) {
                    render(1, page_num);
                    $('.paging').show();
                }else {
                    $('.paging').hide();
                }
            }else {
                render(1, 5);
                $('.paging').show();
            }

            for (let el of $('.change_page')) {
                let active_num = $(el)[0].dataset.num;
                if (parseInt(active_num) === 1) {
                    $(el).addClass('active')
                }
            }
        });

        //点击最后一页按钮时
        $('.last_page').unbind('click').click(() => {
            ajax_('/vote', {
                page: page_num,
                rows: rows,
                keyWords: keyWords,
            }).then((data) => {
                for_(vote_box, data.rows);
            });

            //最后一页选中状态
            $('.change_page').last().addClass('active');

            if(page_num<=5){
                if(page_num>1) {
                    render(1, page_num);
                    $('.paging').show();
                }else {
                    $('.paging').hide();
                }
            }else {
                render(page_num-4, page_num);
                $('.paging').show();
            }


            for (let el of $('.change_page')) {
                let active_num = $(el)[0].dataset.num;
                if (parseInt(active_num) === parseInt(page_num)) {
                    $(el).addClass('active')
                }
            }
        });

        //点击页面跳转按钮时
        $('.other_page').unbind('click').on('click', '.change_page', e => {
            let num = e.target.dataset.num;

            //如果总页数大于5
            if (!(page_num <= 5)) {
                //点击页数右侧两个大于总页数
                if (parseInt(num) + 2 >= page_num) {
                    //从总页数向左进行渲染
                    render(page_num - 4, page_num);
                    //点击页数左侧两个小于0
                } else if (num - 2 <= 0) {
                    //从1开始向右渲染
                    render(1, 5);
                } else {
                    //将点击的页数居中
                    render(num - 2, parseInt(num) + 2);
                }
            }else {
                $('.change_page').removeClass('active');
            }


            for (let el of $('.change_page')) {
                let active_num = $(el)[0].dataset.num;
                if (active_num === num) {
                    $(el).addClass('active')
                }
            }

            ajax_('/vote', {
                page: num,
                rows: rows,
                keyWords: keyWords,
            }).then((data) => {
                for_(vote_box, data.rows);
            })
        });
    }


    //获取到投票信息后
    ajax.then(total => {
        page_(total);
    });


    // ajax.then(function (total) {
    //     page_(total);
    // });

    //搜索节点
    $('#search_node_input').bind('input propertychange', e => {
        keyWords = $('#search_node_input').val() === '' ? undefined : $('#search_node_input').val();
        $.ajax({
            type: "post",
            contentType: 'application/json; charset=utf-8',
            url: host + '/vote',
            dataType: "json",
            data: JSON.stringify({
                page: page,
                rows: rows,
                keyWords: keyWords,
            }),
            success: function (data) {
                if (data.retCode === 200) {
                    let res = data.data;
                    let rows = res.rows;
                    for_(vote_box, rows);
                    page_(res.total);
                } else {
                    throw new Error('error')
                }
            },
            error: function () {
                reject('error')
            }
        });
    });


    //点击投票按钮
    $('#vote_box').on('click', '.vote_btn', e => {
        //获取超级节点名
        let delegateName = e.target.dataset.delegatename;

        //投票分享页面显示
        $(".win").fadeIn(400);

        //创建背景图对象
        let bg = new Image();
        bg.src = '../img/vote_bg_' + lang_ + '.png';
        let canvas, ctx;

        //背景图加载成功后
        bg.onload = () => {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext("2d");
            let width = 300;
            let height = 600;

            //获取画布宽高
            canvas.width = width;
            canvas.height = height;
            let size = 180;
            draw_img(ctx, bg, 0, 0, width, height);

            //绘制二维码
            new QRCode(document.getElementById('fake_canvas_box'), {
                text: delegateName,
                width: size,
                height: size,
            });

            //获取二维码
            let qr_img = $('#fake_canvas_box').find('img')[0];
            $('#fake_canvas_box').empty();

            //二维码加载成功后
            qr_img.onload = () => {
                let rect_size = 200;

                //绘制白色背景
                ctx.rect((width / 2) - (rect_size / 2), 50 + height / 2, rect_size, rect_size);
                ctx.fillStyle = '#fff';
                ctx.fill();

                // 在画布上绘制二维码
                draw_img(ctx, qr_img, (width / 2) - (size / 2), 50 + height / 2 + (rect_size - size) / 2, size, size);

                //绘制文本
                ctx.fillStyle = "#fff";
                ctx.font = "18px '微软雅黑'";
                ctx.textAlign = "center";
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowColor = "#000000dd";
                ctx.fillText(delegateName, width / 2, 20 + height / 2);

                //创建最终画布对象
                let img = new Image();
                img.src = canvas.toDataURL("image/png");


                // 展示图片
                $(".win").append(img);
                if ($(".win>img").length > 1) {
                    $(".win")
                        .find("img")
                        .eq(0)
                        .remove();
                }
            }
        };
    });

    //画布绘制图片函数
    window.draw_img = (ctx, src, x, y, w, h) => {
        ctx.drawImage(src, x, y, w, h);
    };

    //点击投票分享页时
    $('.win').click(() => {
        event.stopPropagation();
        $(".win").fadeOut(400);
    })
});