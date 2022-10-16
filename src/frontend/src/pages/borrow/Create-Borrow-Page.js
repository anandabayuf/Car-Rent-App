import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBorrow } from '../../api/Borrows';
import { getAvailableCars } from '../../api/Cars';
import Loader from '../../components/Loader';
import MessageToast from '../../components/Message-Toast';
import { idrFormat } from '../../utils/Formatter';

export default function CreateBorrowPage() {
	const [borrow, setBorrow] = useState({
		departDate: '',
		returnDate: '',
		daysToBorrow: 0,
		hoursToBorrow: 0,
		downPayment: 0,
	});

	const [customer, setCustomer] = useState({
		name: '',
		ID: '',
		address: '',
		phoneNumber: '',
	});

	const [selectedCar, setSelectedCar] = useState({
		plateNo: '',
		car: null,
		base64String: '',
	});

	const [cars, setCars] = useState([]);

	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const navigate = useNavigate();

	const getCars = async () => {
		setIsFetching(true);
		const response = await getAvailableCars();

		setTimeout(async () => {
			setIsFetching(false);
			if (response.status.includes('401')) {
				localStorage.removeItem('TOKEN');
				navigate('/login', {
					state: {
						toastState: {
							show: true,
							title: 'Session Expired',
							message: 'Your session has expired, please login',
						},
					},
				});
			} else {
				const data = await response.data;

				setCars(data);
			}
		}, 1000);
	};

	const setDefaultDepartAndReturnDate = () => {
		const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
		const localISOTimeDepart = new Date(new Date() - tzoffset)
			.toISOString()
			.slice(0, -1);
		const localISOTimeReturn = new Date(
			new Date().setDate(new Date().getDate() + 1) - tzoffset
		)
			.toISOString()
			.slice(0, -1);

		const diffTime = Math.abs(
			new Date(localISOTimeDepart) - new Date(localISOTimeReturn)
		);

		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		setBorrow({
			...borrow,
			departDate: localISOTimeDepart.substring(0, 16),
			returnDate: localISOTimeReturn.substring(0, 16),
			daysToBorrow: diffDays,
			hoursToBorrow: 0,
		});
	};

	useEffect(() => {
		setDefaultDepartAndReturnDate();
		getCars();
	}, []);

	const handleChangeBorrow = (e) => {
		const key = e.target.name;
		let value = e.target.value;

		// if(key === "departDate"){

		// }
		// const date = new Date(value);
		// const isoDate = date.toISOString().split('.')[0];

		// var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
		// var localISOTime = new Date(new Date(value) - tzoffset)
		// 	.toISOString()
		// 	.slice(0, -1);

		// console.log(localISOTime.substring(0, 16));
		if (
			key === 'departDate' &&
			new Date(value) > new Date(borrow.returnDate)
		) {
			const diffTime = Math.abs(new Date(value) - new Date(value));

			let diffDays = diffTime / (1000 * 60 * 60 * 24);
			let remains = 0;

			if (diffDays % 1 !== 0) {
				remains = diffDays % 1;
				diffDays -= remains;
				remains *= 24;
			}

			setBorrow({
				...borrow,
				[key]: value,
				returnDate: value,
				daysToBorrow: diffDays,
				hoursToBorrow: remains,
			});
		} else if (key === 'departDate' || key === 'returnDate') {
			const diffTime = Math.abs(
				new Date(value) -
					new Date(
						key === 'departDate'
							? borrow.returnDate
							: borrow.departDate
					)
			);

			let diffDays = diffTime / (1000 * 60 * 60 * 24);

			let remains = 0;
			if (diffDays % 1 !== 0) {
				remains = diffDays % 1;

				diffDays -= remains;
				remains = Math.round(remains * 24);
			}

			setBorrow({
				...borrow,
				[key]: value,
				daysToBorrow: diffDays,
				hoursToBorrow: remains,
			});
		} else if (key === 'downPayment') {
			setBorrow({
				...borrow,
				[key]: isNaN(parseInt(value)) ? 0 : parseInt(value),
			});
		} else {
			setBorrow({
				...borrow,
				[key]: value,
			});
		}
	};

	const handleChangeCustomer = (e) => {
		const key = e.target.name;
		const value = e.target.value;

		setCustomer({
			...customer,
			[key]: value,
		});
	};

	const handleChangeCar = (e) => {
		const car = cars.filter((el) => el.plateNo === e.target.value)[0];

		if (car) {
			setSelectedCar({
				...selectedCar,
				plateNo: e.target.value,
				car: car,
				base64String: btoa(
					new Uint8Array(car.picture.data.data).reduce(function (
						data,
						byte
					) {
						return data + String.fromCharCode(byte);
					},
					'')
				),
			});
		} else {
			setSelectedCar({
				plateNo: '',
				car: null,
				base64String: '',
			});
		}
	};

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();

		const { departDate, returnDate, ...rest } = borrow;

		let payload = {
			...rest,
		};

		payload['carPlateNo'] = selectedCar.plateNo;
		payload['carId'] = selectedCar.car._id;

		payload['customer'] = customer;

		payload['departDate'] = new Date(departDate);
		payload['returnDate'] = new Date(returnDate);

		payload['totalCost'] =
			selectedCar.car.rentPrice.perDay * borrow.daysToBorrow +
			selectedCar.car.rentPrice.perHour * borrow.hoursToBorrow;
		payload['remains'] = payload['totalCost'] - borrow.downPayment;

		// console.log(payload);

		const response = await createBorrow(payload);

		setTimeout(() => {
			setIsLoading(false);

			if (response.status.includes('401')) {
				localStorage.removeItem('TOKEN');
				navigate('/login', {
					state: {
						toastState: {
							show: true,
							title: 'Session Expired',
							message: 'Your session has expired, please login',
						},
					},
				});
			} else if (response.status.includes('201')) {
				navigate('/transaction/borrows', {
					state: {
						toastState: {
							show: true,
							title: 'Success',
							message: response.message,
						},
					},
				});
			} else {
				setToastState({
					...toastState,
					show: true,
					title: 'Error',
					message: response.message,
				});
				setTimeout(() => {
					setToastState({
						...toastState,
						show: false,
						title: '',
						message: '',
					});
				}, 5000);
			}
		}, 1000);
	};

	const handleCancel = () => {
		navigate('/transaction/borrows');
	};

	const style = {
		page: {
			padding: '30px',
			paddingTop: '70px',
			backgroundColor: '#F9F7F7',
		},
		title: {
			color: '#112D4E',
		},
		label: {
			color: '#3F72AF',
		},
		input: {
			borderRadius: '10px',
			borderColor: '#DBE2EF',
			color: '#3F72AF',
		},
		loader: {
			color: '#3F72AF',
		},
		card: {
			border: 'none',
			borderRadius: '20px',
			padding: '20px',
		},
		button: {
			borderRadius: '15px',
		},
	};

	return (
		<div
			className="min-vh-100"
			style={style.page}
		>
			<div className="container">
				<h3
					className="mb-3"
					style={style.title}
				>
					Create Borrow Transaction
				</h3>
				<form onSubmit={handleSubmit}>
					<div
						className="card shadow mb-3"
						style={style.card}
					>
						<div className="card-body">
							<h5
								className="card-title"
								style={style.title}
							>
								Customer
							</h5>
							<div className="row mb-3">
								<div className="col">
									<label
										htmlFor="ID"
										className="form-label"
										style={style.label}
									>
										ID/KTP
									</label>
									<input
										type="text"
										className="form-control"
										id="ID"
										name="ID"
										value={customer.ID}
										onChange={handleChangeCustomer}
										style={style.input}
									/>
								</div>
								<div className="col">
									<label
										htmlFor="name"
										className="form-label"
										style={style.label}
									>
										Name
									</label>
									<input
										type="text"
										className="form-control"
										id="name"
										name="name"
										value={customer.name}
										onChange={handleChangeCustomer}
										style={style.input}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<label
										htmlFor="address"
										className="form-label"
										style={style.label}
									>
										Address
									</label>
									<textarea
										rows="3"
										type="text"
										className="form-control"
										id="address"
										name="address"
										value={customer.address}
										onChange={handleChangeCustomer}
										style={style.input}
									/>
								</div>
								<div className="col">
									<label
										htmlFor="phoneNumber"
										className="form-label"
										style={style.label}
									>
										Phone Number
									</label>
									<input
										type="text"
										className="form-control"
										id="phoneNumber"
										name="phoneNumber"
										value={customer.phoneNumber}
										onChange={handleChangeCustomer}
										style={style.input}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="row mb-5">
						<div className="col">
							<div
								className="card shadow"
								style={style.card}
							>
								<div className="card-body">
									<h5 className="card-title">
										Borrow Information
									</h5>
									<div className="row mb-3">
										<div className="col">
											<label
												htmlFor="departDate"
												className="form-label"
												style={style.label}
											>
												Departure Date
											</label>
											<input
												type="datetime-local"
												className="form-control"
												id="departDate"
												name="departDate"
												value={borrow.departDate}
												onChange={handleChangeBorrow}
												style={style.input}
											/>
										</div>
										<div className="col">
											<label
												htmlFor="returnDate"
												className="form-label"
												style={style.label}
											>
												Return Date
											</label>
											<input
												type="datetime-local"
												className="form-control"
												id="returnDate"
												name="returnDate"
												min={borrow.departDate}
												value={borrow.returnDate}
												onChange={handleChangeBorrow}
												style={style.input}
											/>
										</div>
									</div>
									{isFetching ? (
										<Loader style={style} />
									) : (
										<>
											<div className="mb-5">
												<label
													htmlFor="car"
													className="form-label"
													style={style.label}
												>
													Car
												</label>
												<select
													className="form-select"
													id="car"
													name="car"
													value={
														selectedCar.plateNo ||
														''
													}
													onChange={handleChangeCar}
													style={style.input}
												>
													<option value="">
														Select Car
													</option>
													{cars &&
														cars.map(
															(el, index) => {
																return (
																	<option
																		value={
																			el.plateNo
																		}
																		key={
																			index
																		}
																	>
																		{
																			el.plateNo
																		}{' '}
																		-{' '}
																		{
																			el.brand
																		}{' '}
																		{
																			el.type
																		}{' '}
																		{
																			el.year
																		}{' '}
																		|{' '}
																		{idrFormat(
																			el
																				.rentPrice
																				.perDay
																		)}
																		/Day |{' '}
																		{idrFormat(
																			el
																				.rentPrice
																				.perHour
																		)}
																		/Hour
																	</option>
																);
															}
														)}
												</select>
											</div>
											{selectedCar.base64String && (
												<div className=" text-center">
													<img
														src={`data:image/png;base64,${selectedCar.base64String}`}
														width={300}
														alt="car picture"
													/>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
						<div className="col">
							<div
								className="card shadow"
								style={style.card}
							>
								<div className="card-body">
									<h5
										className="card-title"
										style={style.title}
									>
										Billing Information
									</h5>
									<div className="mb-3">
										<label
											htmlFor="downPayment"
											className="form-label"
											style={style.label}
										>
											Down Payment (Rp)
										</label>
										<input
											type="number"
											className="form-control"
											id="downPayment"
											name="downPayment"
											value={borrow.downPayment.toString()}
											onChange={handleChangeBorrow}
											style={style.input}
										/>
									</div>
									<div>
										<h6
											className="text-center"
											style={{
												textDecoration: 'underline',
											}}
										>
											Transaction
										</h6>
										<div className="mb-3">
											<h6
												style={{
													textDecoration: 'underline',
												}}
											>
												Cars
											</h6>
											{selectedCar.car !== null ? (
												<p>
													{selectedCar.plateNo} -{' '}
													{selectedCar.car.brand}{' '}
													{selectedCar.car.type}{' '}
													{selectedCar.car.year} |{' '}
													{idrFormat(
														selectedCar.car
															.rentPrice.perDay
													)}
													/Day |{' '}
													{idrFormat(
														selectedCar.car
															.rentPrice.perHour
													)}
													/Hour
												</p>
											) : (
												<p>-</p>
											)}
										</div>
										<div className="mb-3">
											<h6
												style={{
													textDecoration: 'underline',
												}}
											>
												Duration
											</h6>
											<p>
												{borrow.daysToBorrow} Days{' '}
												{borrow.hoursToBorrow} Hours
											</p>
										</div>
										<div className="mb-3">
											<h6
												style={{
													textDecoration: 'underline',
												}}
											>
												Total Cost
											</h6>
											{selectedCar.car !== null ? (
												<p>
													{`(${idrFormat(
														selectedCar.car
															.rentPrice.perDay
													)}/day x ${
														borrow.daysToBorrow
													} day) + (${idrFormat(
														selectedCar.car
															.rentPrice.perHour
													)}/hour x ${
														borrow.hoursToBorrow
													} hour ) = ${idrFormat(
														selectedCar.car
															.rentPrice.perDay *
															borrow.daysToBorrow +
															selectedCar.car
																.rentPrice
																.perHour *
																borrow.hoursToBorrow
													)}`}
												</p>
											) : (
												<p>-</p>
											)}
										</div>
										<div>
											<h6
												style={{
													textDecoration: 'underline',
												}}
											>
												Remains
											</h6>
											{selectedCar.car !== null &&
											typeof borrow.downPayment !==
												NaN ? (
												<p>
													{`${idrFormat(
														selectedCar.car
															.rentPrice.perDay *
															borrow.daysToBorrow +
															selectedCar.car
																.rentPrice
																.perHour *
																borrow.hoursToBorrow
													)} - 
													${idrFormat(borrow.downPayment)} = ${idrFormat(
														selectedCar.car
															.rentPrice.perDay *
															borrow.daysToBorrow +
															selectedCar.car
																.rentPrice
																.perHour *
																borrow.hoursToBorrow -
															borrow.downPayment
													)}`}
												</p>
											) : (
												<p>-</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{isLoading ? (
						<Loader style={style} />
					) : (
						<div className="row">
							<div className="col">
								<div className="d-grid gap-2">
									<button
										className="btn btn-dark shadow"
										type="button"
										onClick={() => handleCancel()}
										style={style.button}
									>
										Cancel
									</button>
								</div>
							</div>
							<div className="col">
								<div className="d-grid gap-2">
									<button
										className="btn btn-success shadow"
										type="submit"
										style={style.button}
									>
										Create
									</button>
								</div>
							</div>
						</div>
					)}
				</form>
			</div>
			<MessageToast
				toastState={toastState}
				setToastState={setToastState}
			/>
		</div>
	);
}
