import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseVenuesQueryData {
	venues: Prisma.EventVenue[] | undefined;
	isVenuesLoading: boolean;
	venuesError: ServerErrorPayload | null;
}

export const useVenuesQuery = (eid: string): UseVenuesQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: venues, isLoading: isVenuesLoading } = useQuery<
		Prisma.EventVenue[],
		AxiosError<ServerError>
	>(
		['venues', eid],
		async () => {
			return axios.get<Prisma.EventVenue[]>(`/api/events/${eid}/venues`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { venues, isVenuesLoading, venuesError: error };
};