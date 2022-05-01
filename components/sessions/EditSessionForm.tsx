import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { UseEditSessionMutationData } from '../../hooks/mutations/useEditSessionMutation';
import { ErrorMessage } from '../form/ErrorMessage';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../form/DatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { EditSessionPayload, EditSessionSchema } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { slugify } from '../../utils/slugify';
import Link from 'next/link';
import { Select } from '../form/Select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSessionQuery, UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { NotFound } from '../error/NotFound';
import { NEAREST_MINUTE } from '../../config';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { useRouter } from 'next/router';

type Props = {
	eid: string;
	sid: string;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenuesQueryData &
	UseEditSessionMutationData &
	UseSessionQueryData &
	UseEventQueryData;

export const EditSessionForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { eid, venues, editSessionMutation, session, event } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		control,
		formState: { errors }
	} = useForm<EditSessionPayload>({
		defaultValues: {
			name: String(session?.name),
			description: String(session?.description),
			venueId: session?.venueId,
			startDate: session?.startDate ? new Date(String(session?.startDate)) : new Date(),
			endDate: session?.endDate ? new Date(String(session?.endDate)) : new Date(),
			slug: session?.slug
		},
		resolver: zodResolver(EditSessionSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');
	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

	const { session: sessionSlugCheck, isSessionLoading: isSessionSlugCheckLoading } =
		useSessionQuery(String(eid), slugWatcher);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('endDate', startDateWatcher);
			toast.warn('The start date cannot be later than the end date.');
		}
	}, [startDateWatcher]);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('startDate', endDateWatcher);
			toast.warn('The end date cannot be earlier than the start date.');
		}
	}, [endDateWatcher]);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	if (venues && venues.length === 0) {
		return <NotFound message="No venues found" />;
	}

	if (!venues || !event) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editSessionMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Session name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="venueId">Venue *</Label>
						<Select
							defaultValue={venues && venues[0].id}
							{...register('venueId', { required: true })}
						>
							{venues.map((venue) => (
								<option key={venue.id} value={venue.id}>
									{venue.name}
								</option>
							))}
						</Select>

						<Link href={`/events/${eid}/admin/venues/edit`}>
							<a className="text-gray-600 text-sm mt-1">Dont see your venue? Edit a Venue</a>
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="startDate">Start Date *</Label>
						<div className="relative">
							<Controller
								control={control}
								name="startDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										startDate={field.value}
										endDate={endDateWatcher}
										selectsStart
										required
										timeIntervals={NEAREST_MINUTE}
										dateFormat="MM/dd/yyyy h:mm a"
										formatTime="MM/dd/yyyy h:mm a"
										showTimeSelect
										maxDate={new Date(String(event.endDate))}
										minDate={new Date(String(event.startDate))}
									/>
								)}
							/>
						</div>
						{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="endDate">End Date *</Label>
						<div className="relative">
							<Controller
								control={control}
								name="endDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										selectsEnd
										required
										startDate={startDateWatcher}
										endDate={field.value}
										timeIntervals={NEAREST_MINUTE}
										dateFormat="MM/dd/yyyy h:mm a"
										formatTime="MM/dd/yyyy h:mm a"
										showTimeSelect
										maxDate={new Date(String(event.endDate))}
										minDate={new Date(String(event.startDate))}
									/>
								)}
							/>
						</div>
						{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea rows={5} placeholder="Session description" {...register('description')} />
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">Slug *</Label>
						<div className="flex items-center">
							<span className="mr-1 text-md">/sessions/</span>
							<Input placeholder="session-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== session?.slug && sessionSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					className="ml-4"
					padding="medium"
					disabled={
						isSessionSlugCheckLoading || Boolean(slugWatcher !== session?.slug && sessionSlugCheck)
					}
				>
					Update Session
					<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
				</Button>
			</div>
		</form>
	);
};