import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseEventsQueryData {
	events: Prisma.Event[] | undefined;
	isEventsLoading: boolean;
	eventsError: ServerErrorPayload | null;
}

export const useEventsQuery = (): UseEventsQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: events, isLoading: isEventsLoading } = useQuery<
		Prisma.Event[],
		AxiosError<ServerError>
	>(
		['events'],
		async () => {
			return axios.get<Prisma.Event[]>(`/api/events`).then((res) => res.data);
		},
		{
			retry: 0,
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { events, isEventsLoading, eventsError: error };
};