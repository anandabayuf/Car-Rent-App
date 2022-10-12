import { Modal } from 'react-bootstrap';

export default function DeleteUserModal(props) {
	return (
		<Modal
			show={props.deleteUserModalState}
			onHide={() => props.setDeleteUserModalState(false)}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Delete User
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					Are you sure you want to delete the user data with username:{' '}
					<strong>{props.user.username}</strong>
				</p>
			</Modal.Body>
			<Modal.Footer>
				<div className="row justify-content-end">
					<div className="col-auto">
						<button
							className="btn btn-outline-dark"
							onClick={() => props.setDeleteUserModalState(false)}
						>
							Cancel
						</button>
					</div>
					<div className="col-auto">
						<button
							className="btn btn-outline-danger"
							onClick={() => {
								props.setDeleteUserModalState(false);
								props.handleDelete(props.user._id);
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
