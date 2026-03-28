export function setBetModelCookie() {
    let now = new Date();
    let midnight = new Date();

    midnight.setDate(now.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    return document.cookie = `betModelHide=true; expires=${midnight.toUTCString()}; path=/`;
}

export function getCookie(name) {
    let cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        let [key, value] = cookies[i].split('=');
        if (key === name) {
            return value;
        }
    }
    return null; 
}
