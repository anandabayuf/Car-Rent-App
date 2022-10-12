import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteCar, getAllCars } from '../../api/Cars';
import Loader from '../../components/Loader';
import MessageToast from '../../components/Message-Toast';
import NoData from '../../components/No-Data';
import { Trash, Eye, Pencil } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import DetailCarModal from '../../components/car/Detail-Car-Modal';
import DeleteCarModal from '../../components/car/Delete-Car-Modal';

export default function CarsListPage() {
	const [cars, setCars] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const [detailCarModalState, setDetailCarModalState] = useState(false);
	const [deleteCarModalState, setDeleteCarModalState] = useState(false);

	const [car, setCar] = useState({});

	const getCars = async () => {
		setIsFetching(true);
		const response = await getAllCars();

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

			setCars(data);

			setTimeout(() => {
				setIsFetching(false);
			}, 1000);
		}
	};

	useEffect(() => {
		getCars();
	}, []);

	const handleClickCreate = () => {
		navigate('/master/cars/create');
	};

	const handleAfterCreateCar = () => {
		if (location.state) {
			setToastState(location.state.toastState);
			window.history.replaceState({}, document.title);
			setTimeout(() => {
				setToastState({
					...toastState,
					show: false,
					title: '',
					message: '',
				});
			}, 5000);
		}
	};

	useEffect(() => {
		handleAfterCreateCar();
	}, []);

	const handleDelete = async (id) => {
		setIsLoading(true);
		const response = await deleteCar(id);

		setTimeout(() => {
			if (response.status.includes('401')) {
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
			} else {
				if (response.status.includes('204')) {
					setToastState({
						show: true,
						title: 'Success',
						message: response.message,
					});
				} else {
					setToastState({
						show: true,
						title: 'Error',
						message: response.message,
					});
				}
				setTimeout(() => {
					setIsLoading(false);
					getCars();
					setToastState({
						show: false,
						title: '',
						message: '',
					});
				}, 3000);
			}
		}, 1000);
	};

	const handleClickEdit = (id) => {
		navigate(`/master/cars/update/${id}`);
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
		buttonCreate: {
			borderRadius: '15px',
			backgroundColor: '#3F72AF',
			color: '#F9F7F7',
		},
		button: {
			borderRadius: '50px',
		},
		loader: {
			color: '#3F72AF',
		},
	};

	return (
		<div
			className="min-vh-100"
			style={style.page}
		>
			<div className="row justify-content-between mb-3">
				<div className="col-auto">
					<h3 style={style.title}>Cars List</h3>
				</div>
				<div className="col-auto">
					<button
						className="btn btn-outline-primary shadow"
						style={style.buttonCreate}
						onClick={() => handleClickCreate()}
					>
						Create Car
					</button>
				</div>
			</div>
			<div>
				{isFetching ? (
					<Loader style={style} />
				) : cars.length > 0 ? (
					<table className="table">
						<thead>
							<tr className="text-center">
								<th scope="col">#</th>
								<th scope="col">Plate Number</th>
								<th scope="col">Brand</th>
								<th scope="col">Type</th>
								<th scope="col">Status</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{cars &&
								cars.map((el, index) => {
									return (
										<tr
											className="text-center"
											key={index}
										>
											<td scope="row">{index + 1}</td>
											<td>{el.plateNo}</td>
											<td>{el.brand}</td>
											<td>{el.type}</td>
											<td>
												<Badge
													bg={
														el.status ===
														'Available'
															? 'success'
															: 'secondary'
													}
												>
													{el.status}
												</Badge>
											</td>
											<td>
												{isLoading &&
												car._id === el._id ? (
													<Loader style={style} />
												) : el.status ===
												  'Available' ? (
													<div className="row justify-content-center">
														<div className="col-auto">
															<button
																className="btn btn-outline-info"
																style={
																	style.button
																}
																onClick={() => {
																	setCar(el);
																	setDetailCarModalState(
																		true
																	);
																}}
															>
																<Eye
																	size={16}
																/>
															</button>
														</div>
														<div className="col-auto">
															<button
																className="btn btn-outline-dark"
																style={
																	style.button
																}
																onClick={() =>
																	handleClickEdit(
																		el._id
																	)
																}
															>
																<Pencil
																	size={16}
																/>
															</button>
														</div>
														<div className="col-auto">
															<button
																className="btn btn-outline-danger"
																style={
																	style.button
																}
																onClick={() => {
																	setCar(el);
																	setDeleteCarModalState(
																		true
																	);
																}}
															>
																<Trash
																	size={16}
																/>
															</button>
														</div>
													</div>
												) : (
													<div>
														<button className="btn btn-outline-info">
															<Eye size={16} />
														</button>
													</div>
												)}
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				) : (
					<div className="mt-5">
						<NoData />
					</div>
				)}
			</div>
			<MessageToast
				toastState={toastState}
				setToastState={setToastState}
			/>
			{detailCarModalState && (
				<DetailCarModal
					detailCarModalState={detailCarModalState}
					setDetailCarModalState={setDetailCarModalState}
					car={car}
				/>
			)}
			{deleteCarModalState && (
				<DeleteCarModal
					deleteCarModalState={deleteCarModalState}
					setDeleteCarModalState={setDeleteCarModalState}
					car={car}
					handleDelete={handleDelete}
				/>
			)}
		</div>
	);
}
