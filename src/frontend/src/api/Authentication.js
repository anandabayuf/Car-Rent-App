import { BASE_URL } from './Helper';

const logIn = async (credential) => {
	try {
		const response = await fetch(`${BASE_URL}/user/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credential),
		});

		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const signUp = async (data) => {
	try {
		const response = await fetch(`${BASE_URL}/user/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

export { logIn, signUp };
