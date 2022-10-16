import { Modal, Badge } from 'react-bootstrap';
import { ArrowRight, ExclamationTriangle } from 'react-bootstrap-icons';

export default function UpdateBorrowStatusModal(props) {
	return (
		<Modal
			show={props.updateBorrowStatusModalState}
			onHide={() => props.setUpdateBorrowStatusModalState(false)}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Update Borrow Status
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="mb-3 text-center">
					<p>
						Are you sure you want to update the borrow status with
						<br /> car plate no:{' '}
						<strong>{props.borrow.car.plateNo}</strong>?
					</p>
				</div>
				<div className="mb-3 row justify-content-center">
					<div className="col-auto">
						<Badge
							bg={
								props.borrow.status === 'Booked'
									? 'secondary'
									: props.borrow.status === 'On Doing'
									? 'primary'
									: props.borrow.status === 'Done'
									? 'success'
									: 'info'
							}
						>
							{props.borrow.status}
						</Badge>
					</div>
					<div className="col-auto">
						<ArrowRight size={16} />
					</div>
					<div className="col-auto">
						<Badge
							bg={
								props.borrow.status === 'Booked'
									? 'primary'
									: props.borrow.status === 'On Doing'
									? 'success'
									: 'info'
							}
						>
							{props.borrow.status === 'Booked'
								? 'On Doing'
								: props.borrow.status === 'On Doing'
								? 'Done'
								: 'Returned'}
						</Badge>
					</div>
				</div>
				<div className="text-center">
					<p className="text-danger">
						<ExclamationTriangle size={16} />{' '}
						<strong>This action cannot be undone</strong>
					</p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<div className="row justify-content-end">
					<div className="col-auto">
						<button
							className="btn btn-outline-dark"
							onClick={() =>
								props.setUpdateBorrowStatusModalState(false)
							}
						>
							Cancel
						</button>
					</div>
					<div className="col-auto">
						<button
							className="btn btn-outline-warning"
							onClick={() => {
								props.setUpdateBorrowStatusModalState(false);
								props.borrow.status === 'Done'
									? props.handleReturn(props.borrow)
									: props.handleUpdateStatus(props.borrow);
							}}
						>
							Update
						</button>
					</div>
				</div>
			</Modal.Footer>
		</Modal>
	);
}
