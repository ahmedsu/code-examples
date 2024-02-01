import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'components'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Divider } from 'react-native-elements'
import MyDivider from './Divider'

import Avatar from './Avatar'
import colors from 'colors'
import Fonts from 'constants/Fonts'

const ProjectCard = ({ style, name, date, image, onPress, index }: any) => {
    let cardColors
    if (index % 2 === 0) {
        cardColors = ['#FBBA00', '#F39200']
    } else {
        cardColors = ['#45AEFF', '#008AB1']
    }
    return (
        <LinearGradient
            colors={[cardColors[0], cardColors[1]]}
            style={[styles.container, { ...style }]}
            useAngle={true}
            angle={60}
            angleCenter={{ x: 0.5, y: 0.5 }}>
            <View style={styles.info}>
                <Avatar name={name} />
                <MyDivider horizontal />
                <View style={{ width: '75%' }}>
                    <Text
                        style={{ color: 'white', fontSize: 18 }}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: 16,
                            fontFamily: Fonts.PoppinsRegular
                        }}>
                        {date}
                    </Text>
                </View>
            </View>
            <Divider color="white" style={{ marginTop: 10 }} />
            <MyDivider size={20} />
            <TouchableOpacity onPress={onPress} style={styles.viewTemplates}>
                <Text style={styles.templatesText}>VIEW TEMPLATES</Text>
                <FeatherIcon name="arrow-right" size={20} color={'white'} />
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        //  marginRight: 20,
        borderRadius: 20,
        width: 310,
        padding: 20,
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 12
    },
    viewTemplates: {
        flexDirection: 'row',
        alignItems: 'center'
        // height: 50
    },
    templatesText: {
        color: colors.WHITE,
        //  marginTop: 15,
        marginRight: 10,
        fontSize: 16,
        fontFamily: Fonts.PoppinsSemiBold
    }
})

export default ProjectCard
