import Icons from '@assets/svgs/icons'
import { Background } from '@components/Container'
import Colors from '@constants/Colors'
import { scaleByHeight } from '@constants/Scaling'
import { ReactNode } from 'react'

const selectCategoryData = (
    categoryID: number
): {
    background: Background
    strongerBackground: (typeof Colors)[keyof typeof Colors]
    headerBackgroundColor: (typeof Colors)[keyof typeof Colors]
    title: string
    headerIcon: ReactNode
} | null => {
    switch (categoryID) {
        case 2:
            return {
                background: 'GreenBg',
                strongerBackground: Colors.green,
                headerBackgroundColor: Colors.lightGreen,
                title: 'zemljo tisućljetna',
                headerIcon: (
                    <Icons.Stecak
                        height={scaleByHeight(64)}
                        width={scaleByHeight(64)}
                    />
                )
            }
        case 3:
            return {
                background: 'YellowBg',
                strongerBackground: Colors.strongerYellow,
                headerBackgroundColor: Colors.yellow,
                title: 'umjetnost i kulturica',
                headerIcon: (
                    <Icons.Umjetnost
                        height={scaleByHeight(64)}
                        width={scaleByHeight(64)}
                    />
                )
            }
        case 4:
            return {
                background: 'GrayBg',
                strongerBackground: Colors.gray,
                headerBackgroundColor: Colors.gray,
                title: 'novija politička historija bih',
                headerIcon: (
                    <Icons.Politicar
                        height={scaleByHeight(64)}
                        width={scaleByHeight(64)}
                    />
                )
            }
        case 5:
            return {
                background: 'OrangeBg',
                strongerBackground: Colors.strongerOrange,
                headerBackgroundColor: Colors.orange,
                title: 'lagano sportski',
                headerIcon: (
                    <Icons.Sport
                        height={scaleByHeight(64)}
                        width={scaleByHeight(64)}
                    />
                )
            }

        case 6:
            return {
                background: 'RedBg',
                strongerBackground: Colors.strongerRed,
                headerBackgroundColor: Colors.red,
                title: 'uspješne žene',
                headerIcon: (
                    <Icons.UspjesneZene
                        height={scaleByHeight(64)}
                        width={scaleByHeight(64)}
                    />
                )
            }
        case 7:
            return {
                background: 'BrownBg',
                strongerBackground: Colors.strongerBrown,
                headerBackgroundColor: Colors.brown,
                title: 'pitanje za nobela',
                headerIcon: (
                    <Icons.Nobel
                        height={scaleByHeight(64)}
                        width={scaleByHeight(64)}
                    />
                )
            }
    }
    return null
}

export default selectCategoryData
