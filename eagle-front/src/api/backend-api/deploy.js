import request from '@/plugin/axios'

let base_url = 'http://192.168.137.166:8000/api/';

export function GetProjectPath(root) {
    return request({
        url: base_url + '/get_project_path?root=' + root,
        method: 'get',
    })
}

export function DoDeploy(data) {
    return request({
        url: base_url + '/do_deploy_project',
        method: 'post',
        data
    })
}