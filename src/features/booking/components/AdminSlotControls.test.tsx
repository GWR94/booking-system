import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';

import AdminSlotControls from './AdminSlotControls';
import type { GroupedSlot } from './types';
import createWrapper from '@utils/test-utils';

const baseSlot = (bayId: number): GroupedSlot => ({
	id: bayId,
	startTime: dayjs(),
	endTime: dayjs().add(1, 'hour'),
	bayId,
	slotIds: [bayId],
});

describe('AdminSlotControls', () => {
	it('renders four bay buttons', () => {
		const hourlySlots: GroupedSlot[] = [
			baseSlot(1),
			baseSlot(2),
			baseSlot(3),
			baseSlot(4),
		];
		render(
			<AdminSlotControls hourlySlots={hourlySlots} onAdminSlotClick={vi.fn()} />,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
	});

	it('disables button when bay is not in hourlySlots', () => {
		const hourlySlots: GroupedSlot[] = [baseSlot(1), baseSlot(3)];
		render(
			<AdminSlotControls hourlySlots={hourlySlots} onAdminSlotClick={vi.fn()} />,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByRole('button', { name: '1' })).not.toBeDisabled();
		expect(screen.getByRole('button', { name: '2' })).toBeDisabled();
		expect(screen.getByRole('button', { name: '3' })).not.toBeDisabled();
		expect(screen.getByRole('button', { name: '4' })).toBeDisabled();
	});

	it('calls onAdminSlotClick with slot when available bay is clicked', () => {
		const onAdminSlotClick = vi.fn();
		const slot2 = baseSlot(2);
		render(
			<AdminSlotControls
				hourlySlots={[baseSlot(1), slot2, baseSlot(3), baseSlot(4)]}
				onAdminSlotClick={onAdminSlotClick}
			/>,
			{ wrapper: createWrapper() },
		);
		fireEvent.click(screen.getByRole('button', { name: '2' }));
		expect(onAdminSlotClick).toHaveBeenCalledWith(slot2);
	});
});
