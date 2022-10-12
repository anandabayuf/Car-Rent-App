import { useEffect, useState } from 'react';
import { Badge, Modal } from 'react-bootstrap';

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
			<Modal.Body>
				<div className="mb-3 text-center">
					<img
						src={`data:image/png;base64,${base64String}`}
						width={300}
						alt="car picture"
					/>
				</div>
				<div className="mb-3">
					<h5>Car Plate Number</h5>
					<p>
						<strong>{props.car.plateNo}</strong>
					</p>
				</div>
				<div className="mb-3">
					<div className="row">
						<div className="col">
							<h5>Brand</h5>
							<p>{props.car.brand}</p>
						</div>
						<div className="col">
							<h5>Type</h5>
							<p>{props.car.type}</p>
						</div>
						<div className="col">
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
										{props.car.rentPrice.perDay.toLocaleString(
											'id-ID',
											{
												style: 'currency',
												currency: 'IDR',
												minimumFractionDigits: 0,
											}
										)}
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
										{props.car.rentPrice.perHour.toLocaleString(
											'id-ID',
											{
												style: 'currency',
												currency: 'IDR',
												minimumFractionDigits: 0,
											}
										)}
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
				{props.car.status === 'Not Available' ? (
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
				) : (
					<></>
				)}
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
				</div>
			</Modal.Body>
		</Modal>
	);
}
