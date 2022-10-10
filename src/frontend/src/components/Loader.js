export default function Loader({ style }) {
	return (
		<div className="text-center">
			<div
				className="spinner-border"
				role="status"
				style={style.loader}
			>
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	);
}
