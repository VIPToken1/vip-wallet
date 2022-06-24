import React, { FC, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Box, HStack, Text, VStack } from 'native-base';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Humanize from 'humanize-plus';

const { height } = Dimensions.get('window');

type ItemRowProps = {
  label: string;
  value: string;
};

const ItemRow: FC<ItemRowProps> = ({ label, value }) => {
  return (
    <HStack justifyContent="space-between" alignItems="center">
      <Text
        color="#656880"
        fontSize="xs"
        numberOfLines={1}
        ellipsizeMode="middle"
        adjustsFontSizeToFit
      >
        {label}
      </Text>
      <Text
        color="#FFFFFF"
        fontSize="xs"
        fontWeight="400"
        ellipsizeMode="middle"
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </HStack>
  );
};

const CoinDetails: FC<{ coinDetails: any }> = ({ coinDetails }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => {
    if (height > 700) {
      return [height / 6.5, height / 3.5];
    } else {
      return [height / 7.5, height / 2];
    }
  }, []);

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop {...props} pressBehavior={0} />,
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      detached
      snapPoints={snapPoints}
      backgroundStyle={styles.backgroundStyle}
      handleStyle={styles.handleStyle}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      backdropComponent={renderBackdrop}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']} mode="padding">
        <Box flex="1" bg="#090C1D" px="4" py="1">
          {/* <Box>
            <Text my="2" fontSize="lg" fontWeight="medium">
              Price (24h)
            </Text>
            <HStack alignItems="center" justifyContent="center">
              <VStack w="45%" m="4">
                <ItemRow label="Open" value="$2,282.22" />
                <ItemRow label="High" value="$2,341.78" />
                <ItemRow label="Average" value="$2,297.70" />
              </VStack>
              <VStack w="45%" m="4">
                <ItemRow label="Close" value="$2,292.19" />
                <ItemRow label="Low" value="$2,258.06" />
                <ItemRow label="Change" value="$82109" />
              </VStack>
            </HStack>
          </Box> */}
          <Box my="1">
            <Text my="2" fontSize="lg" fontWeight="medium">
              Market Stats
            </Text>
            <HStack justifyContent="center">
              <VStack w="47%" m="2">
                <ItemRow
                  label="Market Cap"
                  value={
                    coinDetails?.market_cap
                      ? `$${Humanize.compactInteger(
                          coinDetails?.market_cap || 0,
                          1
                        )}`
                      : 'N/A'
                  }
                />
                <ItemRow
                  label="Circulating"
                  value={
                    coinDetails?.circulating_supply
                      ? `${Humanize.compactInteger(
                          coinDetails?.circulating_supply,
                          1
                        )}`
                      : 'N/A'
                  }
                />
                <ItemRow
                  label="Tot Supply"
                  value={
                    coinDetails?.total_supply
                      ? `${Humanize.compactInteger(coinDetails?.total_supply)}`
                      : 'N/A'
                  }
                />
              </VStack>
              <VStack w="47%" m="2">
                <ItemRow
                  label="24h Volume"
                  value={
                    coinDetails?.total_volume
                      ? `${Humanize.compactInteger(coinDetails?.total_volume)}`
                      : 'N/A'
                  }
                />
                <ItemRow
                  label="Max Supply"
                  value={
                    coinDetails?.max_supply
                      ? `${Humanize.compactInteger(coinDetails?.max_supply)}`
                      : 'N/A'
                  }
                />
                <ItemRow
                  label="Rank"
                  value={coinDetails?.market_cap_rank || 'N/A'}
                />
                {/* <ItemRow label="ROI" value={coinDetails?.market_cap_rank || 'N/A'} /> */}
              </VStack>
            </HStack>
          </Box>
        </Box>
      </SafeAreaView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090C1D'
  },
  backgroundStyle: {
    backgroundColor: '#000'
  },
  handleStyle: {
    backgroundColor: '#090C1D',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40
  },
  handleIndicatorStyle: {
    backgroundColor: '#656880'
  }
});

export default CoinDetails;
