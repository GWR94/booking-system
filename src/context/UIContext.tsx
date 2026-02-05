import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AuthModalView = 'login' | 'register';

interface UIContextType {
	isAuthModalOpen: boolean;
	authModalView: AuthModalView;
	openAuthModal: (view?: AuthModalView) => void;
	closeAuthModal: () => void;
	toggleAuthModalView: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authModalView, setAuthModalView] = useState<AuthModalView>('login');

	const openAuthModal = (view: AuthModalView = 'login') => {
		setAuthModalView(view);
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	const toggleAuthModalView = () => {
		setAuthModalView((prev) => (prev === 'login' ? 'register' : 'login'));
	};

	return (
		<UIContext.Provider
			value={{
				isAuthModalOpen,
				authModalView,
				openAuthModal,
				closeAuthModal,
				toggleAuthModalView,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};

export const useUI = () => {
	const context = useContext(UIContext);
	if (context === undefined) {
		throw new Error('useUI must be used within a UIProvider');
	}
	return context;
};
