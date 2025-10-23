import React, { createContext, useContext, useState } from 'react';

interface AnimationContextType {
	initialAnimationsCompleted: boolean;
	setInitialAnimationsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimationContext = createContext<AnimationContextType>({
	initialAnimationsCompleted: false,
	setInitialAnimationsCompleted: () => {},
});

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [initialAnimationsCompleted, setInitialAnimationsCompleted] =
		useState(false);

	console.log(initialAnimationsCompleted);

	return (
		<AnimationContext.Provider
			value={{ initialAnimationsCompleted, setInitialAnimationsCompleted }}
		>
			{children}
		</AnimationContext.Provider>
	);
};

export const useAnimationContext = () => useContext(AnimationContext);
