import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { UseDeleteRoleMutationData } from '../../hooks/mutations/useDeleteRoleMutation';
import { UseRoleQueryData } from '../../hooks/queries/useRoleAttendeesQuery';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

type Props = { attendees: AttendeeWithUser[] } & Omit<
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
	'role'
> &
	UseDeleteRoleMutationData &
	UseRoleQueryData;

export const DeleteRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { deleteRoleMutation, role } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!role) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteRoleMutation.mutate();
			})}
		>
			<div className="flex flex-col w-full mt-3">
				<div className="mb-5">
					<div>
						<p className="mb-3">All of the data regarding this role will be permanently deleted.</p>

						<Label htmlFor="confirmDelete">
							Type <span className="font-bold">DELETE</span> to confirm
						</Label>
						<Input {...register('confirmDelete')} />
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="danger"
					className="ml-4"
					disabled={!canSubmit || deleteRoleMutation.isLoading}
				>
					{deleteRoleMutation.isLoading ? <LoadingInner /> : 'Delete Role'}
				</Button>
			</div>
		</form>
	);
};
