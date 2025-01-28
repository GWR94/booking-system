import { Booking } from './Booking.i';
import { GroupedSlot } from './SlotContext.i';

export interface BasketContextType {
	basket: GroupedSlot[];
	basketPrice: string;
	booking: Booking | null;
	addToBasket: (slot: GroupedSlot) => void;
	removeFromBasket: (slot: GroupedSlot) => void;
	setBooking: (booking: Booking | null) => void;
	clearBasket: () => void;
	clearBooking: () => void;
}

export interface BasketProviderProps {
	children: React.ReactNode;
}
