import Repository from './Repository';

function getGroupPostingMessages() {
	return Repository.get(`/group-posting/get`);
}

function sendGroupPostingMessages(payload) {
	return Repository.post(`/group-posting/send-message`, payload);
}

function getDepositMessages() {
	return Repository.get(`/deposit-chat/get`);
}

function sendDepositMessages(payload) {
	let formData = new FormData();
	if (payload.file) {
		formData.append('file', payload.file);
		formData.append('file_type', payload.fileType);
	}
	if (payload.message !== '')
		formData.append('message', payload.message || '');
	return Repository.post(`/deposit-chat/send-message`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
}

function getWithdrawMessages() {
	return Repository.get(`/withdraw-chat/get`);
}

function sendWithdrawMessages(payload) {
	let formData = new FormData();
	if (payload.file) {
		formData.append('file', payload.file);
		formData.append('file_type', payload.fileType);
	}
	if (payload.message !== '')
		formData.append('message', payload.message || '');
	return Repository.post(`/withdraw-chat/send-message`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
}

export {
	sendGroupPostingMessages,
	sendWithdrawMessages,
	sendDepositMessages,
	getGroupPostingMessages,
	getWithdrawMessages,
	getDepositMessages,
};
