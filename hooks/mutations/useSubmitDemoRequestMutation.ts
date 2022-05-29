import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { SubmitDemoRequestPayload } from '../../utils/schemas';
import { PasswordlessUser } from '../../utils/stripUserPassword';

export type UseSubmitDemoRequestMutationData = UseMutationResult<
	PasswordlessUser,
	AxiosError<ErroredAPIResponse, unknown>,
	SubmitDemoRequestPayload
>;

interface UseSubmitDemoRequestMutationOptions {
	redirectUrl?: string;
}

export const useSubmitDemoRequestMutation = (
	args: UseSubmitDemoRequestMutationOptions = {}
): UseSubmitDemoRequestMutationData => {
	const { redirectUrl } = args;

	return useMutation<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SubmitDemoRequestPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<PasswordlessUser>>(`/api/demo`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				if (redirectUrl) {
					router.push(redirectUrl).then(() => {
						toast.success('Your support ticket has been submitted');
					});
				} else {
					toast.success('Your support ticket has been submitted.');
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to submit support ticket.');
			}
		}
	);
};