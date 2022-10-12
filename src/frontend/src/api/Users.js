import { BASE_URL } from './Helper';

const getAllUsers = async () => {
	try {
		const response = await fetch(`${BASE_URL}/user`, {
			headers: {
				Authorization: localStorage.getItem('TOKEN'),
			},
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const getUserById = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/user/${id}`, {
			headers: {
				Authorization: localStorage.getItem('TOKEN'),
			},
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const searchUser = async (category, query) => {
	try {
		const response = await fetch(`${BASE_URL}/user?${category}=${query}`, {
			headers: {
				Authorization: localStorage.getItem('TOKEN'),
			},
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const createUser = async (data) => {
	try {
		const response = await fetch(`${BASE_URL}/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('TOKEN'),
			},
			body: JSON.stringify(data),
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const updateUser = async (id, data) => {
	try {
		const response = await fetch(`${BASE_URL}/user/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('TOKEN'),
			},
			body: JSON.stringify(data),
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const deleteUser = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/user/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: localStorage.getItem('TOKEN'),
			},
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

export {
	getAllUsers,
	getUserById,
	searchUser,
	createUser,
	updateUser,
	deleteUser,
};
