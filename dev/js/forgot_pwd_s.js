$(() => {
    //简写控制台报错
    function err(str) {
        throw new Error(lang(str))
    }

    //验证部分
    let form = {
        phone_input: undefined,

        graphic_code_input: undefined,

        msg_code_input: undefined,

        password_input: undefined,

        password_again_input: undefined,

        phone_select_num: undefined,

        phone_select_id: undefined,
    };


    //获取国家信息
    getNationInfo(form);


    //获取默认区号
    form.phone_select_num = $('.select_default').data('num');
    form.phone_select_id = $('.select_default').data('id');


    //获取提示框
    let tip = $('#tip');

    //提示信息
    function tip_(str) {
        tip.empty().text(str);
    }

    //获取图形验证码
    let graphic_code_box = $('.pic-code');
    get_new_graphic_code(graphic_code_box);

    //点击验证码获取新的验证码
    graphic_code_box.click(() => {
        get_new_graphic_code();
    });

    //获取用户输入信息
    $('.login-input').bind('input propertychange', e => {
        let id = e.target.id, val = $('#' + id).val();

        form[id] = val;

        // l(form)
    });

    //发送短信验证码
    let send_btn = $('#send_msg');
    send_btn.click(() => {
        if (!send_btn.hasClass('send_waite')) {
            tip.empty();

            if (form.phone_input && test_phone(form.phone_input)) {

                ajax_('/sendCode', {
                    phone: form.phone_input,
                    nationNumber: form.phone_select_num,
                    type: 2
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
            } else {
                tip_(lang('phone_format_error'));
            }
        }
    });

    //点击确认按钮
    $('#forgot_password_btn').click(() => {
        let num = 0;
        let true_num=7;

        Object.keys(form).forEach(function (key) {
            form[key] ? num++ : num;
        });

        if (num === true_num) {

            //手机号验证
            if (!test_phone(form.phone_input)) {
                tip_(lang('phone_format_error'));
                return false;
            }

            //二次密码是否相等
            if (!(form.password_input === form.password_again_input)) {
                tip_(lang('password_not_same'));
                return false;
            }

            //密码格式验证
            if (!(test_password(form.password_again_input))) {
                tip_(lang('password_format_error'));
                return false;
            }

            ajax_('/retrieve', {
                phone: form.phone_input, //手机号
                password: md5(form.password_input), //密码
                passwordAgain: md5(form.password_again_input), //再次确认
                smscode: form.msg_code_input, //短信
                shareRate: null, //分红
                withdrawAddress: form.address_input, //地址
                pictureId: pictureId,
                signcode: form.graphic_code_input,
                delegateName: form.delegate_name_input,
                nationNumber: form.phone_select_num,
                nationId: form.phone_select_id,
            }).then(data => {
                get_new_graphic_code();

                pop(lang('success'),1);

                window.location.href = 'login.html';
            }).catch(data=>{
                tip_(data.retMsg);
            });


            tip.empty();
        } else {
            tip_(lang('info_incomplete'));
        }
    })
});