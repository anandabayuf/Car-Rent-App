import Offcanvas from "react-bootstrap/Offcanvas";
import Accordion from "react-bootstrap/Accordion";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default function SideBar(props) {
	return (
		<Offcanvas show={props.show} onHide={props.handleClose}>
			<Offcanvas.Header>
				<Offcanvas.Title>Laundry App</Offcanvas.Title>
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
										to="master/items"
									>
										Items Master
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/">
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
									<Link className="nav-link" to="transaction">
										Accept Laundry
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
									<Link className="nav-link" to="/">
										Transaction Report
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/">
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
