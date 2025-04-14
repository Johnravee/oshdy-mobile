import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key: string, value: string) => {

    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log("Error saving data on Async Storage", error);
    }
};

export const getItem = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error) {
        console.log("Error retrieving data from Async Storage", error);
    }
}