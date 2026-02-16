import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserProfile from './UserProfile';
import { ThemeProvider } from '@context';

// Mock sub-components
vi.mock('./ViewProfile', () => ({
	default: ({ handleEditToggle }: { handleEditToggle: () => void }) => (
		<div data-testid="mock-view-profile">
			<button onClick={handleEditToggle}>Edit</button>
		</div>
	),
}));

vi.mock('./EditProfile', () => ({
	default: ({ handleEditToggle }: { handleEditToggle: () => void }) => (
		<div data-testid="mock-edit-profile">
			<button onClick={handleEditToggle}>Cancel</button>
		</div>
	),
}));

describe('UserProfile', () => {
	it('should render ViewProfile by default', () => {
		render(
			<ThemeProvider>
				<UserProfile />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('mock-view-profile')).toBeInTheDocument();
		expect(screen.queryByTestId('mock-edit-profile')).not.toBeInTheDocument();
	});

	it('should toggle to EditProfile when edit is clicked', () => {
		render(
			<ThemeProvider>
				<UserProfile />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('Edit'));
		expect(screen.getByTestId('mock-edit-profile')).toBeInTheDocument();
		expect(screen.queryByTestId('mock-view-profile')).not.toBeInTheDocument();
	});

	it('should toggle back to ViewProfile when cancel is clicked', () => {
		render(
			<ThemeProvider>
				<UserProfile />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('Edit'));
		fireEvent.click(screen.getByText('Cancel'));
		expect(screen.getByTestId('mock-view-profile')).toBeInTheDocument();
	});
});
