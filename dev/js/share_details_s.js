$(() => {
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
        page:1,
        rows:1,
    },1).then(data => {
        let info=data.rows[0];

        $('#body').append(`
                <tr>
                   <td>${new Date(info.createTime)}</td>
                   <td>${info.voteNum}</td>
                   <td>${info.amount}</td>
                   <td>${info.fee}</td>
                   <td>${info.status===1?'初始化':info.status===2?'交易未确定':info.status===3?'交易已确定':info.status===4?'代理节点未绑定提现地址':info.status===5?'提币失败,需要重新打款':info.status===6?'异常待核实':''}</td>
                </tr>
        `);

        l(info);
    }).catch(data => {
        if (data.retCode === 400) {
            href('login');
        } else {
            tip_(data.retMsg);
        }
    });
});