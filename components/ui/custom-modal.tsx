import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  email?: string;
}

export default function CustomModal({ visible, onClose, children }: CustomModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      {children}
    </Modal>
  );
}
