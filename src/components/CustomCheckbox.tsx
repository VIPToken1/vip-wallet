import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Icons } from 'theme';

const checkboxIcons = {
  radio: [Icons.radioCheckedIcon, Icons.radioUncheckedIcon],
  checkbox: [Icons.checkboxCheckedIcon, Icons.checkboxUncheckedIcon]
};

export type CustomCheckboxProps = {
  isChecked?: boolean;
  defaultIsChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  type?: 'checkbox' | 'radio';
  position?: 'left' | 'right';
  style?: ViewStyle;
};

const CustomCheckbox: FC<CustomCheckboxProps> = ({
  children,
  isChecked,
  defaultIsChecked,
  onChange,
  style,
  position = 'right',
  type = 'checkbox'
}) => {
  const [checked, setChecked] = useState<boolean>(
    !!(isChecked || defaultIsChecked)
  );

  useEffect(() => {
    setChecked(!!isChecked);
  }, [isChecked]);

  const handleCheckbox = () => {
    setChecked(prev => !prev);
    onChange?.(!isChecked);
  };

  const [checkedIcon, unCheckedIcon] = checkboxIcons[type];

  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, style]}
      activeOpacity={0.5}
      onPress={handleCheckbox}
    >
      {position === 'left' && (
        <Image source={checked ? checkedIcon : unCheckedIcon} />
      )}
      {children}
      {position === 'right' && (
        <Image source={checked ? checkedIcon : unCheckedIcon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

CustomCheckbox.defaultProps = {
  type: 'checkbox',
  position: 'right',
  onChange: () => null
};

export default CustomCheckbox;
