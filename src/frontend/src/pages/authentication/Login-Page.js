import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logIn } from '../../api/Authentication';
import loginillustration from '../../assets/login-illustration.jpg';
import { useNavigate } from 'react-router-dom';
import MessageToast from '../../components/Message-Toast';

export default function LoginPage() {
	const [credential, setCredential] = useState({
		username: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const [toastState, setToastState] = useState({
		show: false,
		title: '',
		message: '',
	});

	const navigate = useNavigate();
	const location = useLocation();

	const handleChange = (e) => {
		const key = e.target.name;
		const value = e.target.value;

		setCredential({
			...credential,
			[key]: value,
		});
	};

	const handleLogIn = async (e) => {
		setIsLoading(true);
		e.preventDefault();

		const response = await logIn(credential);

		setTimeout(() => {
			setIsLoading(false);
			if (response.token) {
				localStorage.setItem('TOKEN', `JWT ${response.token}`);
				navigate('/transaction/borrows');
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

	const handleAfterSignUp = () => {
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
		handleAfterSignUp();
	}, []);
	const style = {
		page: {
			padding: '30px',
			backgroundColor: '#F9F7F7',
		},
		container: {
			width: 'auto',
			padding: '30px',
			borderRadius: '30px',
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
		button: {
			borderRadius: '15px',
			backgroundColor: '#3F72AF',
			color: '#F9F7F7',
		},
		signUpText: {
			color: '#3F72AF',
		},
		link: {
			textDecoration: 'underline',
			color: '#112D4E',
		},
		loader: {
			color: '#3F72AF',
		},
	};

	return (
		<div
			className="d-flex flex-column min-vh-100 justify-content-center align-items-center"
			style={style.page}
		>
			<div
				className="row align-items-center"
				style={style.container}
			>
				<div className="col-md-6 col-sm-12">
					<img
						src={loginillustration}
						className="figure-img img-fluid rounded"
						alt="login-illustration"
					/>
				</div>
				<div className="col-md-5 col-sm-12">
					<h3
						className="mb-md-5 mb-sm-3"
						style={style.title}
					>
						Login Car Rent App
					</h3>
					<form onSubmit={handleLogIn}>
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
								style={style.input}
								value={credential.username || ''}
								onChange={handleChange}
								placeholder="input your username"
							/>
						</div>
						<div className="mb-4">
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
								autoComplete="on"
								style={style.input}
								value={credential.password || ''}
								onChange={handleChange}
								placeholder="input your password"
							/>
						</div>
						{isLoading ? (
							<div className="text-center">
								<div
									className="spinner-border"
									role="status"
									style={style.loader}
								>
									<span className="visually-hidden">
										Loading...
									</span>
								</div>
							</div>
						) : (
							<div className="d-grid gap-2">
								<button
									type="submit"
									className="btn shadow"
									style={style.button}
									disabled={
										credential.username === '' ||
										credential.password === ''
									}
								>
									Login
								</button>
							</div>
						)}
					</form>
					<div
						className="mt-md-5 mt-sm-3 text-center"
						style={style.signUpText}
					>
						Don't have an account?{' '}
						<Link
							to="/signup"
							style={style.link}
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
			<MessageToast
				toastState={toastState}
				setToastState={setToastState}
			/>
		</div>
	);
}
