import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { populateFormData } from '../../utils/form';
import { AdminEditAttendeePayload } from '../../utils/schemas';
import { AttendeeWithUser } from '../../utils/user';

export interface UseEditAttendeeMutationData {
	adminEditAttendeeMutation: UseMutationResult<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminEditAttendeePayload
	>;
}

export const useEditAttendeeMutation = (eid: string, uid: string): UseEditAttendeeMutationData => {
	const queryClient = useQueryClient();

	const adminEditAttendeeMutation = useMutation<
		AttendeeWithUser,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminEditAttendeePayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.put<SuccessAPIResponse<AttendeeWithUser>>(
					`/api/events/${eid}/admin/attendees/${uid}/edit`,
					formData
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Attendee edited successfully');

				router.push(`/events/${eid}/admin/attendees`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, uid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { adminEditAttendeeMutation };
};