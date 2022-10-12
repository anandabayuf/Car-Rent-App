export default function DashboardPage() {
	const style = {
		page: {
			padding: '30px',
			backgroundColor: '#F9F7F7',
		},
		container: {
			width: 'auto',
			padding: '30px',
			borderRadius: '30px',
		},
		title: {
			color: '#112D4E',
		},
		label: {
			color: '#3F72AF',
		},
		input: {
			borderRadius: '10px',
			borderColor: '#DBE2EF',
			color: '#3F72AF',
		},
		button: {
			borderRadius: '15px',
			backgroundColor: '#3F72AF',
			color: '#F9F7F7',
		},
		signUpText: {
			color: '#3F72AF',
		},
		link: {
			textDecoration: 'underline',
			color: '#112D4E',
		},
		loader: {
			color: '#3F72AF',
		},
	};
	return (
		<div
			className="min-vh-100"
			style={style.page}
		></div>
	);
}
