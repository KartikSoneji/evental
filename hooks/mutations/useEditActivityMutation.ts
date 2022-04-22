import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditActivityPayload, EditActivitySchema } from '../../utils/schemas';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export const useEditActivityMutation = (eid: string, aid: string) => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const editActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = EditActivitySchema.parse(formEntries);

			const body: EditActivityPayload = {
				slug: parsed.slug,
				name: parsed.name,
				venueId: parsed.venueId,
				startDate: new Date(parsed.startDate).toISOString(),
				endDate: new Date(parsed.endDate).toISOString(),
				description: parsed.description
			};

			return await axios.put(`/api/events/${eid}/admin/activities/${aid}/edit`, body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				void queryClient.invalidateQueries(['venue', eid, aid]);

				void router.push(`/events/${eid}/activities/${response.data.slug}`);
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { editActivityMutation, editActivityError: error };
};
