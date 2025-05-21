import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Separator from './separator';

interface CustomAlertProps {
  visible: boolean;
  message: string;
  title : string;
  onOk: () => void;
  onClose: () => void;
  onCancel: () => void;
}

const CustomAlert = ({ visible, title ,message, onClose, onCancel, onOk }: CustomAlertProps) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-4/5 p-6 bg-white rounded-lg shadow-lg">

        <View className='mb-4'>
            <Text className="text-xl font-bold text-dark">{title}</Text>
         </View>
         <Separator />
         

          <View className='mb-4 '>
            <Text className="text-base text-dark">{message}</Text>
          </View>

          <Separator />

          <View className="flex-row justify-end gap-2">
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={onCancel}
              className="px-6 py-3 bg-gray-200 rounded-md"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            {/* OK Button */}
            <TouchableOpacity
              onPress={onOk}
              className="px-6 py-3 bg-blue-600 rounded-md"
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
