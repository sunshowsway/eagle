import request from '@/plugin/axios'

let base_url = 'http://192.168.137.166:8000/api/';

export function AddServer(data) {
    return request({
        url: base_url + 'add_server',
        method: 'post',
        data
    })
}

export function ShowServer() {
    return request({
        url: base_url + 'show_servers',
        method: 'get',
        withCredentials: false,
    })
}

export function DelServer(data) {
    return request({
        url: base_url + 'delete_server',
        method: 'post',
        data
    })
}

export function EditServer(data) {
    return request({
        url: base_url + 'edit_server',
        method: 'post',
        data
    })
}

export function TestConnection(data) {
    return request({
        url: base_url + 'test_connection',
        method: 'post',
        data
    })
}