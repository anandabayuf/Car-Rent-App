import { useState } from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Outlet,
	Navigate,
} from 'react-router-dom';
import DashboardPage from './pages/Dashboard-Page';
import LoginPage from './pages/authentication/Login-Page';
import NavBar from './components/Nav-Bar';
import SignupPage from './pages/authentication/Signup-Page';
import CarsListPage from './pages/cars/Cars-List-Page';
import CreateCarPage from './pages/cars/Create-Car-Page';
import UpdateCarPage from './pages/cars/Update-Car-Page';
import UserListPage from './pages/users/User-List-Page';
import CreateUserPage from './pages/users/Create-User-Page';
import UpdateUserPage from './pages/users/Update-User-Page';
import BorrowsListPage from './pages/borrow/Borrow-List';
import CreateBorrowPage from './pages/borrow/Create-Borrow-Page';

const Protected = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem('TOKEN')
	);

	return isAuthenticated ? (
		<>
			<NavBar />
			<Outlet />
		</>
	) : (
		<Navigate to="/login" />
	);
};

const AccessLoginPageHandler = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem('TOKEN')
	);

	return isAuthenticated ? (
		<Navigate to="/transaction/borrows" />
	) : (
		<LoginPage />
	);
};

const AccessSignupPageHandler = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem('TOKEN')
	);

	return isAuthenticated ? (
		<Navigate to="/transaction/borrows" />
	) : (
		<SignupPage />
	);
};

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Protected />}
				>
					<Route path="transaction">
						<Route path="borrows">
							<Route
								index
								element={<BorrowsListPage />}
							/>
							<Route
								path="create"
								element={<CreateBorrowPage />}
							/>
						</Route>
					</Route>
					<Route path="master">
						<Route path="cars">
							<Route
								index
								element={<CarsListPage />}
							/>
							<Route
								path="create"
								element={<CreateCarPage />}
							/>
							<Route
								path="update/:id"
								element={<UpdateCarPage />}
							/>
						</Route>
						<Route path="users">
							<Route
								index
								element={<UserListPage />}
							/>
							<Route
								path="create"
								element={<CreateUserPage />}
							/>
							<Route
								path="update/:id"
								element={<UpdateUserPage />}
							/>
						</Route>
					</Route>
				</Route>
				<Route
					path="/login"
					element={<AccessLoginPageHandler />}
				/>
				<Route
					path="/signup"
					element={<AccessSignupPageHandler />}
				/>
				<Route
					path="*"
					element={<Navigate to="/transaction/borrows" />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
