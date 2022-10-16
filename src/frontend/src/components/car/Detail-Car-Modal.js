import { useEffect, useState } from 'react';
import { Badge, Modal } from 'react-bootstrap';
import { idrFormat } from '../../utils/Formatter';

export default function DetailCarModal(props) {
	const [base64String, setBase64String] = useState('');

	useEffect(() => {
		setBase64String(
			btoa(
				new Uint8Array(props.car.picture.data.data).reduce(function (
					data,
					byte
				) {
					return data + String.fromCharCode(byte);
				},
				'')
			)
		);
	}, [props.car]);

	return (
		<Modal
			show={props.detailCarModalState}
			onHide={() => props.setDetailCarModalState(false)}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Detail Car
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: '20px 50px 50px 50px' }}>
				<div className="row justify-content-between">
					<div className="col-auto">
						<h5>Car Information</h5>
					</div>
					<div className="col-auto">
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
				</div>
				<div className="mb-3 text-center">
					<img
						src={`data:image/png;base64,${base64String}`}
						width={300}
						alt="car picture"
					/>
				</div>
				<div className="mb-3">
					<div className="row">
						<div className="col">
							<div className="mb-3">
								<h6>Brand</h6>
								<p>{props.car.brand}</p>
							</div>
							<div className="mb-3">
								<h6>Type</h6>
								<p>{props.car.type}</p>
							</div>
							<div className="mb-3">
								<h6>Year</h6>
								<p>{props.car.year}</p>
							</div>
						</div>
						<div className="col">
							<div className="mb-3">
								<h6>Plate Number</h6>
								<p>{props.car.plateNo}</p>
							</div>
							<div className="mb-3">
								<h6>Rent Price Per Day</h6>
								<p>{idrFormat(props.car.rentPrice.perDay)}</p>
							</div>
							<div className="mb-3">
								<h6>Rent Price Per Hour</h6>
								<p>{idrFormat(props.car.rentPrice.perHour)}</p>
							</div>
						</div>
					</div>
				</div>
				<hr />
				<div>
					<h5 className="mb-3">Created By</h5>
					<div className="row">
						<div className="col">
							<div>
								<h6>Username</h6>
								<p>{props.car.user.username}</p>
							</div>
						</div>
						<div className="col">
							<div>
								<h6>Email</h6>
								<p>{props.car.user.email}</p>
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}
