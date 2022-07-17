import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseEventQueryData {
	event: Prisma.Event | undefined;
	isEventLoading: boolean;
	eventError: ErroredAPIResponse | null;
}

export const useEventQuery = (
	eid: string,
	initialData?: Prisma.Event | undefined
): UseEventQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: event, isLoading: isEventLoading } = useQuery<
		Prisma.Event,
		AxiosError<ErroredAPIResponse>
	>(
		['event', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.Event>>(`/api/events/${eid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && eid !== '',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { event: event, isEventLoading, eventError: error };
};
