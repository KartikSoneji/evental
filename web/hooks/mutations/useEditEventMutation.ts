import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { populateFormData } from '../../utils/form';
import { EditEventPayload } from '../../utils/schemas';

export interface UseEditEventMutationData {
	editEventMutation: UseMutationResult<
		Prisma.Event,
		AxiosError<ErroredAPIResponse, unknown>,
		EditEventPayload
	>;
}

export const useEditEventMutation = (eid: string): UseEditEventMutationData => {
	const queryClient = useQueryClient();

	const editEventMutation = useMutation<
		Prisma.Event,
		AxiosError<ErroredAPIResponse, unknown>,
		EditEventPayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.put<SuccessAPIResponse<Prisma.Event>>(`/api/events/${eid}/admin`, formData)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Event edited successfully');

				void router.push(`/events/${data.slug}/admin`).then(() => {
					void queryClient.refetchQueries(['event', eid]);
					void queryClient.invalidateQueries(['upcoming-events']);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editEventMutation };
};
