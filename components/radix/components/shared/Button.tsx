import cx from 'classnames';
import React from 'react';

type Props = React.ComponentProps<'button'> & {};

const Button = React.forwardRef<HTMLButtonElement, Props>(
	({ children, className, ...props }, ref) => (
		<button
			ref={ref}
			{...props}
			className={cx(
				'border border-gray-300 inline-flex select-none items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
				'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900',
				'hover:bg-gray-50',
				'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75',
				// Register all radix states
				'group',
				'radix-state-open:bg-gray-50 dark:radix-state-open:bg-gray-900',
				'radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900',
				'radix-state-instant-open:bg-gray-50 radix-state-delayed-open:bg-gray-50',
				className
			)}
		>
			{children}
		</button>
	)
);

Button.displayName = 'Button';
export default Button;
