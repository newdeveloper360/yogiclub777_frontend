import Repository from "./Repository";

function getAppData(){
    return Repository.get(`/get-app-data`)
}

export {
    getAppData
};
