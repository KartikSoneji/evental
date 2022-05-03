import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsQueryData {
	sessions: SessionWithVenue[] | undefined;
	isSessionsLoading: boolean;
	sessionsError: ErroredAPIResponse | null;
}

export const useSessionsQuery = (
	eid: string,
	initialData?: SessionWithVenue[] | undefined
): UseSessionsQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessions, isLoading: isSessionsLoading } = useQuery<
		SessionWithVenue[],
		AxiosError<ErroredAPIResponse>
	>(
		['sessions', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { sessions, isSessionsLoading, sessionsError: error };
};
