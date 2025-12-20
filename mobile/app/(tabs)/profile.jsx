import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../stores/useAuthStore'

export default function ProfileScreen() {
    const { user } = useAuthStore()
    return (
        <View>
            <Text>ProfileScreen</Text>
            <Text>{user?.name}</Text>
            <Text>{user?.email}</Text>
        </View>
    )
}