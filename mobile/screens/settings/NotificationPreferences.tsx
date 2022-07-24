import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNotificationPreferences } from '@eventalapp/shared/hooks/queries/useNotificationPreferences';
import { useUser } from '@eventalapp/shared/hooks/queries/useUser';

export function NotificationPreferencesScreen() {
	const safeAreaInsets = useSafeAreaInsets();
	const {
		data: user,
		refetch: refetchUser,
		isRefetching: isUserRefetching,
		isLoading: isUserLoading
	} = useUser();
	const {
		data: preferences,
		refetch: refetchPreferences,
		isRefetching: isPreferencesRefetching,
		isLoading: isPreferencesLoading
	} = useNotificationPreferences();

	return (
		<ScrollView
			contentContainerStyle={{
				flexDirection: 'column',
				justifyContent: 'center',
				paddingTop: safeAreaInsets.top + 28,
				paddingLeft: safeAreaInsets.left + 28,
				paddingRight: safeAreaInsets.right + 28
			}}
			refreshControl={
				<RefreshControl
					colors={['#000000']}
					tintColor="#000000"
					refreshing={
						isUserRefetching || isPreferencesRefetching || isUserLoading || isPreferencesLoading
					}
					onRefresh={() => {
						refetchPreferences();
						refetchUser();
					}}
				/>
			}
		>
			<Text
				style={{
					fontSize: 36,
					fontWeight: 'bold',
					marginBottom: 18
				}}
			>
				Preferences
			</Text>

			<Text>{preferences && JSON.stringify(preferences)}</Text>
		</ScrollView>
	);
}
