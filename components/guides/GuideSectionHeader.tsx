import Link from 'next/link';
import React from 'react';

import { CopyToClipboard } from './CopyToClipboard';

type Props = React.FC<
	{ url: string; text: string } & React.DetailedHTMLProps<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>
>;

export const GuideSectionHeader: Props = (props) => {
	const { children, text, url, ...rest } = props;

	return (
		<Link href={url}>
			<a className="text-xl font-bold mb-2 block" {...rest}>
				{text} <CopyToClipboard link={url} />
			</a>
		</Link>
	);
};
