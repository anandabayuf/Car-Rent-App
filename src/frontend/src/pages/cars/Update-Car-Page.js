import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCarById, updateCar } from '../../api/Cars';
import Loader from '../../components/Loader';
import MessageToast from '../../components/Message-Toast';

export default function UpdateCarPage() {
	const [car, setCar] = useState({
		plateNo: '',
		brand: '',
		type: '',
		year: '',
		perDay: '',
		perHour: '',
		pictureFromDB: undefined,
		base64String: '',
		isEditPicture: false,
		picture: undefined,
	});
	const [picPreview, setPicPreview] = useState('');

	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const navigate = useNavigate();
	const params = useParams();

	const getCarData = async () => {
		setIsFetching(true);
		const response = await getCarById(params.id);

		if (response.status.includes('401')) {
			setTimeout(() => {
				setIsFetching(false);
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
			}, 1000);
		} else {
			const data = await response.data;

			const { rentPrice, ...rest } = data;

			rest['perDay'] = rentPrice.perDay;
			rest['perHour'] = rentPrice.perHour;

			rest['pictureFromDB'] = data.picture;

			rest['base64String'] = btoa(
				new Uint8Array(data.picture.data.data).reduce(function (
					data,
					byte
				) {
					return data + String.fromCharCode(byte);
				},
				'')
			);

			rest['picture'] = undefined;

			setCar(rest);

			setTimeout(() => {
				setIsFetching(false);
			}, 1000);
		}
	};

	useEffect(() => {
		getCarData(); // eslint-disable-next-line
	}, [params]);

	const handleChange = (e) => {
		const key = e.target.name;
		let value = '';

		if (key === 'picture') {
			value = e.target.files[0];

			setCar({
				...car,
				[key]: value,
			});
		} else if (key === 'isEditPicture') {
			value = e.target.checked;

			if (!value) {
				setCar({
					...car,
					[key]: value,
					picture: undefined,
				});
				setPicPreview(undefined);
			} else {
				setCar({
					...car,
					[key]: value,
				});
			}
		} else {
			value = e.target.value;

			setCar({
				...car,
				[key]: value,
			});
		}
	};

	useEffect(() => {
		if (!car.picture) {
			setPicPreview(undefined);
			return;
		}

		const objectUrl = URL.createObjectURL(car.picture);
		setPicPreview(objectUrl);

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl);
	}, [car.picture]);

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();

		const {
			perDay,
			perHour,
			isEditPicture,
			pictureFromDB,
			base64String,
			picture,
			status,
			user,
			_id,
			__v,
			...data
		} = car;

		data['rentPrice'] = {
			perDay,
			perHour,
		};

		if (isEditPicture) {
			data['picture'] = picture;
		}

		const response = await updateCar(params.id, data);

		if (response.status.includes('401')) {
			setTimeout(() => {
				setIsLoading(false);
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
			}, 1000);
		} else {
			setTimeout(() => {
				setIsLoading(false);
				if (response.status.includes('201')) {
					setCar({
						plateNo: '',
						brand: '',
						type: '',
						year: '',
						perDay: '',
						perHour: '',
						picture: undefined,
					});
					setPicPreview(undefined);
					navigate('/master/cars', {
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
		}
	};

	const handleCancel = () => {
		navigate('/master/cars');
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
		},
		button: {
			borderRadius: '20px',
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
					Update Car
				</h3>
				{isFetching ? (
					<Loader style={style} />
				) : (
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label
								htmlFor="plateNo"
								className="form-label"
								style={style.label}
							>
								Plate Number
							</label>
							<input
								type="text"
								className="form-control"
								id="plateNo"
								name="plateNo"
								value={car.plateNo}
								onChange={handleChange}
								style={style.input}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="brand"
								className="form-label"
								style={style.label}
							>
								Brand
							</label>
							<input
								type="text"
								className="form-control"
								id="brand"
								name="brand"
								value={car.brand}
								onChange={handleChange}
								style={style.input}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="type"
								className="form-label"
								style={style.label}
							>
								Type
							</label>
							<input
								type="text"
								className="form-control"
								id="type"
								name="type"
								value={car.type}
								onChange={handleChange}
								style={style.input}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="year"
								className="form-label"
								style={style.label}
							>
								Year
							</label>
							<input
								type="number"
								className="form-control"
								id="year"
								name="year"
								value={car.year}
								onChange={handleChange}
								style={style.input}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="rentprice"
								className="form-label"
								style={style.label}
							>
								Rent Price (Rp)
							</label>
							<div className="row">
								<div className="col">
									<div className="row align-items-center">
										<div className="col-3">
											<label
												htmlFor="perDay"
												className="form-label"
												style={style.label}
											>
												Per Day (Rp)
											</label>
										</div>
										<div className="col-9">
											<input
												type="number"
												className="form-control"
												id="perDay"
												name="perDay"
												value={car.perDay}
												onChange={handleChange}
												style={style.input}
											/>
										</div>
									</div>
								</div>
								<div className="col">
									<div className="row align-items-center">
										<div className="col-3">
											<label
												htmlFor="perHour"
												className="form-label"
												style={style.label}
											>
												Per Hour (Rp)
											</label>
										</div>
										<div className="col-9">
											<input
												type="number"
												className="form-control"
												id="perHour"
												name="perHour"
												value={car.perHour}
												onChange={handleChange}
												style={style.input}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mb-5">
							<label
								htmlFor="picture"
								className="form-label"
								style={style.label}
							>
								Picture
							</label>
							<div className="row">
								<div className="col">
									<div className="mb-3 form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											role="switch"
											id="isEditPicture"
											name="isEditPicture"
											value={car.isEditPicture}
											onChange={handleChange}
											style={style.input}
										/>
										<label
											className="form-check-label"
											htmlFor="isEditPicture"
											style={style.label}
										>
											Edit Car Picture
										</label>
									</div>
									<input
										type="file"
										className="form-control"
										id="picture"
										name="picture"
										onChange={handleChange}
										style={style.input}
										accept="image/*"
										placeholder="Select new car picture"
										disabled={!car.isEditPicture}
									/>
								</div>
								<div className="col">
									<div
										className="card text-center"
										style={style.card}
									>
										<div className="card-body">
											<h6
												className="card-title mb-3"
												style={style.label}
											>
												Picture Preview
											</h6>
											{!car.isEditPicture ? (
												<img
													src={`data:image/png;base64,${car.base64String}`}
													width={300}
													alt="car"
												/>
											) : (
												picPreview && (
													<img
														src={picPreview}
														width={300}
														alt="car"
													/>
												)
											)}
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
											disabled={
												car.plateNo === '' ||
												car.brand === '' ||
												car.type === '' ||
												car.year === '' ||
												car.perDay === '' ||
												car.perHour === '' ||
												(car.isEditPicture &&
													car.picture === undefined)
											}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						)}
					</form>
				)}
			</div>
			<MessageToast
				toastState={toastState}
				setToastState={setToastState}
			/>
		</div>
	);
}
