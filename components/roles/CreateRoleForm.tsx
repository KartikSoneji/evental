import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseCreateRoleMutationData } from '../../hooks/mutations/useCreateRoleMutation';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreateRolePayload, CreateRoleSchema } from '../../utils/schemas';
import { ErrorMessage } from '../form/ErrorMessage';
import { slugify } from '../../utils/slugify';
import { useRoleAttendeesQuery } from '../../hooks/queries/useRoleAttendeesQuery';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseCreateRoleMutationData;

export const CreateRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createRoleMutation, eid } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<CreateRolePayload>({
		defaultValues: {
			defaultRole: false
		},
		resolver: zodResolver(CreateRoleSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');

	const { role: roleSlugCheck, isRoleAttendeesLoading: isRoleSlugCheckLoading } =
		useRoleAttendeesQuery(String(eid), slugWatcher);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createRoleMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role Name *</Label>
						<Input placeholder="Role name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
					<div>
						<Label htmlFor="slug">Role Slug *</Label>
						<Input placeholder="role-slug" {...register('slug', { required: true })} />
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{roleSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>
				<div>
					<Label htmlFor="defaultRole">Default Role</Label>
					<Input
						type="checkbox"
						placeholder="event-slug"
						{...register('defaultRole', { required: true })}
					/>
					{errors.defaultRole?.message && (
						<ErrorMessage>{errors.defaultRole?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={isRoleSlugCheckLoading || Boolean(roleSlugCheck)}
				>
					Create Role
				</Button>
			</div>
		</form>
	);
};
