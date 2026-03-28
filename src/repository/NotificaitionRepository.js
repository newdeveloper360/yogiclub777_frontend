import Repository from "./Repository";

function getNotifications(payload){
    return Repository.get(`/get-notifications?page=${payload.page}`);
}

export {
    getNotifications
};
