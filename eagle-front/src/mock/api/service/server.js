import Mock from 'mockjs'

let Random = Mock.Random;

let servers = [
    {
        'id': 1,
        'name': '[#server-name 1]',
        'ip': Random.ip(),
        'scrapyd_port': 6800,
        'username': 'root',
        'password': Random.upper(Random.word(6, 12)),
        'desc': Random.paragraph(2, 5)
    },
    {
        'id': 2,
        'name': '[#server-name 2]',
        'ip': Random.ip(),
        'scrapyd_port': 6800,
        'username': 'root',
        'password': Random.upper(Random.word(6, 12)),
        'desc': Random.paragraph(2, 5)
    }
];

Mock.mock('/api/server/list', 'get', () => {
    return {
        code: 0,
        servers: servers
    };
});

Mock.mock('/api/server/ssh_check', 'post', (options) => {
    for (let k in ["username", 'password']) {
        if (!options.body.hasOwnProperty(k)) {
            return {
                code: 300,
                msg: 'missing required params:'
            }
        }
    }

    return {
        code: 0,
        ssh_connection: Random.boolean(7, 3, true),
        msg: 'success'
    }
});

Mock.mock('/api/server/add', 'post', (options) => {
    for (let k in ['name', 'ip', 'scrapyd_port', 'username', 'password']) {
        if (!options.body.hasOwnProperty(k)) {
            return {
                code: 300,
                msg: 'missing required params:'
            }
        }
    }

    let new_server = JSON.parse(options.body);
    new_server['id'] = servers.length + 1;
    servers.push(new_server);

    return {
        code: 0,
        server_id: new_server['id'],
        msg: 'success'
    };
});

Mock.mock('/api/server/edit', 'post', (options) => {
    console.log(options.body);
    let obj = JSON.parse(options.body);
    console.log(obj);

    if (!obj.hasOwnProperty('id')) {
        return {
            code: 300,
            msg: 'missing required params:'
        }
    }

    console.log('through validation test');

    let serv = servers.find(s => s.id === obj.id);

    if (serv) {
        let index = servers.indexOf(serv);
        servers[index] = obj;
        console.log(servers[index]);
        return {
            code: 0,
            msg: 'success'
        };
    }

    return {
        code: 500,
        msg: 'can not find server by giving server.id'
    }
});

Mock.mock('/api/server/del', 'post', (options) => {
    let obj = JSON.parse(options.body);
    if (!obj.hasOwnProperty('id')) {
        return {
            code: 300,
            msg: 'missing required params:'
        }
    }

    let serv = servers.find(s => s.id === obj.id);
    console.log(serv);
    if (serv) {
        let index = servers.indexOf(serv);
        console.log('index: %i', index);
        if (index > -1) {
            servers.splice(index, 1);
            console.log('servers:%o', servers);
            return {
                code: 0,
                msg: 'success'
            }
        }
    }

    return {
        code: 500,
        msg: 'can not find server by giving server.id'
    }
});