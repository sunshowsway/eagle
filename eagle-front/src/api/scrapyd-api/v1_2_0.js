import request from '@/plugin/axios'

export function DaemonStatus(data) {
    return request({
        url: 'http://' + data.server + '/daemonstatus.json',
        method: 'get'
    })
}

export function ProjectList(data) {
    return request({
        url: 'http://' + data.server + '/listprojects.json',
        method: 'get'
    })
}

export function DelProject(data) {
    return request({
        url: 'http://' + data.server + '/delproject.json',
        method: 'post',
        data: {project: data.project}
    })
}

export function VersionList(data) {
    return request({
        url: 'http://' + data.server + '/listversions.json?project=' + data.project,
        method: 'get'
    });
}

export function DelVersion(data) {
    return request({
        url: 'http://' + data.server + '/delversion.json',
        method: 'post',
        data: {project: data.project, version: data.version}
    })
}

export function JobList(data) {
    return request({
        url: 'http://' + data.server + '/listjobs.json?project=' + data.project,
        method: 'get'
    })
}

export function CancelJob(data) {
    return request({
        url: 'http://' + data.server + '/cancel.json',
        method: 'post',
        data
    })
}

export function SpiderList(data) {
    return request({
        url: 'http://' + data.server + '/listspiders.json?project=' + data.project,
        method: 'get'
    })
}

export function Schedule(data) {
    return request({
        url: 'http://' + data.server + '/schedule.json',
        method: 'post',
        data
    })
}