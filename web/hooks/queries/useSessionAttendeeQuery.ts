import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseQueryResult, useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/user';

export interface UseSessionAttendeeQueryData {
	sessionAttendeeQuery: UseQueryResult<
		AttendeeWithUser | undefined,
		AxiosError<ErroredAPIResponse>
	>;
}

export const useSessionAttendeeQuery = (
	eid: string,
	sid: string,
	uid: string,
	initialData?: AttendeeWithUser | undefined
): UseSessionAttendeeQueryData => {
	const sessionAttendeeQuery = useQuery<
		AttendeeWithUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['attendee', eid, sid, uid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser>>(
					`/api/events/${eid}/sessions/${sid}/attendees/${uid}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				sid !== undefined &&
				uid !== undefined &&
				uid !== 'undefined' &&
				sid !== 'undefined' &&
				eid !== '' &&
				sid !== '' &&
				uid !== '',
			initialData
		}
	);

	return { sessionAttendeeQuery };
};