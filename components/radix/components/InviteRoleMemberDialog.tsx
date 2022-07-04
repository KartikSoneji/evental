import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { useInviteRoleMutation } from '../../../hooks/mutations/useInviteRoleMutation';
import { useRoleQuery } from '../../../hooks/queries/useRoleAttendeesQuery';
import { InviteOrganizerPayload, InviteOrganizerSchema } from '../../../utils/schemas';
import { LoadingInner } from '../../error/LoadingInner';
import { Button } from '../../form/Button';
import { ErrorMessage } from '../../form/ErrorMessage';
import { Input } from '../../form/Input';
import { Label } from '../../form/Label';
import { DialogContent } from './DialogContent';

interface Props {
	eid: string;
	rid: string;
}

const InviteRoleMemberDialog: React.FC<Props> = (props) => {
	const { eid, rid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { inviteRoleMutation } = useInviteRoleMutation(String(eid), String(rid));
	const { role } = useRoleQuery(String(eid), String(rid));

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<InviteOrganizerPayload>({
		resolver: zodResolver(InviteOrganizerSchema)
	});

	useEffect(() => {
		if (!inviteRoleMutation.isLoading && inviteRoleMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [inviteRoleMutation.isLoading]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					{role ? `Invite ${role.name}` : <Skeleton className="w-full" />}
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					{role ? (
						<>
							Enter the users email that you wish to invite to the{' '}
							<span className="font-medium">"{role.name}"</span> role. They will receive an email
							with information on how to claim their role.
						</>
					) : (
						<Skeleton className="w-full" count={3} />
					)}
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit((data) => {
						inviteRoleMutation.mutate(data);
					})}
				>
					<div className="mt-4">
						<Label htmlFor="name">Email *</Label>
						<Input placeholder="Email" type="email" {...register('email')} autoFocus />
						{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
					</div>
					<div className="mt-4 flex justify-end space-x-2">
						<DialogPrimitive.Cancel asChild>
							<Button variant="no-bg">Cancel</Button>
						</DialogPrimitive.Cancel>

						<Button variant="primary" disabled={inviteRoleMutation.isLoading}>
							{inviteRoleMutation.isLoading ? <LoadingInner /> : 'Invite'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default InviteRoleMemberDialog;