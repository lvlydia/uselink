$(() => {
    //默认一屏高度 new
    $('#share_details').css({'min-height': $(window).height() - $('.footer').height()});


    let url_arr = url.split('?')[1].split('&');
    let payId, voteNum, income, reward;

    for (let q of url_arr) {

        if (q.includes('voteNum')) {
            $('#voteNum').empty().text(q.split('=')[1]);
            voteNum = q.split('=')[1];

        }

        if (q.includes('reward')) {
            $('#reward').empty().text(q.split('=')[1]);
            reward = q.split('=')[1];
        }

        if (q.includes('income')) {
            $('#income').empty().text(q.split('=')[1]);
            income = q.split('=')[1];
        }

        if (q.includes('payId')) {
            payId = q.split('=')[1];
        }

    }

    ajax_('/withdrawDetail', {
        payId: parseInt(payId),
        page: 1,
        rows: 1,
    }, 1).then(data => {
        let info = data.rows[0];
        let box = $('.content');

        box.empty();
        let time = new Date(info.createTime), year = time.getFullYear();
        let month = time.getMonth() < 10 ? '0' + time.getMonth() : time.getMonth();
        let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();

        let newT = year + '/' + month + '/' + date + ' ' + hours + ':' + minute;

        box.append(`<li>
                           <div class="time">${newT}</div>
                           <div class="vote">${info.voteNum}</div>
                           <div class="reward">${info.amount}</div>
                           <div class="share">${info.fee}</div>
                           <div class="whether">${info.status === 1 ? lang('init') : info.status === 2 ? lang('notSure') : info.status === 3 ? lang('sure') : info.status === 4 ? lang('surnoAddresse') : info.status === 5 ? lang('error1') : info.status === 6 ? lang('error2') : ''}</div>
                       </li>`);

    }).catch(data => {
        if (data.retCode === 400) {
            href('login');
        } else {
            tip_(data.retMsg);
        }
    });
});