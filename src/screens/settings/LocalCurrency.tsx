import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HStack, Image, Pressable, SectionList, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector, useLoader } from 'hooks';
import { Icons, pt } from 'theme';
import { Colors } from 'theme/colors';
import { actions } from 'store';

const popularCurrencyCodes = ['AUD', 'GBP', 'CAD', 'EUR', 'USD'];

const LocalCurrency: FC = () => {
  const navigation = useNavigation();
  const listRef = useRef();
  const { setLoader } = useLoader();
  const dispatch = useAppDispatch();
  const { currencyList = [], defaultCurrency } = useAppSelector<any>(
    state => state.user
  );
  const [list, setList] = useState([{ title: 'Others', data: currencyList }]);

  const getCurrencies = async () => {
    try {
      setLoader(true);
      await dispatch(actions.listCurrenciesAction());
      setLoader(false);
    } catch (error) {
      setLoader(false);
      // setErrorMessage(error);
    }
  };

  useLayoutEffect(() => {
    if (Array.isArray(currencyList) && !currencyList?.length) {
      getCurrencies();
    } else {
      const selectedIndex = currencyList?.findIndex(
        (item: any) => item.currencyCode === defaultCurrency?.currencyCode
      );
      if (selectedIndex > -1) {
        const newList = [...currencyList];
        // const selected = newList.splice(selectedIndex, 1);
        // newList.unshift(...selected);
        // setList(newList);

        // const newSecList = { ...secList };
        const groupedCurrencies = newList.reduce(
          (acc, item, index) => {
            const isPopular = popularCurrencyCodes.includes(item.currencyCode);
            const isSelected = index === selectedIndex;
            if (isSelected) {
              acc[0].data.push(item);
            } else if (isPopular) {
              acc[1].data.push(item);
            } else {
              acc[2].data.push(item);
            }
            return acc;
          },
          [
            { title: 'Active', data: [] },
            { title: 'Popular', data: [] },
            { title: 'Other', data: [] }
          ]
        );
        setList(groupedCurrencies);
      } else {
        setList([{ title: 'Others', data: currencyList }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyList, defaultCurrency]);

  const onChangeCurrency = (currency: any) => {
    dispatch(actions.setDefaultCurrency(currency));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={list}
        renderSectionHeader={({ section: { title } }) => (
          <HStack alignItems={'center'} py={5} bg={Colors.BG}>
            <Text color={Colors.PRIMARY} fontSize={'22px'} fontWeight="600">
              {title}
            </Text>
          </HStack>
        )}
        renderItem={({ item: currency }) => (
          <Pressable
            key={currency.id}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            w="full"
            my="5"
            hitSlop={{ top: 7.5, bottom: 7.5, right: 5, left: 5 }}
            _pressed={{ opacity: 0.5 }}
            onPress={() => onChangeCurrency(currency)}
          >
            <Text fontSize={18} adjustsFontSizeToFit>
              {`${currency.currencyName}(${currency.currencyCode})`}
            </Text>
            {currency.currencyCode === defaultCurrency?.currencyCode && (
              <Image source={Icons.checkMarkIcon} alt="rightChevron" />
            )}
          </Pressable>
        )}
        keyExtractor={(item: any) => item.id}
        extraData={list}
        my="1"
        w="full"
        showsVerticalScrollIndicator={false}
        px="2"
        ref={listRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // paddingTop: pt(10),
    paddingHorizontal: pt(25)
  }
});

export default LocalCurrency;
