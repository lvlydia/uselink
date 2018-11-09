$(() => {
    /*===================================*
	            GLOBAL VARIABLE
	*===================================*/
    //获取URL
    window.url = window.location.href;


    //全局页面加入弹窗
    $('body').append(`<div class="_pop_win_"></div>`);


    //全局弹窗脚本
    window.pop = (str, type) => {
        let pop = $('._pop_win_');

        if (!type) {
            $('._pop_win_').addClass('_red_');
        } else {
            $('._pop_win_').addClass('_green_');
        }

        let status = pop.css('display');

        pop.empty().text(str);

        if (status === 'none') {
            show();
            setTimeout(hide, 3000)
        } else {
            hide();
            setTimeout(show, 3000)
        }

        function show() {
            pop.css({display: "block", opacity: "1"}).animate({}, function () {
                $(this).removeClass('fadeOutUp').addClass('fadeInDown')
            });
        }


        function hide() {
            pop.animate({}, function () {
                $(this).addClass('fadeOutUp').removeClass('fadeInDown').fadeOut(300, function () {
                    $(this).css({display: "none"})
                })
            });
        }
    };


    //开发IP地址
    //dev_ip 本地ip  run_host 线上接口地址  dev_host  测试接口地址
    let dev_ip = 'http://192.168.0.153:8080', run_host = 'https://mgm.uselink.cc', dev_host = 'http://192.168.0.57:9002';


    //cms接口地址
    // window.cms_host='https://cms.uselink.cc/cms';
    window.cms_host='http://192.168.0.158:9001/cms';


    //设置语言
    const language_list = [
        {
            val: 'en',
            text: 'English'
        },
        {
            val: 'zh',
            text: '简体中文'
        },
        {
            val: 'zh-TW',
            text: '繁體中文'
        },
        {
            val: 'ko',
            text: '한국어'
        },
    ];


    //页面名字列表
    window.url_list = {
        login: 'login.html',
        news_details: 'news_details.html',
        home: 'index.html',
    };


    // 页面跳转
    window.href = url => {
        window.location.href = url_list[url];
    };


    //获取当前语言
    let url_arr, url_len, language;
    url_arr = url.split('/');
    url_len = url_arr.length;
    language = url_arr[url_len - 2];


    //设置语言
    window.language = url_arr[url_len - 2];


    if (language === 'en') {
        $('.en_hide').hide()
    }


    window.language_list = language_list;


    //简写打印函数
    window.l = str => {
        console.log(str);
        console.log('---------')
    };


    //获取当前开发模式
    window.dev_type = () => {
        if (url.includes(dev_ip)) {
            return 'dev';
        } else {
            return 'run';
        }
    };


    // 设置开发接口地址与上线正式接口地址
    if (dev_type() === 'dev') {
        window.host = dev_host;
    } else {
        window.host = run_host;
    }


    //发送短信验证码
    window.send_msg = (tip_, send_btn, phone, nationNumber, type_) => {
        ajax_('/sendCode', {
            phone: phone,
            nationNumber: nationNumber,
            type: type_
        }).then(data => {
            let time = 60;
            send_btn.addClass('send_waite').empty().text(time);
            let default_send_text = send_btn[0].dataset.text;

            function num() {
                if (time <= 0) {
                    time = 60;
                    clearInterval(interval);
                    send_btn.removeClass('send_waite').empty().text(default_send_text);
                } else {
                    send_btn.empty().text(time);
                    time--
                }
            }

            var interval;
            num();
            interval = setInterval(num, 1000)
        }, data => {
            tip_(data.retMsg);
        });
    };


    //js多语言列表
    window.lang_list = {
        en: {
            'incomplete': 'nnformation incompleteness',
            'account': 'account',
            'votes': 'votes',
            'ranking': 'ranking',
            'share': 'share',
            'help_vote': 'vote for me',
            'node_error': 'node name format error',
            'password_format_error': 'password format error',
            'phone_format_error': 'phone format error',


            'network_error': 'network error',
            'info_incomplete': 'information incompleteness',
            'password_not_same': 'two passwords are inconsistent',
            'delegate_name_format_error': 'super node name format error',

            //userinfo
            'close': 'close',
            'change_pwd': 'change password',
            'change': 'change',
            'bind': 'bind',
            'bind_address': 'bind withdraw address',
            'change_address': 'change withdraw address',
            'withdrawAddress_empty': 'The withdraw address cannot be empty',
            'dividend_rate_error': 'Dividend ratio error',
            'save_success': "Successfully saved",
            // 'submit_win_title': 'Application Information',
            'submit_success':'Submitted successfully',

            'submitted':'Has been submitted',
            'unauthorized':'unauthorized',
            'did_not_pass':'Did not pass',
            'waiting_for_processing':'Waiting for processing',
            'verification_passed':'Verification passed',

            'node_name_cant_null':'Supernode name cannot be empty',
            'exit':'exit',
            'exit_transfer':'Exit the transfer',
            'exit_success':'Exit the success',
            'none':'none',
            'detail':'detail',
            'success':'success',
            'empty':'no content yet',


        },

        zh: {
            //vote
            'incomplete': '信息不完整',
            // QRcode
            'account': '账户',
            'votes': '票数',
            'ranking': '排名',
            'share': '分红比例',
            'help_vote': '帮我拉票',
            // Search
            'node_error': '节点名格式错误',
            'password_format_error': '密码格式错误',
            'phone_format_error': '手机号格式错误',

            //register
            'network_error': '网络错误',
            'info_incomplete': '信息不完整',
            'password_not_same': '两次密码输入不一致',
            'delegate_name_format_error': '超级节点名格式错误',

            //userinfo
            'close': '关闭',
            'change_pwd': '修改密码',
            'change': '修改',
            'bind': '绑定',
            'bind_address': '绑定提币地址',
            'change_address': '修改提币地址',
            'withdrawAddress_empty': '提币地址不能为空',
            'dividend_rate_error': '分红比例错误',
            'save_success': "保存成功",
            'submit_success':'提交成功',

            'submitted':'已提交',
            'unauthorized':'未认证',
            'did_not_pass':'未通过',
            'waiting_for_processing':'待处理',
            'verification_passed':'审核通过',

            'node_name_cant_null':'超级节点名不能为空',
            'exit':'退出',
            'exit_transfer':'退出转账',
            'exit_success':'退出成功',
            'none':'无',
            'detail':'详情',
            'success':'成功',
            'empty':'暂无内容',

        },

        'zh-TW': {
            //vote
            'incomplete': '信息不完整',
            // QRcode
            'account': '賬戶',
            'votes': '票數',
            'ranking': '排名',
            'share': '分紅比例',
            'help_vote': '幫我拉票',
            // Search
            'node_error': '節點名格式錯誤',
            'password_format_error': '密碼格式錯誤',
            'phone_format_error': '手機號格式錯誤',

            //register
            'network_error': '網絡錯誤',
            'info_incomplete': '信息不完整',
            'password_not_same': '兩次密碼輸入不一致',
            'delegate_name_format_error': '超級節點名格式錯誤',

            //userinfo
            'close': '關閉',
            'change_pwd': '修改密碼',
            'change': '修改',
            'bind': '綁定',
            'bind_address': '綁定提幣地址',
            'change_address': '修改提幣地址',
            'withdrawAddress_empty': '提幣地址不能為空',
            'dividend_rate_error': '分紅比例錯誤',
            'save_success': "保存成功",
            'submit_success':'提交成功',

            'submitted':'已提交',
            'unauthorized':'未認證',
            'did_not_pass':'未通過',
            'waiting_for_processing':'待處理',
            'verification_passed':'審核通過',

            'node_name_cant_null':'超級節點名不能為空',
            'exit':'退出',
            'exit_transfer':'退出轉賬',
            'exit_success':'退出成功',
            'none':'無',
            'detail':'詳情',
            'success':'成功',
            'empty':'暫無內容',

        },

        ko: {
            //vote
            'incomplete': '불완전한 정보',
            // QRcode
            'account': '계정',
            'votes': '표수',
            'ranking': '순위',
            'share': '배당비례',
            'help_vote': '나를 위해 투표 해',
            // Search
            'node_error': '노드 이름의 형식이 잘못되었습니다',
            'password_format_error': '잘못된 암호 형식',
            'phone_format_error': '전화 번호 형식 오류',

            //register
            'network_error': '네트워크 오류',
            'info_incomplete': '불완전한 정보',
            'password_not_same': '입력한 비밀번호가 불일치',
            'delegate_name_format_error': '슈퍼 노드 이름 형식 오류',

            //userinfo
            'close': '닫기',
            'change_pwd': '비밀번호 변경',
            'change': '변경',
            'bind': '바인딩',
            'bind_address': '바인딩 추출 토큰 주소',
            'change_address': '추출 토큰 주소 수정',
            'withdrawAddress_empty': '추출 토큰 주소는 비워 둘 수 없습니다',
            'dividend_rate_error': '배당비례 점검오류',
            'save_success': "성공적으로 저장되었습니다",
            'submit_success':'제출 완료',

            'submitted':'제출 완료',
            'unauthorized':'인증 없음',
            'did_not_pass':'통과 할 수 없다',
            'waiting_for_processing':'처리 대기 중',
            'verification_passed':'제출 완료',

            'node_name_cant_null':'슈퍼 노드 이름은 비워 둘 수 없습니다.',
            'exit':'로그 아웃',
            'exit_transfer':'출구 전송',
            'exit_success':'성공적으로 종료',
            'none':'아니요',
            'detail':'세부 정보',
            'success':'성공',
            'empty':'내용 없음',

        }
    };


    //js多语言方法
    window.lang = (str) => {
        return lang_list[language][str];
    };


    //promise ajax 简写
    window.ajax_ = (url, data, headers,hosts) => {
        return new Promise((resolve, reject) => {
            if(hosts){
                //自定义接口地址
                $.ajax({
                    type: "post",
                    contentType: 'application/x-www-form-urlencoded',
                    url: hosts + url,
                    dataType: "json",
                    async: true,
                    data: data,
                    success: function (res) {
                        if (res.retCode === 200) {
                            resolve(res.data);
                        } else {
                            reject(res)
                        }
                    },
                    error: function (e) {
                        reject(e)
                    }, beforeSend: request => {
                        if (headers) {
                            request.setRequestHeader("token", window.localStorage.getItem('token'));
                            request.setRequestHeader("language", language);
                        }
                    },
                });
            }else {
                $.ajax({
                    type: "post",
                    contentType: 'application/json; charset=utf-8',
                    url: host + url,
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function (res) {
                        if (res.retCode === 200) {
                            resolve(res.data);
                        } else {
                            reject(res)
                        }
                    },
                    error: function (e) {
                        reject(e)
                    }, beforeSend: request => {
                        if (headers) {
                            request.setRequestHeader("token", window.localStorage.getItem('token'));
                            request.setRequestHeader("language", language);
                        }
                    },
                });
            }
        });
    };


    //获取窗口宽高
    window.w = $(window).width();
    window.h = $(window).height();


    if (w > 1024) {
        window.type = 'pc';
    } else {
        window.type = 'mobile';
    }


    //pc端隐藏menu
    $(window).resize(() => {
        if ($(window).width() > 1024) {
            $('.menu_box').hide(300);

            window.type = 'pc';
        } else {
            window.type = 'mobile';
        }
    });


    function no_login() {
        //展示个人信息按钮
        $('.user_info_btn').removeClass('show').addClass('hide');

        //隐藏登录按钮
        $('.login_btn').removeClass('hide').addClass('show');
    }


    function login() {
        //隐藏登录按钮
        $('.login_btn').removeClass('show').addClass('hide');

        //展示个人信息按钮
        $('.user_info_btn').removeClass('hide').addClass('show');
    }


    //判断页面是否登录
    window.check_login = () => {
        if (window.localStorage.getItem('token')) {
            ajax_('/getUser', {}, 1).then(data => {
                let phone = data.userInfo.user.phone;

                $('#phone').empty().html(`
                    ${phone}
                    <i></i>
                `);

                $('#mobile_phone').empty().html(`
                    ${phone}
                    <i></i>
                `);

                login()
            }).catch(() => {
                no_login()
            })
        } else {
            no_login()
        }
    };


    check_login();


    //退出登录
    $('#logout').click(e => {
        logout();
    });

    $('#mobile_logout').click(e => {
        logout();
    });

    function logout(){
        ajax_('/loginOut', {}, 1).then(data => {
            window.localStorage.removeItem('token');
            href('login');
        }).catch(() => {
            no_login();
            href('login');
        })
    }


    //点击个人信息按钮时切换下拉菜单
    $('.user_info_btn').click(e => {
        let obj = e.currentTarget.children[1];
        list_animate($(obj), 'fadeInUp_', 'fadeOutDown_');

        $('.menu_box').animate({}, () => {
            $('.menu_box').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.menu_box').css({display: "none"});
            });
        });

        $('.pc_language_menu').animate({}, () => {
            $('.pc_language_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_language_menu').css({display: "none"});
            });
        });
    });


    //获取图形验证码
    window.get_new_graphic_code = (box, form) => {
        ajax_('/getImage', {}).then(data => {
            if (data.image) {
                let res = data.image;
                let dataUrl = 'data:image/jpg;base64,' + res.body;
                let img = new Image();
                window.pictureId = res.headers.pictureId[0];

                img.src = dataUrl;

                img.onload = () => {
                    box.html(img);
                };

                if (form) {
                    form.pictureId = res.headers.pictureId[0];
                }
            }
        });
    };


    //获取国家信息
    window.getNationInfo = form => {
        ajax_('/getNationInfo', {}).then(data => {
            if (data.nationInfo) {
                let list = data.nationInfo;

                for (let q of list) {
                    //AU 那行加一条分界线
                    $('.select_list').append(`
                        <li class="hover select_country" data-icon="${q.nationFlag}" data-num="${q.nationNumber}" data-country="${language === 'zh' ? q.nationNameZh : q.nationAbbreviate}" data-id="${q.nationId}" style="${q.nationAbbreviate==='AU'?'border-top: 1px solid #ddd;':''}">                         
                             <a href="javascript:void(0);">
                                 <img src="${q.nationFlag}">
                                 <span>+${q.nationNumber}</span>
                                 <span>${language === 'zh' ? q.nationNameZh : q.nationNameEn}</span>
                             </a>
                         </li>
                `)
                }

                //加载结束
                $('.select_default').removeClass('loading');

                //下拉列表逻辑
                $('.select_box').click(() => {
                    $('.select_box').hasClass('active') ? $('.select_box').removeClass('active') :
                        $('.select_box').addClass('active');

                    //显示或隐藏列表
                    list_animate($('.select_list'), 'fadeInUp', 'fadeOutDown');
                });

                $(document).click(() => {
                    event.stopPropagation();
                    $('.select_list').animate({}, () => {
                        $('.select_list').addClass('fadeOutDown').removeClass('fadeInUp').fadeOut(300, () => {
                            $('.select_list').css({display: "none"});
                        });
                    });
                });

                //选择国家
                $('.select_country').click(e => {
                    let data = e.currentTarget.dataset, num = data.num, country = data.country, icon = data.icon,
                        id = data.id;

                    // l(country);

                    $('.select_default').empty().append(`
                        <span>
                            <img src="${icon}">
                        </span>
                        
                        <span>+${num} ${country}</span>
                `).attr('data-num', num);

                    form.phone_select_num = parseInt(num);
                    form.phone_select_id = parseInt(id);
                })
            } else {
                err('network_error')
            }
        });
    };


    /*===================================*
            验证部分
    *===================================*/

    //手机号验证
    window.test_phone = phone => {
        let reg = /^([0-9]\d{8,15})$/;

        if (reg.test(phone)) {
            return true
        } else {
            return false;
        }
    };


    //密码验证
    window.test_password = password => {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/;

        if (reg.test(password)) {
            return true
        } else {
            return false
        }
    };


    //节点名验证
    window.test_delegate_name = delegate_name => {
        let reg = /^[a-z][a-z0-9_]{4,62}$/;

        if (reg.test(delegate_name)) {
            return true
        } else {
            return false
        }
    };


    let white_paper_zh = 'http://oss.uselink.cc/white/UselinkWhiteCN.pdf';
    let white_paper_en = 'http://oss.uselink.cc/white/UselinkWhiteEN.pdf';


    //白皮书地址 中文情况下跳中文白皮书  其他情况跳英文
    language === 'zh' ? window.white_paper_url = white_paper_zh :
        window.white_paper_url = white_paper_en;

    $('.' + language + '_hide').hide();


    /*===================================*
	        NAV SCRIPT
	*===================================*/

    //置入语言列表中的语言
    language_list.forEach(el => {
        $('.pc_language_menu').append(` 
            <li>
                <a href="javascript:void(0);" class="language_item" data-val="${el.val}">${el.text}</a>
            </li>
        `);
    });


    //显示或关闭语言列表
    $('.change_language_btn').click(e => {
        let obj = e.currentTarget.children[1];
        let fadeIn='fadeInUp_';
        list_animate($(obj), 'fadeInUp_', 'fadeOutDown_');

        $('.menu_box').animate({}, () => {
            $('.menu_box').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.menu_box').css({display: "none"});
            });
        });

        $('.pc_userinfo_menu').animate({}, () => {
            $('.pc_userinfo_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_userinfo_menu').css({display: "none"});
            });
        });
    });

    //点击按钮显示或隐藏对象方法
    window.list_animate = function list_animate(obj, fadeIn, fadeOut) {
        l(obj);
        event.stopPropagation();
        var status = obj.css('display');

        if (status === 'none') {
            obj.css({display: "block", opacity: "1"}).animate({}, () => {
                obj.removeClass(fadeOut).addClass(fadeIn);
            });
        } else {
            obj.animate({}, () => {
                obj.addClass(fadeOut).removeClass(fadeIn).fadeOut(300, () => {
                    obj.css({display: "none"});
                });
            });
        }
    };


    //点击窗口关闭menu
    $(document).click(e => {
        e.stopPropagation();

        $('.pc_language_menu').animate({}, () => {
            $('.pc_language_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_language_menu').css({display: "none"});
            });
        });

        $('.pc_userinfo_menu').animate({}, () => {
            $('.pc_userinfo_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_userinfo_menu').css({display: "none"});
            });
        });

        $('.menu_box').animate({}, () => {
            $('.menu_box').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.menu_box').css({display: "none"});
            });
        });
    });


    //change language
    $('.language_item').click(e => {
        let lang_val = e.target.dataset.val;
        window.location.href = url.replace(language, lang_val);
    });



    /*===================================*
            OTHER SCRIPT
    *===================================*/

    //跳转至白皮书
    $('.white_paper').click(e => {
        window.open(white_paper_url);
    });


    //关闭弹窗
    $('.pop_win_close,.pop_win_bg').click(e => {
        event.stopPropagation();

        $('.pop_win').animate({}, () => {
            $('.pop_win').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.pop_win').css({display: "none"});
            });
        });
    });


    //点击更多弹出窗口
    $('.more_btn').click(e => {
        let win = $('.pop_win');
        let text = e.target.dataset.text;
        win.find('p').text(text);

        list_animate(win, 'fadeIn', 'fadeOut');
    });


    //菜单的显示与隐藏
    $('.menu_btn').click(e => {
        list_animate($('.menu_box'), 'fadeIn', 'fadeOut');

        $('.pc_language_menu').animate({}, () => {
            $('.pc_language_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_language_menu').css({display: "none"});
            });
        });

        $('.pc_userinfo_menu').animate({}, () => {
            $('.pc_userinfo_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_userinfo_menu').css({display: "none"});
            });
        });
    });

    //自动设置body padding_bottom高度
    $('body').css({"padding-bottom": $('.footer')[0].clientHeight});

    $(window).resize(() => {
        $('body').css({"padding-bottom": $('.footer')[0].clientHeight});
    })
});