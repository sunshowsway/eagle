import Mock from 'mockjs'

Mock.mock('/api/runtime/check', 'get', () => {

    let msg = Math.random() > 0.5 ? 'ok' : 'error';

    return {
        code: 0,
        msg: msg
    };
});

Mock.mock('/api/runtime/stopalljobs', 'get', () => {
    // let activeJobs = JSON.parse(jobs);
    return {
        code: 0,
        msg: '已停止全部任务'
    };
});
