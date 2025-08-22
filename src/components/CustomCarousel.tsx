import type React from 'react';
import { useRef, useCallback } from 'react';
import { View, Dimensions, Image, StyleSheet, type FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../context/themeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;
const IMAGE_SPACING = 20;

type ImageItem = {
  uri: string;
};

type CarouselProps = {
  images: ImageItem[];
  imageHeight: number;
};

type CarouselItemProps = {
  uri: string;
  index: number;
  imageHeight: number;
  scrollX: SharedValue<number>;
};

const CarouselItem: React.FC<CarouselItemProps> = ({ uri, index, imageHeight, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * IMAGE_WIDTH,
      (index - 1) * IMAGE_WIDTH,
      index * IMAGE_WIDTH,
      (index + 1) * IMAGE_WIDTH,
      (index + 2) * IMAGE_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 0.85, 1, 0.85, 0.7],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scaleY: scale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.imageContainer,
        { height: imageHeight, width: IMAGE_WIDTH - IMAGE_SPACING },
        animatedStyle,
      ]}
    >
      <Image source={{ uri }} style={styles.image} />
    </Animated.View>
  );
};

const CustomCarousel: React.FC<CarouselProps> = ({ images, imageHeight }) => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useSharedValue(0);

  const updateCurrentIndex = useCallback(
    (index: number) => {
      currentIndex.value = index;
    },
    [currentIndex],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;

      // Calculate current index more precisely
      const index = Math.round(event.contentOffset.x / IMAGE_WIDTH);
      const clampedIndex = Math.max(0, Math.min(index, images.length - 1));

      if (clampedIndex !== currentIndex.value) {
        currentIndex.value = clampedIndex;
        runOnJS(updateCurrentIndex)(clampedIndex);
      }
    },
  });

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: IMAGE_WIDTH,
      offset: IMAGE_WIDTH * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ImageItem; index: number }) => (
      <CarouselItem uri={item.uri} index={index} imageHeight={imageHeight} scrollX={scrollX} />
    ),
    [imageHeight, scrollX],
  );

  const keyExtractor = useCallback((_: ImageItem, index: number) => index.toString(), []);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        disableScrollViewPanResponder={true}
        data={images}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        snapToInterval={IMAGE_WIDTH}
        snapToAlignment='center'
        decelerationRate='fast'
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews={true}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        snapToOffsets={images.map((_, index) => index * IMAGE_WIDTH)}
      />

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <Dot key={index} index={index} scrollX={scrollX} itemWidth={IMAGE_WIDTH} />
        ))}
      </View>
    </View>
  );
};

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
};

const Dot: React.FC<DotProps> = ({ index, scrollX, itemWidth }) => {
  const { colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth];

    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP);

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: colors.primary,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    alignItems: 'center',
    paddingLeft: (SCREEN_WIDTH - IMAGE_WIDTH) / 2,
    paddingRight: (SCREEN_WIDTH - IMAGE_WIDTH) / 2,
  },
  imageContainer: {
    marginHorizontal: IMAGE_SPACING / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginHorizontal: 6,
  },
});

export default CustomCarousel;
