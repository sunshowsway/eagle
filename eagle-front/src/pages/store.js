const SERVER_KEY = 'server_global';

export default {
    getServer() {
        return window.localStorage.getItem(SERVER_KEY) || '';
    },
    setServer(server) {
        window.localStorage.setItem(SERVER_KEY, server);
    }
}