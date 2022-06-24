import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, IInputProps, Image } from 'native-base';
import { CustomInput } from 'components';
import { Icons } from 'theme';
import { Colors } from 'theme/colors';

type ClearIconProps = {
  keyword?: string;
  onPress?: () => void;
};

interface SearchInputProps extends IInputProps {
  bgColor?: string;
  onClearSearch?: () => void;
}

const ClearIcon: FC<ClearIconProps> = ({ keyword, onPress }) => {
  if (!keyword) {
    return null;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={Icons.clearIcon} mx="2" alt="search" />
    </TouchableOpacity>
  );
};

const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  onClearSearch,
  ...props
}) => {
  return (
    <Box my="4" w="full">
      <CustomInput
        placeholder={placeholder}
        bgColor="#0F1225"
        InputLeftElement={
          <Image
            source={Icons.searchIcon}
            tintColor={Colors.PLACEHOLDER}
            mx="2"
            alt="search"
          />
        }
        InputRightElement={
          <ClearIcon keyword={props.value} onPress={onClearSearch} />
        }
        {...props}
      />
    </Box>
  );
};

export default SearchInput;
