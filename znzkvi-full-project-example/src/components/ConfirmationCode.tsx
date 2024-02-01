import Colors from '@constants/Colors'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/Text'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell
} from 'react-native-confirmation-code-field'

const CELL_COUNT = 6

interface Props {
    value: string
    setValue: (value: string) => void
}
const ConfirmationCode = ({ value, setValue }: Props) => {
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue
    })

    return (
        <View style={localStyles.container}>
            <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't ConfirmationCodeear
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <Text
                        key={index}
                        style={[localStyles.cell]}
                        //@ts-expect-error
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : <Text>_</Text>)}
                    </Text>
                )}
            />
        </View>
    )
}

const localStyles = StyleSheet.create({
    hasIconWidth: {
        flex: 1
    },
    container: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.black,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: Colors.dirtyWhite,
        paddingHorizontal: 10
    },
    title: { textAlign: 'center', fontSize: 30 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: Colors.dirtyWhite,
        textAlign: 'center'
    }
    //     focusCell: {
    //         borderColor: '#000'
    //     }
})

export default ConfirmationCode
