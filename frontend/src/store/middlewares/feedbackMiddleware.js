import { createStandaloneToast } from '@chakra-ui/react';

const toast = createStandaloneToast();

export default function feedbackMiddleware(store) {
  return (next) => (action) => {
    if (!action.payload) {
      return next(action);
    }

    if (
      action.payload.response &&
      action.payload.response.data &&
      action.payload.response.data.alert
    ) {
      const { alert } = action.payload.response.data;

      toast({
        description: alert.message,
        status: alert.type,
        isClosable: true,
        position: 'top',
        variant: 'left-accent'
      });
    }

    return next(action);
  };
}
