'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CookiePreferences {
	essential: boolean; // Always true
	functional: boolean;
	analytics: boolean;
	marketing: boolean;
}

interface CookieContextType {
	preferences: CookiePreferences;
	isConsentSet: boolean; // true if user has made a choice (to hide banner)
	savePreferences: (prefs: CookiePreferences) => void;
	acceptAll: () => void;
	rejectAll: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const STORAGE_KEY = 'cookie_preferences';

const defaultPreferences: CookiePreferences = {
	essential: true,
	functional: false,
	analytics: false,
	marketing: false,
};

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [preferences, setPreferences] =
		useState<CookiePreferences>(defaultPreferences);
	const [isConsentSet, setIsConsentSet] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				setPreferences(JSON.parse(stored));
				setIsConsentSet(true);
			} catch (e) {
				console.error('Failed to parse cookie preferences', e);
				// Fallback to default if corrupted
			}
		}
	}, []);

	const savePreferences = (newPrefs: CookiePreferences) => {
		const toSave = { ...newPrefs, essential: true }; // Ensure essential is always true
		setPreferences(toSave);
		setIsConsentSet(true);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
	};

	const acceptAll = () => {
		savePreferences({
			essential: true,
			functional: true,
			analytics: true,
			marketing: true,
		});
	};

	const rejectAll = () => {
		savePreferences({
			essential: true,
			functional: false,
			analytics: false,
			marketing: false,
		});
	};

	return (
		<CookieContext.Provider
			value={{
				preferences,
				isConsentSet,
				savePreferences,
				acceptAll,
				rejectAll,
			}}
		>
			{children}
		</CookieContext.Provider>
	);
};

export const useCookie = () => {
	const context = useContext(CookieContext);
	if (!context) {
		throw new Error('useCookie must be used within a CookieProvider');
	}
	return context;
};
