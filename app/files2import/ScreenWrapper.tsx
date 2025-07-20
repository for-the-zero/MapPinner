// Copied from react-native-paper
// https://github.com/callstack/react-native-paper/blob/main/example/src/ScreenWrapper.tsx
import * as React from 'react';
import {
    ScrollView,
    ScrollViewProps,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Props = ScrollViewProps & {
    children: React.ReactNode;
    withScrollView?: boolean;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
export default function ScreenWrapper({
    children,
    withScrollView = true,
    style,
    contentContainerStyle,
    ...rest
}: Props) {
    const theme = useTheme<MD3Theme>();
    const insets = useSafeAreaInsets();
    const containerStyle = [
        styles.container,
        {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.left,
        },
    ];
    return (
        <>
            {withScrollView ? (
                <ScrollView
                    {...rest}
                    contentContainerStyle={contentContainerStyle}
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    style={[containerStyle, style]}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={[containerStyle, style]}>{children}</View>
            )}
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});