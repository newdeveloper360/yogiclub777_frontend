import Repository from "./Repository";

function sendLoginOtp(payload){
    return Repository.post(`/send-login-otp?phone=${payload.phone}`)
}
function verifyLoginOtp(payload){
    return Repository.post(`/verify-login-otp?phone=${payload.phone}&otp=${payload.otp}`)
}
function updateProfile(payload){
    return Repository.post(`/update-profile?name=${payload.name}&dob=${payload.dob}&email=${payload.email}`)
}

function submitReferralCode(payload){
    return Repository.post(`/submit-refer-code?refer_code=${payload.refer_code}`)
}

export {
    sendLoginOtp,
    verifyLoginOtp,
    updateProfile,
    submitReferralCode
};
