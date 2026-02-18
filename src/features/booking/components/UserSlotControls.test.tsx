import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';

import UserSlotControls from './UserSlotControls';
import type { GroupedSlot } from './types';
import createWrapper from '@utils/test-utils';

const slot: GroupedSlot = {
	id: 1,
	startTime: dayjs(),
	endTime: dayjs().add(1, 'hour'),
	bayId: 1,
	slotIds: [1],
};

describe('UserSlotControls', () => {
	it('renders Add Bay button when not in basket', () => {
		render(
			<UserSlotControls
				slot={slot}
				selectedBay={1}
				isInBasket={false}
				basketCount={0}
				handleSlotClick={vi.fn()}
				handleRemoveOne={vi.fn()}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: /Add Bay 1/i })).toBeInTheDocument();
	});

	it('renders Remove button when in basket and selectedBay is not 5', () => {
		render(
			<UserSlotControls
				slot={slot}
				selectedBay={1}
				isInBasket={true}
				basketCount={1}
				handleSlotClick={vi.fn()}
				handleRemoveOne={vi.fn()}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument();
	});

	it('calls handleRemoveOne when Remove is clicked', () => {
		const handleRemoveOne = vi.fn();
		render(
			<UserSlotControls
				slot={slot}
				selectedBay={1}
				isInBasket={true}
				basketCount={1}
				handleSlotClick={vi.fn()}
				handleRemoveOne={handleRemoveOne}
			/>,
			{ wrapper: createWrapper() },
		);
		fireEvent.click(screen.getByRole('button', { name: /Remove/i }));
		expect(handleRemoveOne).toHaveBeenCalled();
	});

	it('calls handleSlotClick when Add Bay is clicked', () => {
		const handleSlotClick = vi.fn();
		render(
			<UserSlotControls
				slot={slot}
				selectedBay={1}
				isInBasket={false}
				basketCount={0}
				handleSlotClick={handleSlotClick}
				handleRemoveOne={vi.fn()}
			/>,
			{ wrapper: createWrapper() },
		);
		fireEvent.click(screen.getByRole('button', { name: /Add Bay 1/i }));
		expect(handleSlotClick).toHaveBeenCalled();
	});

	it('shows Added and delete icon when availability is unavailable and basketCount > 0', () => {
		render(
			<UserSlotControls
				slot={slot}
				selectedBay={1}
				isInBasket={false}
				basketCount={1}
				availability="unavailable"
				handleSlotClick={vi.fn()}
				handleRemoveOne={vi.fn()}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: /Added/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Added/i })).toBeDisabled();
	});

	it('shows Unavailable when availability is unavailable and basketCount is 0', () => {
		render(
			<UserSlotControls
				slot={slot}
				selectedBay={1}
				isInBasket={false}
				basketCount={0}
				availability="unavailable"
				handleSlotClick={vi.fn()}
				handleRemoveOne={vi.fn()}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: /Unavailable/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Unavailable/i })).toBeDisabled();
	});

	it('when selectedBay is 5 and in basket shows Add Bay button', () => {
		const slot5: GroupedSlot = { ...slot, bayId: 5 };
		render(
			<UserSlotControls
				slot={slot5}
				selectedBay={5}
				isInBasket={true}
				basketCount={1}
				handleSlotClick={vi.fn()}
				handleRemoveOne={vi.fn()}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: /Add Bay 5/i })).toBeInTheDocument();
	});

	it('when selectedBay is 5 and basketCount > 0 clicking delete icon calls handleRemoveOne', () => {
		const handleRemoveOne = vi.fn();
		const slot5: GroupedSlot = { ...slot, bayId: 5 };
		render(
			<UserSlotControls
				slot={slot5}
				selectedBay={5}
				isInBasket={false}
				basketCount={1}
				handleSlotClick={vi.fn()}
				handleRemoveOne={handleRemoveOne}
			/>,
			{ wrapper: createWrapper() },
		);
		const buttons = screen.getAllByRole('button');
		// First button is the small delete icon button
		fireEvent.click(buttons[0]);
		expect(handleRemoveOne).toHaveBeenCalled();
	});
});
