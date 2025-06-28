import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { height } = Dimensions.get('window');

export type CustomBottomSheetRef = {
  expand: () => void;
  close: () => void;
};

type CustomBottomSheetProps = {
  snapPoint?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

const CustomBottomSheet = forwardRef<CustomBottomSheetRef, CustomBottomSheetProps>(
  ({ snapPoint = '30%', children, onClose }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const translateY = useRef(new Animated.Value(height)).current;
    const snapPointPixels = (parseInt(snapPoint) / 100) * height;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return gestureState.dy > 0;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > snapPointPixels / 3) {
            // User dragged down far enough to close
            handleClose();
          } else {
            // Return to open position
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    useImperativeHandle(ref, () => ({
      expand: () => {
        setIsVisible(true);
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
      close: handleClose,
    }));

    const handleClose = () => {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        if (onClose) onClose();
      });
    };

    return (
      <Modal
        transparent
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
        hardwareAccelerated
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%' }}
              keyboardVerticalOffset={0}
            >
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.container,
                    {
                      height: snapPointPixels,
                      transform: [{ translateY }],
                    },
                  ]}
                >
                  <View {...panResponder.panHandlers} style={styles.dragHandle}>
                    <View style={styles.dragIndicator} />
                  </View>
                  <View style={styles.content}>{children}</View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  dragHandle: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#999',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default CustomBottomSheet;
