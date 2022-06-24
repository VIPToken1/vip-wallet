import React, { FC, useState } from 'react';
import { FlatList, Pressable, Spinner, Text, View } from 'native-base';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { useTranslations } from 'hooks';
import { pt, screenHeight, screenWidth } from 'theme';
import { Colors } from 'theme/colors';

type Props = {
  phrase: string;
  is24Words?: boolean;
  showFooter?: boolean;
  onCopyPhrase?: () => void;
  onRefresh?: () => void;
};

const Phrase: FC<Props> = ({ phrase, showFooter }) => {
  const { strings } = useTranslations();
  const [, setClipboard] = useClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const onCopyPhrase = () => {
    setClipboard(phrase);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 5000);
  };

  const renderEmptyPhrase = () => {
    return (
      <View
        alignSelf="center"
        w={screenWidth * 0.9}
        flex={1}
        justifyContent="center"
        alignItems="center"
        height={screenHeight * 0.25}
      >
        <Spinner color={Colors.PRIMARY} />
        {/* <TouchableOpacity onPress={onRefresh} activeOpacity={0.5}>
          <Image
            source={Icons.refreshIcon}
            size={25}
            tintColor="white"
            alt="refresh"
          />
        </TouchableOpacity> */}
      </View>
    );
  };

  const cleanedPhrase = phrase.trim().length ? phrase.trim().split(' ') : [];

  return (
    <FlatList
      data={cleanedPhrase}
      scrollEnabled={false}
      renderItem={({ item: word, index }) => {
        return (
          <View
            key={index}
            flexDirection="row"
            alignItems="center"
            width={screenWidth * 0.3}
            mx="2px"
            my={3}
          >
            <Text
              color={Colors.GRAY}
              adjustsFontSizeToFit
              w="25px"
              fontSize="16px"
              fontWeight="medium"
              textAlign="center"
            >
              {index + 1}.{' '}
            </Text>
            <Text
              width="100%"
              fontSize={pt(26)}
              fontWeight="medium"
              textAlign="left"
              px="2"
              numberOfLines={2}
              adjustsFontSizeToFit
              lineBreakMode="clip"
              textBreakStrategy="highQuality"
            >
              {word}
            </Text>
          </View>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
      numColumns={3}
      // ListEmptyComponent={renderEmptyPhrase}
      ListFooterComponent={() => {
        if (showFooter && cleanedPhrase.length) {
          return (
            <Pressable mt="6" hitSlop={{ top: 10, bottom: 10 }}>
              <Text
                textAlign="center"
                fontSize={pt(26)}
                color={isCopied ? 'green.400' : Colors.ORANGE}
                onPress={!isCopied ? onCopyPhrase : undefined}
              >
                {isCopied
                  ? strings.copy_to_clipboard_success
                  : strings.copy_to_clipboard}
              </Text>
            </Pressable>
          );
        } else {
          return null;
        }
      }}
    />
  );
};

export default Phrase;
