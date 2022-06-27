import Link from 'next/link';
import React from 'react';

import { eduAttendeePricing, priceAfterSale, proAttendeePricing, sale } from '../utils/const';
import { PromotionalOffer } from './PromotionalOffer';

type EventalProCardProps = {
	attendees: number;
	isEducation?: boolean;
};

const EventalProCardPrice: React.FC<EventalProCardProps> = (props) => {
	const { attendees, isEducation = false } = props;

	if (sale.percentage > 0 || sale.flatAmount > 0) {
		return (
			<div className="flex flex-row justify-center items-end -ml-4">
				<p className="inline-block">
					<span className="mr-2 line-through text-lg md:text-2xl text-gray-500 font-medium leading-[1.2] tracking-tight">
						<span className="text-sm md:text-lg align-top">$</span>
						{isEducation
							? eduAttendeePricing[attendees].price
							: proAttendeePricing[attendees].price}
					</span>
				</p>
				<p className="inline-block">
					<span className="text-green-500 text-3xl font-bold md:text-5xl leading-[1]">
						<span className="text-xl md:text-2xl align-top">$</span>
						{isEducation
							? priceAfterSale(eduAttendeePricing[attendees].price)
							: priceAfterSale(proAttendeePricing[attendees].price)}
					</span>
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-row justify-center items-end -ml-4 mb-3">
			<p className="inline-block">
				<span className="text-gray-700 text-3xl font-bold md:text-5xl leading-[1]">
					<span className="text-xl md:text-2xl align-top">$</span>
					{isEducation ? eduAttendeePricing[attendees].price : proAttendeePricing[attendees].price}
				</span>
			</p>
		</div>
	);
};

export const EventalProCard: React.FC<EventalProCardProps> = (props) => {
	const { attendees, isEducation = false, children } = props;

	return (
		<div className="my-3 flex min-h-[350px] max-w-[450px] flex-col items-center justify-between space-y-4 rounded border border-gray-300 bg-white p-5 shadow-sm">
			<div className="flex flex-row items-center">
				<strong
					className="mr-2 font-display text-2xl font-bold tracking-tight"
					aria-label="evental homepage"
				>
					Evental
				</strong>
				<span className="rounded bg-primary py-1 px-2 text-xs font-medium text-white">
					{isEducation ? 'EDU' : 'PRO'}
				</span>
			</div>

			<p className="text-gray-700">
				The {isEducation ? 'education/non-profit' : 'pro'} plan allows event organizers to create
				unlimited roles, sessions, venues, and pages. It also allows you to invite additional
				organizers to help you manage your event.
			</p>

			<div>
				<EventalProCardPrice attendees={attendees} isEducation={isEducation} />

				<PromotionalOffer />

				<p className="text-center text-sm text-gray-600">
					Includes {attendees} attendees (
					{isEducation
						? priceAfterSale(eduAttendeePricing[attendees].price) / attendees < 1
							? `${Math.ceil(
									(priceAfterSale(eduAttendeePricing[attendees].price) / attendees) * 100
							  )}¢`
							: `$${(priceAfterSale(eduAttendeePricing[attendees].price) / attendees).toFixed(2)}`
						: priceAfterSale(proAttendeePricing[attendees].price) / attendees < 1
						? `${Math.ceil(
								(priceAfterSale(proAttendeePricing[attendees].price) / attendees) * 100
						  )}¢`
						: `$${(priceAfterSale(proAttendeePricing[attendees].price) / attendees).toFixed(2)}`}
					/per)
				</p>
			</div>

			{children}

			<Link href="/contact">
				<a className="text-sm text-gray-500">
					Need help? <span className="text-gray-800 underline">Contact us</span>
				</a>
			</Link>
		</div>
	);
};
