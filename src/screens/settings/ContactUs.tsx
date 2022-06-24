import React from 'react';
import { Box, Input, Text, TextArea, useToast, View } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { CustomToast, GradientButton, Layout } from 'components';
import { contactUsApi } from 'config/api';
import { Colors } from 'theme/colors';
import { pt } from 'theme';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const ContactUs = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const emailRef = React.useRef<any>();
  const messageRef = React.useRef<any>();

  const toast = useToast();
  const navigation = useNavigation();

  const isInvalidForm = !name || !email || !message || !EMAIL_REGEX.test(email);

  const onSubmit = async () => {
    try {
      if (isInvalidForm) {
        return;
      }
      const response = await contactUsApi(name, email, message);
      if (response.data) {
        toast.show({
          render: ({ id }) => (
            <CustomToast
              id={id}
              variant="left-accent"
              status="success"
              message="Contact Us request sent successfully."
            />
          )
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error sending contact us request: ', error);
      toast.show({
        render: ({ id }) => (
          <CustomToast
            id={id}
            variant="left-accent"
            status="error"
            message="Unable to send your request. Please try again later."
          />
        )
      });
    }
  };

  return (
    <Layout flex={1}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Box w="full" flex={1}>
          <Text
            textAlign="center"
            fontWeight="medium"
            color={Colors.WHITE}
            my="6"
            fontSize={pt(22)}
          >
            Please fill out the contact form below with any questions you may
            have. We will usually respond within 24 hours{' '}
          </Text>
          <View mb="2">
            <Text color={Colors.PLACEHOLDER} fontSize="16px" mx="1">
              Name
            </Text>
            <View borderRadius={10} bg={Colors.BG_LIGHT} my="2">
              <Input
                fontSize="16px"
                borderWidth={0}
                px="4"
                py="14px"
                color={Colors.WHITE}
                selectionColor={Colors.WHITE}
                keyboardAppearance="dark"
                returnKeyType="next"
                maxLength={30}
                value={name}
                onChangeText={setName}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
          </View>
          <View mb="2">
            <Text color={Colors.PLACEHOLDER} fontSize="16px" mx="1">
              Email
            </Text>
            <View borderRadius={10} bg={Colors.BG_LIGHT} my="2">
              <Input
                fontSize="16px"
                borderWidth={0}
                px="4"
                py="14px"
                color={Colors.WHITE}
                selectionColor={Colors.WHITE}
                keyboardAppearance="dark"
                keyboardType="email-address"
                returnKeyLabel="next"
                autoCapitalize="none"
                maxLength={50}
                ref={emailRef}
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={() => messageRef.current?.focus()}
              />
            </View>
          </View>
          <View mb="2">
            <Text color={Colors.PLACEHOLDER} fontSize="16px" mx="1">
              Message
            </Text>
            <View borderRadius={10} bg={Colors.BG_LIGHT} my="2">
              <TextArea
                fontSize="16px"
                borderWidth={0}
                px="4"
                py="14px"
                h="160px"
                multiline
                numberOfLines={4}
                color={Colors.WHITE}
                selectionColor={Colors.WHITE}
                keyboardAppearance="dark"
                maxLength={500}
                value={message}
                onChangeText={setMessage}
                ref={messageRef}
              />
            </View>
          </View>

          <GradientButton
            title="Submit"
            disabled={isInvalidForm}
            onPress={onSubmit}
          />
        </Box>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default ContactUs;
