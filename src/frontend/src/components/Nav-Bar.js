import { Link, useNavigate } from 'react-router-dom';
import {
	List,
	Person,
	BoxArrowRight,
	Gear,
	InfoCircle,
} from 'react-bootstrap-icons';
import SideBar from './Side-Bar';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default function NavBar() {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem('TOKEN');
		navigate('/login');
	};

	const style = {
		container: {
			borderBottomRightRadius: '10px',
			borderBottomLeftRadius: '10px',
			backgroundColor: '#F9F7F7',
			padding: '10px',
		},
		title: {
			color: '#112D4E',
		},
		menuButton: {
			border: 'none',
		},
		dropdown: {
			borderColor: '#112D4E',
			borderRadius: '50px',
			backgroundColor: '#F9F7F7',
			color: '#112D4E',
		},
		dropdownContainer: {
			borderColor: '#112D4E',
			backgroundColor: '#F9F7F7',
		},
		signOutItemDropdown: {
			color: 'red',
		},
		icon: {
			color: '#112D4E',
		},
	};

	return (
		<>
			<nav
				className="navbar navbar-expand-lg fixed-top shadow"
				style={style.container}
			>
				<button
					type="button"
					className="btn"
					style={style.menuButton}
					onClick={handleShow}
				>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<List
							alignmentBaseline="middle"
							size={24}
						/>
					</div>
				</button>
				<div className="container-fluid">
					<Link
						className="navbar-brand"
						to="/"
						style={style.title}
					>
						Car Rent App
					</Link>
					<Dropdown>
						<Dropdown.Toggle style={style.dropdown}>
							<Person
								size={24}
								style={style.icon}
							/>
						</Dropdown.Toggle>

						<Dropdown.Menu style={style.dropdownContainer}>
							<Link
								className="dropdown-item"
								to="profile"
								style={style.icon}
							>
								<Person size={16} /> My Profile
							</Link>
							<Link
								className="dropdown-item"
								style={style.icon}
							>
								<Gear size={16} /> Settings
							</Link>
							<Link
								className="dropdown-item"
								style={style.icon}
							>
								<InfoCircle size={16} /> About
							</Link>
							<Dropdown.Divider />
							<button
								className="dropdown-item"
								style={style.signOutItemDropdown}
								onClick={() => handleSignOut()}
							>
								<BoxArrowRight size={16} /> Sign Out
							</button>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</nav>

			<SideBar
				show={show}
				handleClose={handleClose}
			/>
		</>
	);
}
