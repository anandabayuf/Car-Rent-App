import { Modal } from 'react-bootstrap';

export default function DeleteCarModal(props) {
	return (
		<Modal
			show={props.deleteCarModalState}
			onHide={() => props.setDeleteCarModalState(false)}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Delete Car
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					Are you sure you want to delete the car data with the plate
					number: <strong>{props.car.plateNo}</strong>
				</p>
			</Modal.Body>
			<Modal.Footer>
				<div className="row justify-content-end">
					<div className="col-auto">
						<button
							className="btn btn-outline-dark"
							onClick={() => props.setDeleteCarModalState(false)}
						>
							Cancel
						</button>
					</div>
					<div className="col-auto">
						<button
							className="btn btn-outline-danger"
							onClick={() => {
								props.setDeleteCarModalState(false);
								props.handleDelete(props.car._id);
							}}
						>
							Delete
						</button>
					</div>
				</div>
			</Modal.Footer>
		</Modal>
	);
}
