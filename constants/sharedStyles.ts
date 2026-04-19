import { StyleSheet } from 'react-native';

export const disabledStyles = StyleSheet.create({
  imageDisabled: {
    opacity: 0.5,
  },
  greyscaleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(180,0,0,0.3)',
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
