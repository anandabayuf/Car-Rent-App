import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../../api/Users';
import Loader from '../../components/Loader';
import MessageToast from '../../components/Message-Toast';

export default function UpdateUserPage() {
	const [user, setUser] = useState({
		username: '',
		email: '',
		role: 'Operator',
		isEditPassword: false,
		password: '',
		passwordConfirm: '',
	});

	const [isFetching, setIsFetching] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const navigate = useNavigate();
	const params = useParams();

	const getUser = async () => {
		setIsFetching(true);
		const response = await getUserById(params.id);

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

			const { _id, _v, ...rest } = data;

			rest['password'] = '';
			rest['passwordConfirm'] = '';
			rest['isEditPassword'] = false;

			setUser(rest);

			setTimeout(() => {
				setIsFetching(false);
			}, 1000);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	const handleChange = (e) => {
		const key = e.target.name;
		let value = null;

		if (key === 'isEditPassword') {
			value = e.target.checked;
		} else {
			value = e.target.value;
		}

		setUser({
			...user,
			[key]: value,
		});
	};

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();

		const { passwordConfirm, password, isEditPassword, ...data } = user;

		if (isEditPassword) {
			data['password'] = password;
		}

		const response = await updateUser(params.id, data);

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
					setUser({
						username: '',
						email: '',
						role: 'Operator',
						isEditPassword: false,
						password: '',
						passwordConfirm: '',
					});
					navigate('/master/users', {
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
		navigate('/master/users');
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
					Update User
				</h3>
				{isFetching ? (
					<Loader style={style} />
				) : (
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label
								htmlFor="username"
								className="form-label"
								style={style.label}
							>
								Username
							</label>
							<input
								type="text"
								className="form-control"
								id="username"
								name="username"
								value={user.username}
								onChange={handleChange}
								style={style.input}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="email"
								className="form-label"
								style={style.label}
							>
								Email
							</label>
							<input
								type="text"
								className="form-control"
								id="email"
								name="email"
								value={user.email}
								onChange={handleChange}
								style={style.input}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="role"
								className="form-label"
								style={style.label}
							>
								Role
							</label>
							<select
								className="form-select"
								id="role"
								name="role"
								value={user.role}
								onChange={handleChange}
								style={style.input}
							>
								<option value="Admin">Admin</option>
								<option value="Operator">Operator</option>
							</select>
						</div>
						<div className="mb-3 form-check form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								role="switch"
								id="isEditPassword"
								name="isEditPassword"
								value={user.isEditPassword}
								onChange={handleChange}
								style={style.input}
							/>
							<label
								className="form-check-label"
								htmlFor="isEditPicture"
								style={style.label}
							>
								Edit Password
							</label>
						</div>
						{user.isEditPassword && (
							<>
								<div className="mb-3">
									<label
										htmlFor="password"
										className="form-label"
										style={style.label}
									>
										Password
									</label>
									<input
										type="password"
										className="form-control"
										id="password"
										name="password"
										value={user.password}
										onChange={handleChange}
										style={style.input}
										autoComplete="on"
									/>
								</div>
								<div className="mb-5">
									<label
										htmlFor="passwordConfirm"
										className="form-label"
										style={style.label}
									>
										Password Confirmation
									</label>
									<input
										type="password"
										className="form-control"
										id="passwordConfirm"
										name="passwordConfirm"
										value={user.passwordConfirm}
										onChange={handleChange}
										style={style.input}
										autoComplete="on"
									/>
								</div>
							</>
						)}
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
												user.email === '' ||
												user.username === '' ||
												user.role === '' ||
												(user.isEditPassword &&
													(user.password === '' ||
														user.passwordConfirm ===
															'' ||
														user.password !==
															user.passwordConfirm))
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
