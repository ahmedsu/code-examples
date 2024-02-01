import { BottomTabInterface } from './bottomTabInterface'
import { LoadingInterface } from './loadingInterface'
import { LoginInterface } from './loginInterface'
import { ProjectInterface } from './projectInterface'
import { SettingsInterface } from './settingsInterface'
import { TemplateInterface } from './templateInterface'
import { UploadInterface } from './uploadInterface'
import { UserInterface } from './userInterface'

export type Action =
    | LoginInterface
    | SettingsInterface
    | TemplateInterface
    | UploadInterface
    | UserInterface
    | BottomTabInterface
    | LoadingInterface
    | ProjectInterface
