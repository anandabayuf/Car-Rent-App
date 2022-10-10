import { useState } from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Outlet,
	Navigate,
} from 'react-router-dom';
import DashboardPage from './pages/Dashboard-Page';
import LoginPage from './pages/Login-Page';
import NavBar from './components/Nav-Bar';
import SignupPage from './pages/Signup-Page';

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

	return isAuthenticated ? <Navigate to="/" /> : <LoginPage />;
};

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Protected />}
				>
					<Route
						index
						element={<DashboardPage />}
					/>
					{/* <Route path="transaction" element={<TransactionPage />} /> */}
					{/* <Route path="master/items" element={<ItemsMaster />} /> */}
				</Route>
				<Route
					path="/login"
					element={<AccessLoginPageHandler />}
				/>
				<Route
					path="/signup"
					element={<SignupPage />}
				/>
				<Route
					path="*"
					element={<Navigate to="/" />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
