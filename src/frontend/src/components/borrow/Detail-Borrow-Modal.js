import { useEffect, useState } from 'react';
import { Badge, Modal } from 'react-bootstrap';
import { idrFormat } from '../../utils/Formatter';

export default function DetailBorrowModal(props) {
	const [base64String, setBase64String] = useState('');

	useEffect(() => {
		setBase64String(
			btoa(
				new Uint8Array(props.borrow.car.picture.data.data).reduce(
					function (data, byte) {
						return data + String.fromCharCode(byte);
					},
					''
				)
			)
		);
	}, [props.borrow.car]);

	return (
		<Modal
			show={props.detailBorrowModalState}
			onHide={() => props.setDetailBorrowModalState(false)}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Detail Borrow
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: '20px 50px 50px 50px' }}>
				<div className="row justify-content-between mb-3">
					<div className="col-auto">
						<h5>Borrow Information</h5>
					</div>
					<div className="col-auto">
						<Badge
							bg={
								props.borrow.status === 'Booked'
									? 'secondary'
									: props.borrow.status === 'On Doing'
									? 'primary'
									: props.borrow.status === 'Done'
									? 'success'
									: 'Information'
							}
						>
							{props.borrow.status}
						</Badge>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col">
						<div className="mb-3">
							<h6>Book Date</h6>
							<p>{props.borrow.bookDate}</p>
						</div>
						<div className="mb-3">
							<h6>Duration</h6>
							<p>
								{props.borrow.daysToBorrow !== 0 &&
								props.borrow.hoursToBorrow !== 0
									? `${props.borrow.daysToBorrow} Days ${props.borrow.hoursToBorrow} Hours`
									: props.borrow.daysToBorrow === 0
									? `${props.borrow.hoursToBorrow} Hours`
									: `${props.borrow.daysToBorrow} Days`}
							</p>
						</div>
					</div>
					<div className="col">
						<div className="mb-3">
							<h6>Departure Date</h6>
							<p>{props.borrow.departDate}</p>
						</div>
						<div className="mb-3">
							<h6>Return Date</h6>
							<p>{props.borrow.returnDate}</p>
						</div>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col">
						<h5 className="text-center mb-3">
							Customer Information
						</h5>
						<div className="mb-3">
							<h6>Name</h6>
							<p>{props.borrow.customer.name}</p>
						</div>
						<div className="mb-3">
							<h6>ID/KTP</h6>
							<p>{props.borrow.customer['ID']}</p>
						</div>
						<div className="mb-3">
							<h6>Address</h6>
							<p>{props.borrow.customer.address}</p>
						</div>
						<div className="mb-3">
							<h6>Phone Number</h6>
							<p>{props.borrow.customer.phoneNumber}</p>
						</div>
					</div>
					<div className="col">
						<h5 className="text-center mb-3">
							Billing Information
						</h5>
						<div className="mb-3">
							<h6>Total Cost</h6>
							<p>{idrFormat(props.borrow.totalCost)}</p>
						</div>
						<div className="mb-3">
							<h6>Down Payment</h6>
							<p>{idrFormat(props.borrow.downPayment)}</p>
						</div>
						<div className="mb-3">
							<h6>Remains</h6>
							<p>{idrFormat(props.borrow.remains)}</p>
						</div>
					</div>
				</div>
				<hr />
				<div className="mb-3">
					<h5 className="text-center">Car Information</h5>
					<div className="mb-3 text-center">
						<img
							src={`data:image/png;base64,${base64String}`}
							width={300}
							alt="car picture"
						/>
					</div>
					<div className="row">
						<div className="col">
							<div className="mb-3">
								<h6>Brand</h6>
								<p>{props.borrow.car.brand}</p>
							</div>
							<div className="mb-3">
								<h6>Type</h6>
								<p>{props.borrow.car.type}</p>
							</div>
							<div className="mb-3">
								<h6>Year</h6>
								<p>{props.borrow.car.year}</p>
							</div>
						</div>
						<div className="col">
							<div className="mb-3">
								<h6>Plate Number</h6>
								<p>{props.borrow.car.plateNo}</p>
							</div>
							<div className="mb-3">
								<h6>Rent Price Per Day</h6>
								<p>
									{idrFormat(
										props.borrow.car.rentPrice.perDay
									)}
								</p>
							</div>
							<div className="mb-3">
								<h6>Rent Price Per Hour</h6>
								<p>
									{idrFormat(
										props.borrow.car.rentPrice.perHour
									)}
								</p>
							</div>
						</div>
					</div>
				</div>
				<hr />
				<div>
					<h5 className="mb-3">User In Charge</h5>
					<div className="row">
						<div className="col">
							<div>
								<h6>Username</h6>
								<p>{props.borrow.user.username}</p>
							</div>
						</div>
						<div className="col">
							<div>
								<h6>Email</h6>
								<p>{props.borrow.user.email}</p>
							</div>
						</div>
					</div>
				</div>
				{/* <div className="mb-3 row">
					<div className="col">
						<h6
							className="text-center"
							style={{ textDecoration: 'underline' }}
						>
							Customer Information
						</h6>
						<div className="row">
							<div className="col-3">
								<p>Name: </p>
							</div>
							<div className="col-9">
								<p>{props.borrow.customer.name}</p>
							</div>
						</div>
						<div className="row">
							<div className="col-3">
								<p>ID/KTP: </p>
							</div>
							<div className="col-9">
								<p>{props.borrow.customer['ID']}</p>
							</div>
						</div>
						<div className="row">
							<div className="col-3">
								<p>Address: </p>
							</div>
							<div className="col-9">
								<p>{props.borrow.customer.address}</p>
							</div>
						</div>
						<div className="row">
							<div className="col-3">
								<p>Phone: </p>
							</div>
							<div className="col-9">
								<p>{props.borrow.customer.phoneNumber}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mb-3 row">
					<div className="col">
						<h6>Total Cost: </h6>
						<p>{idrFormat(props.borrow.totalCost)}</p>
					</div>
					<div className="col">
						<h6>Down Payment: </h6>
						<p>{idrFormat(props.borrow.downPayment)}</p>
					</div>
					<div className="col">
						<h6>Remains: </h6>
						<p>{idrFormat(props.borrow.remains)}</p>
					</div>
				</div>
				<div className="mb-3">
					<h6>Handled By: </h6>
					<div className="row">
						<div className="col">
							<p>Username: {props.borrow.user.username}</p>
						</div>
						<div className="col">
							<p>Email: {props.borrow.user.email}</p>
						</div>
					</div>
				</div> */}
				{/* <div className="mb-3 text-center">
					<img
						src={`data:image/png;base64,${base64String}`}
						width={300}
						alt="car picture"
					/>
				</div>
				<div className="mb-3">
					<div className="row">
						<div className="col-3">
							<h5>Plate Number</h5>
							<p>
								<strong>{props.car.plateNo}</strong>
							</p>
						</div>
						<div className="col-3">
							<h5>Brand</h5>
							<p>{props.car.brand}</p>
						</div>
						<div className="col-4">
							<h5>Type</h5>
							<p>{props.car.type}</p>
						</div>
						<div className="col-2">
							<h5>Year</h5>
							<p>{props.car.year}</p>
						</div>
					</div>
				</div>
				<div className="mb-3">
					<h5>Rent Price</h5>
					<div className="row">
						<div className="col">
							<div className="row">
								<div className="col">
									<p>Per Day: </p>
								</div>
								<div className="col">
									<p>
										{idrFormat(props.car.rentPrice.perDay)}
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="row">
								<div className="col">
									<p>Per Hour: </p>
								</div>
								<div className="col">
									<p>
										{idrFormat(props.car.rentPrice.perHour)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mb-3">
					<h5>Status</h5>
					<Badge
						bg={
							props.car.status === 'Available'
								? 'success'
								: 'secondary'
						}
					>
						{props.car.status}
					</Badge>
				</div> 
				<div className="mb-3">
					<h5>Added By</h5>
					<div className="row">
						<div className="col">
							<div className="row">
								<div className="col-auto">
									<p>Username: </p>
								</div>
								<div className="col-auto">
									<p>{props.car.user.username}</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="row">
								<div className="col-auto">
									<p>Email: </p>
								</div>
								<div className="col-auto">
									<p>{props.car.user.email}</p>
								</div>
							</div>
						</div>
					</div>
				</div>*/}
			</Modal.Body>
		</Modal>
	);
}
