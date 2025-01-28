import React, { createContext, useEffect, useState } from 'react';
import { GroupedSlot } from '../components/interfaces/SlotContext.i';
import {
	BasketContextType,
	BasketProviderProps,
} from '../components/interfaces/BasketContext.i';
import { useSnackbar } from './SnackbarContext';
import { HOURLY_RATE } from '../components/booking/CheckoutItem';
import { Booking } from '../components/interfaces/Booking.i';

const BasketContext = createContext<BasketContextType | null>(null);

export const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
	const [basket, setBasket] = useState<GroupedSlot[]>([]);
	const [booking, setBooking] = useState<Booking | null>(null);
	const { showSnackbar } = useSnackbar();

	useEffect(() => {
		loadBooking();
		loadBasket();
	}, []);

	const saveBasket = (newBasket: GroupedSlot[]) => {
		localStorage.setItem('booking-basket', JSON.stringify(newBasket));
		setBasket(newBasket);
	};

	const loadBasket = (): GroupedSlot[] => {
		const saved = localStorage.getItem('booking-basket');
		if (saved) {
			const parsed = JSON.parse(saved);
			setBasket(parsed);
			return parsed;
		}
		return [];
	};

	const loadBooking = () => {
		const saved = localStorage.getItem('booking-data');
		if (saved) {
			const parsed = JSON.parse(saved);
			setBooking(parsed);
			return parsed;
		}
		return null;
	};

	const saveBooking = (booking: Booking | null) => {
		localStorage.setItem('booking-data', JSON.stringify(booking));
		setBooking(booking);
	};

	const clearBooking = () => {
		localStorage.removeItem('booking-data');
		setBooking(null);
	};

	const clearBasket = () => {
		localStorage.removeItem('booking-basket');
		setBasket([]);
	};

	const addToBasket = (slot: GroupedSlot) => {
		if (basket.includes(slot)) {
			return showSnackbar('Slot already in basket', 'error');
		}
		const newBasket = [...basket, slot];
		saveBasket(newBasket);
	};

	const removeFromBasket = (slot: GroupedSlot) => {
		const newBasket = basket.filter((s) => s.id !== slot.id);
		saveBasket(newBasket);
	};

	const value: BasketContextType = {
		basket,
		basketPrice: basket
			.reduce((acc, slot) => acc + slot.slotIds.length * (HOURLY_RATE / 100), 0)
			.toFixed(2),
		addToBasket,
		removeFromBasket,
		setBooking: (booking: Booking | null) => saveBooking(booking),
		booking,
		clearBasket,
		clearBooking,
	};

	return (
		<BasketContext.Provider value={value}>{children}</BasketContext.Provider>
	);
};

export const useBasket = (): BasketContextType => {
	const context = React.useContext(BasketContext);
	if (!context) {
		throw new Error('useBasket must be used within a BasketProvider');
	}
	return context;
};
