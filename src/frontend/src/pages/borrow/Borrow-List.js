import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllBorrows, updateBorrowStatus } from '../../api/Borrows';
import Loader from '../../components/Loader';
import MessageToast from '../../components/Message-Toast';
import NoData from '../../components/No-Data';
import { Trash, Eye, Pencil } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import DeleteCarModal from '../../components/car/Delete-Car-Modal';
import { idrFormat } from '../../utils/Formatter';
import DetailBorrowModal from '../../components/borrow/Detail-Borrow-Modal';
import UpdateBorrowStatusModal from '../../components/borrow/Update-Borrow-Status-Modal';

export default function BorrowsListPage() {
	const [borrows, setBorrows] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const [detailBorrowModalState, setDetailBorrowModalState] = useState(false);
	const [updateBorrowStatusModalState, setUpdateBorrowStatusModalState] =
		useState(false);

	const [borrow, setBorrow] = useState({});

	const getBorrows = async () => {
		setIsFetching(true);
		const response = await getAllBorrows();

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
			} else if (response.status.includes('404')) {
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
			} else {
				let data = await response.data;

				data = data.map((el) => {
					const { bookDate, departDate, returnDate, ...rest } = el;

					return {
						...rest,
						bookDate: new Date(bookDate).toLocaleString(),
						departDate: new Date(departDate).toLocaleString(),
						returnDate: new Date(returnDate).toLocaleString(),
					};
				});

				// console.log(data);

				setBorrows(data);
			}
		});
	};

	useEffect(() => {
		getBorrows();
	}, []);

	const handleClickCreate = () => {
		navigate('/transaction/borrows/create');
	};

	const handleAfterCreateBorrow = () => {
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
		handleAfterCreateBorrow();
	}, []);

	const handleClickDetail = (borrow) => {
		setBorrow(borrow);
		setDetailBorrowModalState(true);
	};

	const handleClickUpdate = (borrow) => {
		setBorrow(borrow);
		setUpdateBorrowStatusModalState(true);
	};

	const handleUpdateStatus = async (borrow) => {
		setBorrow(borrow);
		setIsLoading(true);

		const response = await updateBorrowStatus(borrow._id);

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
			} else {
				if (response.status.includes('201')) {
					getBorrows();
					setToastState({
						...toastState,
						show: true,
						title: 'Success',
						message: response.message,
					});
				} else {
					setToastState({
						...toastState,
						show: true,
						title: 'Error',
						message: response.message,
					});
				}

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
			borderRadius: '15px',
		},
		iconButton: {
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
					<h3 style={style.title}>Borrows List</h3>
				</div>
				<div className="col-auto">
					<button
						className="btn btn-outline-primary shadow"
						style={style.buttonCreate}
						onClick={() => handleClickCreate()}
					>
						New Borrow
					</button>
				</div>
			</div>
			<div>
				{isFetching ? (
					<Loader style={style} />
				) : borrows.length > 0 ? (
					<table className="table">
						<thead>
							<tr className="text-center">
								<th scope="col">Book Date</th>
								<th scope="col">Depart Date</th>
								<th scope="col">Return Date</th>
								<th scope="col">Car Plate Number</th>
								<th scope="col">Customer Name</th>
								<th scope="col">Total Cost</th>
								<th scope="col">Status</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{borrows &&
								borrows.map((el, index) => {
									return (
										<tr
											className="text-center"
											key={index}
										>
											<td scope="row">{el.bookDate}</td>
											<td>{el.departDate}</td>
											<td>{el.returnDate}</td>
											<td>{el.car.plateNo}</td>
											<td>{el.customer.name}</td>
											<td>{idrFormat(el.totalCost)}</td>
											<td>
												<Badge
													bg={
														el.status === 'Booked'
															? 'secondary'
															: el.status ===
															  'On Doing'
															? 'primary'
															: el.status ===
															  'Done'
															? 'success'
															: 'info'
													}
												>
													{el.status}
												</Badge>
											</td>
											<td>
												{isLoading &&
												borrow._id === el._id ? (
													<Loader style={style} />
												) : el.status === 'Done' ? (
													<div className="text-center">
														<button
															className="btn btn-outline-warning"
															style={style.button}
															onClick={() =>
																handleClickUpdate(
																	el
																)
															}
														>
															Return
														</button>
													</div>
												) : (
													<div className="row justify-content-center">
														<div className="col-auto">
															<button
																className="btn btn-outline-info"
																style={
																	style.iconButton
																}
																onClick={() =>
																	handleClickDetail(
																		el
																	)
																}
															>
																<Eye
																	size={16}
																/>
															</button>
														</div>
														<div className="col-auto">
															<button
																className="btn btn-outline-warning"
																style={
																	style.button
																}
																onClick={() =>
																	handleClickUpdate(
																		el
																	)
																}
															>
																Update Status
															</button>
														</div>
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
			{detailBorrowModalState && (
				<DetailBorrowModal
					detailBorrowModalState={detailBorrowModalState}
					setDetailBorrowModalState={setDetailBorrowModalState}
					borrow={borrow}
				/>
			)}
			{updateBorrowStatusModalState && (
				<UpdateBorrowStatusModal
					updateBorrowStatusModalState={updateBorrowStatusModalState}
					setUpdateBorrowStatusModalState={
						setUpdateBorrowStatusModalState
					}
					borrow={borrow}
					handleUpdateStatus={handleUpdateStatus}
				/>
			)}
		</div>
	);
}
