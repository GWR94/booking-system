import { render, screen, fireEvent } from '../../__test__/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './NavBar';

test('renders NavBar component', () => {
	render(
		<Router>
			<NavBar />
		</Router>,
	);
	const linkElement = screen.getAllByText(/home/i);
	expect(linkElement[0]).toBeInTheDocument();
});

test('navigates to About Us page on button click', () => {
	render(
		<Router>
			<NavBar />
		</Router>,
	);
	const aboutButton = screen.getAllByText(/about us/i);
	fireEvent.click(aboutButton[0]);
	expect(window.location.pathname).toBe('/about');
});

test('navigates to Book page on button click', () => {
	render(
		<Router>
			<NavBar />
		</Router>,
	);
	const bookButton = screen.getAllByText(/book/i);
	fireEvent.click(bookButton[0]);
	expect(window.location.pathname).toBe('/book');
});

test('opens user menu on avatar click', () => {
	render(
		<Router>
			<NavBar />
		</Router>,
	);
	const avatarButton = screen.getByRole('button', { name: /open settings/i });
	fireEvent.click(avatarButton);
	const profileMenuItem = screen.getByText(/profile/i);
	expect(profileMenuItem).toBeInTheDocument();
});
