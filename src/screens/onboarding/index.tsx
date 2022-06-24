import React, { FC } from 'react';
import {
  BackHandler,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, Image, Pressable } from 'native-base';
import { GradientButton, GradientText } from 'components';
import { useTranslations } from 'hooks';
import { pixW, pt, screenWidth, screenHeight } from 'theme';
import { Colors } from 'theme/colors';

const getContent = (strings: Record<string, string>) => [
  {
    title: strings.onboarding_1_title,
    description: strings.onboarding_1_description,
    desc_1: 'Live the Dream',
    image: require('../../assets/images/onboarding/onboarding_1.png'),
    size: 180
  },
  {
    title: strings.onboarding_2_title,
    description: strings.onboarding_2_description,
    desc_1: '',
    image: require('../../assets/images/onboarding/onboarding_2.png'),
    size: 300
  },
  {
    title: strings.onboarding_3_title,
    description: strings.onboarding_3_description,
    desc_1: '',
    image: require('../../assets/images/onboarding/onboarding_3.png'),
    size: 300
  },
  {
    title: strings.onboarding_4_title,
    description: strings.onboarding_4_description,
    desc_1: '',
    image: require('../../assets/images/onboarding/onboarding_4.png'),
    size: 300
  }
];

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

type Item = {
  title: string;
  description: string;
  desc_1: string;
  image: ImageSourcePropType;
  size: number;
};

type CarouselItemProps = {
  item: Item;
  index: number;
};

const CarouselItem: FC<CarouselItemProps> = ({ item, index }) => {
  return (
    <View alignItems="center" width={screenWidth}>
      <View
        height={screenHeight * 0.36}
        alignItems="center"
        justifyContent="center"
      >
        <Image
          source={item.image}
          my="40px"
          w={screenHeight * 0.25}
          h={screenHeight * 0.25}
          alt={`${index}onboarding-image`}
        />
      </View>
      <GradientText
        fontSize={pt(38)}
        fontWeight="bold"
        textAlign="center"
        py="4px"
        lineHeight={'34px'}
        mx={16}
      >
        {item.title.toUpperCase()}
      </GradientText>
      {item.desc_1 ? (
        <Text
          fontSize={pt(24)}
          textAlign="center"
          pt="2"
          // lineHeight={'34px'}
          mx={16}
          fontWeight={'700'}
          letterSpacing={0.8}
        >
          {item.desc_1.toUpperCase()}
        </Text>
      ) : null}
      <Text
        fontSize={pt(26)}
        color={Colors.PLACEHOLDER}
        textAlign="center"
        mx="15px"
        mt="14px"
      >
        {item.description}
      </Text>
    </View>
  );
};

const Onboarding: FC = () => {
  const { strings } = useTranslations();
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [backClickCount, setBackClickCount] = React.useState(0);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const isFocused = useIsFocused();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => {
      // @ts-ignore
      clearTimeout(timeoutRef.current);
      backHandler.remove();
    };
  });

  const handleBackPress = () => {
    if (isFocused) {
      timeoutRef.current = setTimeout(() => setBackClickCount(0), 2000);
      if (backClickCount === 0) {
        setBackClickCount(backClickCount + 1);
        ToastAndroid.show(strings.exit_app, ToastAndroid.SHORT);
      } else if (backClickCount === 1) {
        BackHandler.exitApp();
      }
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <View flex={2}>
        <CarouselItem
          item={{
            title: strings.welcome_to_vip_token,
            description: strings.onboarding_1_description,
            desc_1: strings.onboarding_description,
            image: require('../../assets/images/VIP_Token_logo_transparent.png'),
            size: 180
          }}
          index={0}
        />
        {/* <ScrollView
          style={{ width: screenWidth }}
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          {content.map((item, index) => (
            <CarouselItem
              key={`onboarding-image-${index}`}
              item={item}
              index={index}
            />
          ))}
        </ScrollView>
        <HStack alignSelf="center" mt="2" mb="8">
          {content.map((_, index) => (
            <TouchableOpacity
              key={`onboarding-indicator-${index}`}
              activeOpacity={0.5}
              style={
                index === activeSlide
                  ? styles.dotStyle
                  : styles.inactiveDotStyle
              }
              onPress={() => onIndicatorPress(index)}
            />
          ))}
        </HStack> */}
      </View>
      <View flex={0.5} mb="2">
        <GradientButton
          title={strings.create_new_account}
          onPress={() => navigation.navigate('Legal', { from: 'Register' })}
        />
        <Pressable
          mt="4"
          onPress={() => navigation.navigate('Legal', { from: 'SignIn' })}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Text
            py="1"
            fontSize={18}
            textDecorationLine="underline"
            textAlign="center"
          >
            {strings.already_have_wallet}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5%',
    marginBottom: Platform.OS === 'ios' ? 10 : 20
  },
  imageSlider: {
    height: 400,
    padding: pixW(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: Colors.PRIMARY
  },
  inactiveDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: Colors.PLACEHOLDER
  }
});

export default Onboarding;
