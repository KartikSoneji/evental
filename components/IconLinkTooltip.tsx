import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { iconColors } from './IconButtonTooltip';
import Tooltip from './radix/components/Tooltip';

export const iconLinkTooltipSkeleton = (
	<div className="p-1">
		<Skeleton className="h-5 w-5" />
	</div>
);

type Props = React.FC<
	{
		href: string;
		icon: IconDefinition;
		message: string;
		side?: 'bottom' | 'top' | 'right' | 'left' | undefined;
		className?: string;
		color?: keyof typeof iconColors;
	} & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
>;

export const IconLinkTooltip: Props = (props) => {
	const { children, href, icon, message, className, side = 'top', color = 'gray', ...rest } = props;

	return (
		<Tooltip message={message} side={side}>
			<div>
				<Link href={href} passHref>
					<a
						className={classNames('flex items-center justify-center', iconColors[color], className)}
						{...rest}
					>
						<FontAwesomeIcon fill="currentColor" className="h-5 w-5 p-1" size="1x" icon={icon} />
					</a>
				</Link>
			</div>
		</Tooltip>
	);
};
