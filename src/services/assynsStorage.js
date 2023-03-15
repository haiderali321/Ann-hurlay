import { AsyncStorage } from 'react-native';

export const _storeData = async (key, data) => {
    try {
        await AsyncStorage.setItem(
            key,
            data,
        );
    } catch (error) {
        console.log(error, 'Error saving data')
        // Error saving data
    }
};

export const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // We have data!!
            return value
        }
    } catch (error) {
        // Error retrieving data
        console.log(error, 'Error retrieving data')
    }
};