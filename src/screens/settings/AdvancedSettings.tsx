import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { HStack, Stack, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomCheckbox, Layout } from 'components';
import { useTranslations } from 'hooks';
import { pt } from 'theme';

type AdvancedSettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AdvancedSettings'
>;

type AppLockRowProps = {
  label: string;
  value?: string;
  defaultChecked?: boolean;
  onPress?: () => void;
};

const AppLockRow: FC<AppLockRowProps> = ({
  label,
  defaultChecked,
  onPress
}) => {
  return (
    <HStack alignItems="center" justifyContent="space-between" w="full" my="5">
      <CustomCheckbox
        defaultIsChecked={defaultChecked as boolean}
        style={styles.checkboxContainer}
        onChange={checked => checked && onPress?.()}
      >
        <Text fontSize={pt(32)} px="2">
          {label}
        </Text>
      </CustomCheckbox>
      {/* <HStack alignItems="center" justifyContent="space-between"> */}
      {/* <Text
          fontSize={16}
          px="6"
          textAlign="right"
          textTransform="capitalize"
          color="#888888"
        >
          {value}
        </Text> */}
      {/* <Stack my={2}> */}
      {/* <CustomCheckbox defaultIsChecked={defaultChecked as boolean} /> */}
      {/* </Stack> */}
      {/* </HStack> */}
    </HStack>
  );
};

const AdvancedSettings = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<AdvancedSettingsScreenNavigationProp>();
  const { strings } = useTranslations();
  return (
    <Layout flex="1" justifyContent="flex-start" alignItems="flex-start">
      <Stack my="2" w="full">
        <AppLockRow
          label={strings.recover_seed_private_key}
          onPress={() =>
            navigation.navigate('RecoveryPhraseWords', { phraseType: '12' })
          }
        />
        <AppLockRow label={strings.show_hex_data} defaultChecked />
        <AppLockRow label={strings.remove_data_logout} />
        <AppLockRow label={strings.appearance} value={colorScheme as string} />
      </Stack>
    </Layout>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flex: 1,
    justifyContent: 'space-between'
  }
});

AppLockRow.defaultProps = {
  defaultChecked: false
};

export default AdvancedSettings;
