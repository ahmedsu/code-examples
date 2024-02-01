export type DrawerTabType =
    | 'main'
    | 'obrisiProfil'
    | 'obrisiAplikaciju'
    | 'privacy'
    | 'terms'
    | 'rules'
    | 'partners'
    | 'impressum'
    | 'none'
export interface IDrawerManagement {
    currentDrawerTab: DrawerTabType
    setCurrentDrawerTab: (currentDrawerTab?: DrawerTabType) => void
}
