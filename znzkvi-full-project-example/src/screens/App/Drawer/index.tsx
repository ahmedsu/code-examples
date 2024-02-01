import { StyleSheet } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import useDrawerStore from '../../../zustand/drawerManagement/store'
import { selectCurrentDrawerTab } from '@zustand/drawerManagement/selectors'
import MainPage from './MainPage'
import Modal from 'react-native-modal'
import DrawerInfoPage from './components/DrawerInfoPage'
import useGetPages from '@hooks/api/useGetPages'
import { DrawerTabType } from '@zustand/drawerManagement/types'
interface IChild {
    content: string
    type: DrawerTabType
}
const Child = ({ type, content }: IChild) => {
    const getTitleByType = useMemo(() => {
        switch (type) {
            case 'privacy':
                return 'Pravila privatnosti'
            case 'terms':
                return 'Uslovi korištenja'
            case 'rules':
                return 'Pravila kviza'
            case 'partners':
                return 'Partneri'
            case 'impressum':
                return 'Impressum'
        }
        return ''
    }, [type])

    const pageToShow = useMemo(() => {
        return <DrawerInfoPage title={getTitleByType} content={content} />
    }, [getTitleByType, content])

    return pageToShow
}
const Drawer = () => {
    const currentDrawerTab = useDrawerStore(selectCurrentDrawerTab)
    const { data } = useGetPages({ pageName: currentDrawerTab })
    const onModalCloseRef = useRef<(() => void) | null>(null)
    const postaviOnModalCloseRef = useCallback(
        (fn: () => void) => (onModalCloseRef.current = fn),
        []
    )
    return (
        <Modal
            isVisible={currentDrawerTab !== 'none'}
            style={localStyles.noMargin}
            statusBarTranslucent
            onModalHide={() => {
                onModalCloseRef.current?.()
                onModalCloseRef.current = null
            }}
            hasBackdrop={false}>
            {currentDrawerTab === 'main' ? (
                <MainPage postaviOnModalCloseRef={postaviOnModalCloseRef} />
            ) : (
                <Child
                    content={data?.data?.content || ''}
                    type={currentDrawerTab}
                />
            )}
        </Modal>
    )
}

const localStyles = StyleSheet.create({
    noMargin: {
        margin: 0
    }
})
export default Drawer
