$(() => {
    /*=============================
            USER INFO
     =============================*/
    //验证部分
    let form = {
        phone: undefined,
        password: undefined,
        passwordAgain: undefined,
        smscode: undefined,
        pictureId: undefined,
        signcode: undefined,
        withdrawAddress: undefined,
        shareRate: undefined,
        shareNum: undefined,
        delegateName: undefined,
        delegateId: undefined
    };





    {

        //点击下一步显示第二步 new
        $('.next_step').click(e => {
            //显示第二步内容
            $('.step1_box').removeClass('active');
            $('.step2_box').addClass('active');

            //‘第二步’切换为选中效果
            $('.change_step_box').children().removeClass('active').eq(1).addClass('active');
        });

        //点击切换分红值 new
        $('.changeShareNumBtn').click(e => {
            let q = $(e.target), type = q.data('type');
            let shareNum = $('.shareNum'), val = shareNum.val();

            if (type === 1 && parseInt(val) + 10 < 100) {
                shareNum.val(parseInt(val) + 10)
            }

            if (type === -1 && parseInt(val) - 10 > 0) {
                shareNum.val(parseInt(val) - 10)
            }
        });

        //申请拒绝后点击重新申请 new
        $('.submitAgain').click(e => {
            //隐藏未通过页面
            $('.notPass').hide(0);

            //显示提交页面
            $('.saveAndSubmit').show(0);
        });

        //有提币地址的情况下点击修改按钮
        $('.changeWithDrawAddress').click(e=>{
            //隐藏地址显示框与按钮
            $('.hasWithDrawAddress').hide(0);

            //显示地址输入框
            $('.userInfoAddress').show(0).select().parent().parent().removeClass('noLine');
        })

    }





    //首次加载获取图形验证码
    let graphic_code_box = $('.pic-code');
    get_new_graphic_code(graphic_code_box, form);


    //点击获取验证码
    graphic_code_box.click(() => {
        get_new_graphic_code(graphic_code_box, form);
    });


    //提示信息
    function tip_(str, obj) {
        if (obj) {
            obj.empty().text(str);
        } else {
            $('.tip').empty().text(str);
        }
    }


    //切换显示 new
    $('.tab').click(e => {
        let index = $(e.target).index();
        let card = index;

        $('.tab').removeClass('active');
        $(e.target).addClass('active');

        //切换右侧卡片
        card.removeClass('active');
        card.eq(index).addClass('active');
    });


    //默认一屏高度 new
    $('#userInfo').css({'min-height': $(window).height() - $('.footer').height()});


    //获取用户输入密码
    // $('.password').bind('input propertychange', e => {
    //     let id = e.target.id, val = $('#' + id).val();
    //
    //     if (id === 'password_input') {
    //         if (val !== '') {
    //             form.password = val;
    //         } else {
    //             form.password = undefined;
    //         }
    //     } else {
    //         if (val !== '') {
    //             form.passwordAgain = val;
    //         } else {
    //             form.passwordAgain = undefined;
    //         }
    //     }
    // });


    //获取用户输入的验证码
    // $('.code_input').bind('input propertychange', e => {
    //     // l(e);
    //     let id = e.target.id, val = $('#' + id).val();
    //
    //     if (id === 'signcode_input') {
    //         if (val !== '') {
    //             form.signcode = val;
    //         } else {
    //             form.signcode = undefined;
    //         }
    //     } else {
    //         if (val !== '') {
    //             form.smscode = val;
    //         } else {
    //             form.smscode = undefined;
    //         }
    //     }
    // });


    //确认修改钱包地址时
    // $('#bind_address_btn').click(e => {
    //     let val = $('#bind_address_input').val();
    //     if (val) {
    //         //将新地址传入表内
    //         form.withdrawAddress = val;
    //
    //         //更新地址显示
    //         $('.address').empty().text(val);
    //
    //         $('.win_tip').empty();
    //
    //         //关闭弹窗
    //         $('#bind_address_win').animate({}, () => {
    //             $('#bind_address_win').addClass('fadeOutDown').removeClass('fadeInUp').fadeOut(300, () => {
    //                 $('#bind_address_win').css({display: "none"});
    //             });
    //         });
    //     } else {
    //         $('.win_tip').empty().text(lang('withdrawAddress_empty'))
    //     }
    // });


    //获取用户信息
    ajax_('/getUser', {}, 1).then(data => {

        //是否提交过申请
        if (!data.applicationInfo) {
            //显示审核通过内容 new
            $('.saveAndSubmit').show(0);
        } else {
            let applicationInfo = data.applicationInfo, status = applicationInfo.status;

            switch (status) {
                //未通过
                case -1:
                    //显示拒绝原因 new
                    $('.notPass').show(0);

                    //如果有未通过原因
                    if (data.applicationInfo.remarks) {
                        let remarks = data.applicationInfo.remarks;
                        $("#notPassReason").empty().text(remarks);
                    }

                    $("#notPassReason").empty().text(lang('none'));

                    break;
                //审核中
                case 1:
                    //显示审核中内容 new
                    $('.review').show(0);

                    break;
                //通过
                case 2:
                    //显示保存信息页面 new
                    $('.submitted').show(0);

                    //显示退出申请按钮 new
                    $('#exit_apply').show(0);

                    //隐藏未认证提示 new
                    $('.unverified').hide(0);

                    //修改为“已通过”图片 new
                    $('.user_icon').attr('src', '../img/user_icon.png');

                    break;

                default:
                    pop(lang('network_error'), false);
            }
        }

        //是否提交过退出申请
        if (data.quitInfo) {
            let status = data.quitInfo.status, text;
            let rebackCount = data.rebackCount;
            let creatTime = new Date(data.quitInfo.createTime);
            let rebackTrxId = data.quitInfo.rebackTrxId;

            switch (status) {
                case -1:
                    text = lang('exit');
                    break;
                case -2:
                    text = lang('exit_transfer');
                    break;
                case -3:
                    text = lang('exit_success');
                    break;
            }

            //设置退出状态
            $('#exit_status').empty().text(text);


            //隐藏退出申请列表
            $('#exit_form').hide(0);


            //显示退出申请信息
            $('#exit_info').show(0);


            //设置退出信息内容
            $('#rebackCount').empty().text(rebackCount + `UL`);
            $('#createTime').empty().text(creatTime);
            $('#rebackTrxId').empty().text(rebackTrxId);
        }


        let list = {
            rebackCount: data.rebackCount,
            admin: data.userInfo.admin,
            token: data.userInfo.token,
        }, user = data.userInfo.user;


        Object.keys(user).forEach(key => {
            list[key] = user[key];
        });


        let phone = list.phone, withdrawAddress = list.withdrawAddress,
            shareRate = list.shareRate, id = list.id;


        //如果该用户无节点名
        let bind_delegateName = $('#bind_delegateName');
        if (!list.delegateName) {
            bind_delegateName.show(0);

            //显示‘普通用户’
            $('.user_NoDelegateName').show(0);

            //隐藏‘账户：节点名’
            $('.user_delegateName').hide(0);

            //显示超级节点名输入框
            $('.info_delegateName').next().show(0);

        }

        //点击绑定节点名
        bind_delegateName.click(e => {

            //显示提示框
            list_animate($('#bind_delegateName_win'), 'fadeIn', 'fadeOut');
        });

        let delegateName = list.delegateName;


        //form赋值
        form.phone = phone;
        form.withdrawAddress = withdrawAddress;
        form.shareRate = shareRate;
        form.shareNum = shareRate;
        form.delegateName = delegateName;
        form.delegateId = id;


        // 手机号
        $('.info_phone').empty().text(phone);


        //超级节点名
        $('.info_delegateName,#user_delegateName').empty().text(delegateName);


        //隐藏超级节点名输入框
        $('.info_delegateName').next().hide(0);


        //分红
        let info_shareRate = $('#info_shareRate');
        info_shareRate.val(parseInt(shareRate * 100));


        //获取用户输入的分红
        info_shareRate.bind('input propertychange', e => {
            let id = e.target.id, val = $('#' + id).val();

            if (val !== '') {
                form.shareRate = parseInt(val) / 100;
                form.shareNum = parseInt(val) / 100;
            } else {
                form.shareRate = undefined;
                form.shareNum = undefined;
            }
        });


        //点击修改密码
        $('#modifed').click(e => {
            let list = $('.change-password-wrap');
            if (list.css('display') === 'none') {
                list.slideDown(400);
                $(e.target).empty().text(lang('close'))
            } else {
                $(e.target).empty().text(lang('change_pwd'));
                list.slideUp(400);

                //清空输入密码
                $('#password_input').val('');
                $('#password_again_input').val('');
            }
        });


        let change_address_btn = $('#bind_address');

        //该用户是否绑定钱包地址
        if (withdrawAddress) {
            $('.address').empty().text(withdrawAddress);

            //将地址放入输入地址框的val
            $('.userInfoAddress').val(withdrawAddress);

            //隐藏地址框的线
            let li = $('.userInfoAddress').parent().parent();
            li.addClass('noLine');

            // change_address_btn.empty().text(lang('change')).attr('data-type', 'change');


        } else {
            //显示地址输入框
            $('.userInfoAddress').show(0);

            //隐藏地址显示框与修改按钮
            $('.hasWithDrawAddress').hide(0);

            let li = $('.userInfoAddress').parent().parent();
            // change_address_btn.empty().text(lang('bind')).attr('data-type', 'bind');
        }


        //点击修改按钮或者绑定按钮时
        change_address_btn.click(e => {
            let text = $(e.target).attr('data-type'), title = $('#bind_address_title');

            text === 'bind' ? title.empty().text(lang('bind_address')) : title.empty().text(lang('change_address'));

            list_animate($('#bind_address_win'), 'fadeIn', 'fadeOut');
        });


        // l(list);


        //发送短信验证码
        let send_btn = $('.mes-code');

        send_btn.click(() => {
            if (!send_btn.hasClass('send_waite')) {
                tip.empty();
                let phone_arr = phone.split(' ');
                let num = phone_arr[0].split('+')[1];
                let phone_num = phone_arr[1];
                send_msg(tip_, send_btn, phone_num, num, 2);
            }
        });


        //隐藏登录按钮
        $('.login_btn').removeClass('show').addClass('hide');


        //展示个人信息按钮
        $('.user_info_btn').removeClass('hide').addClass('show');


        //退出form
        let form_exit = {};
        let exit_tip = $('#exit_tip');


        //退出节点获取图形验证码
        let send_apply_exit = $('#send_apply_exit');
        get_new_graphic_code(send_apply_exit, form_exit);


        //退出页面获取短信验证码
        let send_msg_exit = $('#send_msg_exit');

        send_msg_exit.click(() => {
            if (!send_msg_exit.hasClass('send_waite')) {
                exit_tip.empty();

                let phone_arr = form.phone.split(' ');
                let num = phone_arr[0].split('+')[1];
                let phone_num = phone_arr[1];
                send_msg(exit_tip, send_msg_exit, phone_num, num, 2);
            }
        });


        //获取验证码与密码
        let signcode, smscode, password;

        function check_exit_form() {
            signcode = $('#signcode_input_exit').val(), smscode = $('#smscode_input_exit').val(),
                password = $('#password_input_exit').val();

            if (signcode && smscode && password) {
                return true;
            } else {
                tip_(lang('info_incomplete'), exit_tip);
                return false;
            }
        }


        //退出申请
        $('#submit_exit_btn').click(e => {
            //验证
            if (check_exit_form()) {
                form_exit['delegateName'] = form.delegateName;
                form_exit['signcode'] = signcode;
                form_exit['smscode'] = smscode;
                form_exit['phone'] = form.phone;
                form_exit['withdrawAddress'] = form.withdrawAddress;
                form_exit['password'] = md5($('#password_input_exit').val());


                //清空提示
                tip_('', exit_tip);

                ajax_('/submitWithdraw', form_exit, 1).then(data => {
                    l(data);
                    //获取新的图形验证码
                    get_new_graphic_code(graphic_code_box, form);
                    pop(lang('submit_success'), 1);

                    //刷新当前页
                    location.reload();

                }).catch(data => {
                    if (data.retCode === 400) {
                        href('login');
                    } else {
                        tip_(data.retMsg, exit_tip);
                    }
                });
            }
        });


        //获取提币记录 未发放数量
        ajax_('/unconfirmedNums', {
            phone: form.phone.split(' ')[1]
        }, 1).then(data => {
            if (data) {
                $('.extract_token_num').empty().text(data)
            } else {
                $('.extract_token_num').empty().text(lang('none'))
            }
            l(data);
        }).catch(data => {
            if (data.retCode === 400) {
                href('login');
            } else {
                tip_(data.retMsg);
            }
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

        function for_(box, list) {
            box.empty();
            list.forEach(el => {
                box.append(`
                        <tr>
                            <td>${new Date(el.createTime)}</td>
                            <td>${el.voteNum}</td>
                            <td>${el.reward}</td>
                            <td>${el.income}</td>
                            <td>${el.isShare}</td>
                            <td>
                                <a href="share_details.html?payId=${el.id}&voteNum=${el.voteNum}&income=${el.income}&reward=${el.reward}">${lang('detail')}</a>
                            </td>
                        </tr>
                    `);
                l(el);
            });
        }

        //提币记录
        let body = $('#extract_token_body');
        const rows = 20;
        ajax_('/withdraw', {
            page: 1,
            rows: rows,
            delegateName: form.delegateName,
            phone: null
        }, 1).then(data => {
            if (data.total > 0) {
                let list = data.rows, total = data.total;

                //向上取整获得页数
                let page_num = Math.ceil(total / 20);
                l(page_num);

                //渲染分页器
                render(1, 5);

                //第一页选中状态
                $('.other_page').find('.change_page').eq(0).addClass('active');


                //点击第一页按钮时
                $('.first_page').click(() => {
                    ajax_('/withdraw', {
                        page: 1,
                        rows: rows,
                        delegateName: form.delegateName,
                        phone: null
                    }, 1).then((data) => {
                        for_(body, data.rows);
                    });

                    render(1, 5);

                    for (let el of $('.change_page')) {
                        let active_num = $(el)[0].dataset.num;
                        if (parseInt(active_num) === 1) {
                            $(el).addClass('active')
                        }
                    }
                });


                //点击最后一页按钮时
                $('.last_page').click(() => {
                    ajax_('/withdraw', {
                        page: page_num,
                        rows: rows,
                        delegateName: form.delegateName,
                        phone: null
                    }, 1).then((data) => {
                        for_(body, data.rows);
                    });

                    //最后一页选中状态
                    $('.change_page').eq(4).addClass('active');

                    render(page_num - 4, page_num);


                    for (let el of $('.change_page')) {
                        let active_num = $(el)[0].dataset.num;
                        if (parseInt(active_num) === parseInt(page_num)) {
                            $(el).addClass('active')
                        }
                    }
                });


                //点击页面跳转按钮时
                $('.other_page').on('click', '.change_page', e => {
                    let num = e.target.dataset.num;

                    //如果总页数大于5
                    if (!page_num <= 5) {
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
                    }

                    for (let el of $('.change_page')) {
                        let active_num = $(el)[0].dataset.num;
                        if (active_num === num) {
                            $(el).addClass('active')
                        }
                    }

                    ajax_('/withdraw', {
                        page: num,
                        rows: rows,
                        delegateName: form.delegateName,
                        phone: null
                    }, 1).then((data) => {
                        for_(body, data.rows);
                    })
                });


                for_(body, list);
            } else {
                $('#extract_token_bottom').hide(0);
                $('.paging').hide(0);
            }
        }).catch(data => {
            if (data.retCode === 400) {
                href('login');
            } else {
                tip_(data.retMsg);
            }
        });


    }).catch(data => {
        pop(data.retMsg, false);
        setTimeout(href('login'), 5000);
    });


    // 点击确定绑定
    // $('#bind_delegateName_btn').click(e => {
    //     let delegateName = $('#bind_delegateName_input').val();
    //
    //     //验证节点名是否为空
    //     if (delegateName) {
    //         if (test_delegate_name(delegateName)) {
    //             //form赋值
    //             form.delegateName = delegateName;
    //
    //             $('.info_delegateName').empty().text(delegateName);
    //
    //             $('#bind_delegateName').hide(0);
    //
    //             //关闭弹窗
    //             $('#bind_delegateName_win').animate({}, () => {
    //                 $('#bind_delegateName_win').addClass('fadeOutDown').removeClass('fadeInUp').fadeOut(300, () => {
    //                     $('#bind_delegateName_win').css({display: "none"});
    //                 });
    //             });
    //
    //             //清空提示信息
    //             $('.win_tip').empty();
    //         } else {
    //             $('.win_tip').empty().text(lang('delegate_name_format_error'))
    //         }
    //     } else {
    //         $('.win_tip').empty().text(lang('node_name_cant_null'))
    //     }
    // });


    //验证必填信息
    function check_form() {
        if (form.signcode && form.smscode) {

            //验证分红比例
            if (!(form.shareRate > 0 && form.shareRate < 1)) {
                tip_(lang('dividend_rate_error'));
                return false;
            } else {
                //存在节点名
                if (form.delegateName) {
                    if (test_delegate_name(form.delegateName)) {
                        //两个密码都空或者都有内容的情况下
                        // if ((!form.password && !form.passwordAgain) || (form.password && form.passwordAgain)) {
                        //两项密码都为空
                        // if (!form.password) {
                        //     return true;
                        // }
                        //两项密码都为true
                        // if (form.password) {
                        //两项密码相同
                        // if (form.password === form.passwordAgain) {
                        //密码格式正确
                        // if (test_password(form.password)) {

                        /*
                         * new  新版改为密码不在此处进行验证
                         */
                        return true;
                        // } else {
                        //     //密码格式错误
                        //     tip_(lang('password_format_error'));
                        //     return false
                        // }
                        // } else {
                        //     //两项密码不相同
                        //     tip_(lang('password_not_same'));
                        //     return false;
                        // }
                        // }
                        // } else {
                        //     //两项密码有一项为false
                        //     tip_(lang('info_incomplete'));
                        //     return false;
                        // }
                    } else {
                        //节点名格式错误
                        tip_(lang('node_error'));
                        return false;
                    }
                } else {
                    //节点名不存在
                    tip_(lang('node_name_cant_null'));
                    return false;
                }
            }
        } else {
            tip_(lang('info_incomplete'));
            return false;
        }
    }


    //保存提交信息
    // $('#save_btn').click(e => {
    //     if (check_form()) {
    //         let new_form = JSON.parse(JSON.stringify(form));
    //         //密码不为空时
    //         if (new_form.password) {
    //             new_form.password = md5(new_form.password);
    //             new_form.passwordAgain = md5(new_form.passwordAgain);
    //         }
    //
    //         ajax_('/modify', new_form, 1).then(data => {
    //             tip_('');
    //             pop(lang('save_success'), 1);
    //
    //             //刷新当前页
    //             location.reload();
    //         }).catch(data => {
    //             if (data.retCode === 400) {
    //                 href('login');
    //             } else {
    //                 tip_(data.retMsg);
    //             }
    //         });
    //     }
    // });


    //提交为候选节点
    $('#submitForSuperNode').click(e => {

        //验证
        if (check_form()) {

            //验证提币地址
            if (form.withdrawAddress) {

                //form添加shareNum 不知道是什么
                ajax_('/application', form, 1).then(data => {
                    //获取新的图形验证码
                    get_new_graphic_code(graphic_code_box, form);
                    pop(lang('submit_success'), 1);

                    //刷新当前页
                    location.reload();

                }).catch(data => {
                    if (data.retCode === 400) {
                        href('login');
                    } else {
                        tip_(data.retMsg);
                    }
                });

            } else {
                tip_(lang('withdrawAddress_empty'));
            }
        }
    });


    //核对后确认提交
    // $('#submit_node_btn').click(e => {
    //     关闭弹窗
    //     $('#submit_node_win').animate({}, () => {
    //         $('#submit_node_win').addClass('fadeOutDown').removeClass('fadeInUp').fadeOut(300, () => {
    //             $('#submit_node_win').css({display: "none"});
    //         });
    //     });
    //
    //
    //     //form添加shareNum 不知道是什么
    //     ajax_('/application', form, 1).then(data => {
    //         //获取新的图形验证码
    //         get_new_graphic_code(graphic_code_box, form);
    //         pop(lang('submit_success'), 1);
    //
    //         //刷新当前页
    //         location.reload();
    //
    //     }).catch(data => {
    //         if (data.retCode === 400) {
    //             href('login');
    //         } else {
    //             tip_(data.retMsg);
    //         }
    //     });
    // });
});