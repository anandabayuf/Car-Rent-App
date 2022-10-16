import { BASE_URL } from './Helper';

const getAllBorrows = async () => {
	try {
		const response = await fetch(`${BASE_URL}/borrow`, {
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

const getBorrowById = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/borrow/${id}`, {
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

const getBorrowByCar = async (carPlateNo) => {
	try {
		const response = await fetch(`${BASE_URL}/borrow/car/${carPlateNo}`, {
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

const searchBorrow = async (category, query) => {
	try {
		const response = await fetch(
			`${BASE_URL}/borrow?${category}=${query}`,
			{
				headers: {
					Authorization: localStorage.getItem('TOKEN'),
				},
			}
		);
		const responseJson = await response.json();

		return responseJson;
	} catch (err) {
		alert(err);
	}
};

const createBorrow = async (data) => {
	try {
		const response = await fetch(`${BASE_URL}/borrow`, {
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

const updateBorrowStatus = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/borrow/status/${id}`, {
			method: 'PUT',
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
	getAllBorrows,
	getBorrowById,
	getBorrowByCar,
	searchBorrow,
	createBorrow,
	updateBorrowStatus,
};
