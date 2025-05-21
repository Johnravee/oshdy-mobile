import { StyleSheet, View, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-native-signature-canvas';

export default function SignatureBoard() {
    const [signature, setSignature] = useState(null);
    const ref = useRef();
  
    const handleSignature = (signature : any) => {
      setSignature(signature);
    };
  
    const handleEmpty = () => {
      console.log('Empty');
    };
  
    const handleClear = () => {
      console.log('Clear success!');
    };
  
  
    return (
      <View >
       
        <View className='w-full h-full'>
        <SignatureCanvas
          onOK={handleSignature}
          onEmpty={handleEmpty}
          onClear={handleClear}
          autoClear={true}
          descriptionText="Sign here"
          clearText="Clear"
          confirmText="Save"
        />
        </View>
      </View>
  );
}