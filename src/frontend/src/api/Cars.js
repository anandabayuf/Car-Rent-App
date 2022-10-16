import { BASE_URL } from './Helper';

const getAllCars = async () => {
	try {
		const response = await fetch(`${BASE_URL}/car`, {
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

const getCarById = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/car/${id}`, {
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

const searchCar = async (category, query) => {
	try {
		const response = await fetch(`${BASE_URL}/car?${category}=${query}`, {
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

const getAvailableCars = async () => {
	try {
		const response = await fetch(`${BASE_URL}/car?status=Available`, {
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

const createCar = async (data) => {
	const formData = new FormData();

	const { picture, ...carData } = data;

	formData.append('picture', picture);
	formData.append('data', JSON.stringify(carData));

	try {
		const response = await fetch(`${BASE_URL}/car`, {
			method: 'POST',
			headers: {
				Authorization: localStorage.getItem('TOKEN'),
			},
			body: formData,
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const updateCar = async (id, data) => {
	const formData = new FormData();

	const { picture, ...carData } = data;

	if (picture) {
		formData.append('picture', picture);
	}

	formData.append('data', JSON.stringify(carData));

	try {
		const response = await fetch(`${BASE_URL}/car/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: localStorage.getItem('TOKEN'),
			},
			body: formData,
		});
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const deleteCar = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/car/${id}`, {
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
	getAllCars,
	getCarById,
	searchCar,
	getAvailableCars,
	createCar,
	updateCar,
	deleteCar,
};
