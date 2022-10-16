import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteUser, getAllUsers } from '../../api/Users';
import Loader from '../../components/Loader';
import MessageToast from '../../components/Message-Toast';
import NoData from '../../components/No-Data';
import { Trash, Pencil } from 'react-bootstrap-icons';
import DeleteUserModal from '../../components/user/Delete-User-Modal';

export default function UserListPage() {
	const [users, setUsers] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const [deleteUserModalState, setDeleteUserModalState] = useState(false);

	const [user, setUser] = useState({});

	const getUsers = async () => {
		setIsFetching(true);
		const response = await getAllUsers();

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
			} else if (response.status.includes('200')) {
				const data = await response.data;
				setUsers(data);
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

	useEffect(() => {
		getUsers();
	}, []);

	const handleClickCreate = () => {
		navigate('/master/users/create');
	};

	const handleAfterCreateUser = () => {
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
		handleAfterCreateUser();
	}, []);

	const handleDelete = async (id) => {
		setIsLoading(true);
		const response = await deleteUser(id);

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
						message: response.err.message,
					});
				}

				setTimeout(() => {
					setIsLoading(false);
					getUsers();
					setToastState({
						show: false,
						title: '',
						message: '',
					});
				}, 3000);
			}
		}, 1000);
	};

	const handleClickUpdateUser = (id) => {
		navigate(`/master/users/update/${id}`);
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
					<h3 style={style.title}>Users List</h3>
				</div>
				<div className="col-auto">
					<button
						className="btn shadow"
						style={style.buttonCreate}
						onClick={() => handleClickCreate()}
					>
						Create User
					</button>
				</div>
			</div>
			<div>
				{isFetching ? (
					<Loader style={style} />
				) : users.length > 0 ? (
					<table className="table">
						<thead>
							<tr className="text-center">
								<th scope="col">#</th>
								<th scope="col">Username</th>
								<th scope="col">Email</th>
								<th scope="col">Role</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{users &&
								users.map((el, index) => {
									return (
										<tr
											className="text-center"
											key={index}
										>
											<td scope="row">{index + 1}</td>
											<td>{el.username}</td>
											<td>{el.email}</td>
											<td>{el.role}</td>
											<td>
												{isLoading &&
												user._id === el._id ? (
													<Loader style={style} />
												) : (
													<div className="row justify-content-center">
														<div className="col-auto">
															<button
																className="btn btn-outline-dark"
																style={
																	style.button
																}
																onClick={() =>
																	handleClickUpdateUser(
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
																	setUser(el);
																	setDeleteUserModalState(
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
			{deleteUserModalState && (
				<DeleteUserModal
					deleteUserModalState={deleteUserModalState}
					setDeleteUserModalState={setDeleteUserModalState}
					user={user}
					handleDelete={handleDelete}
				/>
			)}
		</div>
	);
}
