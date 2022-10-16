import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkToken } from '../api/Authentication';

export default function SideBar(props) {
	return (
		<Offcanvas
			show={props.show}
			onHide={props.handleClose}
		>
			<Offcanvas.Header>
				<Offcanvas.Title>Car Rent App</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Accordion flush>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Master</Accordion.Header>
						<Accordion.Body>
							<Nav className="flex-column">
								<li className="nav-item">
									<Link
										className="nav-link"
										to="master/cars"
										onClick={props.handleClose}
									>
										Cars Master
									</Link>
								</li>
								<li className="nav-item">
									<Link
										className="nav-link"
										to="master/users"
										onClick={props.handleClose}
									>
										Users Master
									</Link>
								</li>
							</Nav>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Transaction</Accordion.Header>
						<Accordion.Body>
							<Nav className="flex-column">
								<li className="nav-item">
									<Link
										className="nav-link"
										to="transaction/borrows"
										onClick={props.handleClose}
									>
										Borrows List
									</Link>
								</li>
							</Nav>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>Report</Accordion.Header>
						<Accordion.Body>
							<Nav className="flex-column">
								<li className="nav-item">
									<Link
										className="nav-link"
										to="/"
										onClick={props.handleClose}
									>
										Transaction Report
									</Link>
								</li>
								<li className="nav-item">
									<Link
										className="nav-link"
										to="/"
										onClick={props.handleClose}
									>
										Customer Report
									</Link>
								</li>
							</Nav>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
