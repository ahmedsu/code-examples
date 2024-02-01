import { NextFunction, Request, Response } from 'express'
import { ClientLocation, SingleSuggestion } from './types.js'
import mongoose from 'mongoose'
import { User } from '../../models/User/User.js'
import { PowerHour } from '../../models/PowerHour/PowerHour.js'
import { getDistanceFromLatLonInKm } from '../../utils/geoUtilities.js'
import { User as UserType } from '../../controllers/userController/types.js'
import USZipCodes from '../../assets/zipcodes/US.json' assert { type: 'json' }

const getDistanceString = (distanceKm: number) => {
    let distanceString
    if (distanceKm === undefined) {
        console.log('ERROR: distanceKm is undefined')
        distanceString = 'A few miles away'
    }

    if (distanceKm < 1 * 1.60934) {
        distanceString = 'Less than a mile'
    } else if (distanceKm < 1.5 * 1.60934) {
        distanceString = '1 mile away'
    } else {
        distanceString = `${Math.round(distanceKm / 1.60934)} miles away`
    }
    return distanceString
}

const nearbyUserQuery = (userCoordinates: number[]) => {
    const userQuery = User.find({
        'location.gpsCoordinates': {
            $near: {
                $maxDistance: 50 * 1000 * 1.60934, // 50 miles
                $geometry: {
                    type: 'Point',
                    coordinates: userCoordinates,
                },
            },
        },
    })
    return userQuery
}

const getUserCoordinates = (clientLocation: ClientLocation) => {
    let userCoordinates
    if (
        !clientLocation.gpsCoordinates.coordinates[0] ||
        !clientLocation.gpsCoordinates.coordinates[1]
    ) {
        const zipCode = clientLocation.zipCode
        // @ts-ignore
        const zipCodeData = USZipCodes[zipCode]
        if (!zipCodeData) {
            throw new Error('Invalid zip code')
        }
        userCoordinates = [zipCodeData.LNG, zipCodeData.LAT]
    } else {
        userCoordinates = clientLocation.gpsCoordinates.coordinates
    }
    return userCoordinates
}

const getNearestUsers = async (clientLocation: ClientLocation) => {
    const userCoordinates = getUserCoordinates(clientLocation)
    const users = await nearbyUserQuery(userCoordinates).exec()
    return users
}

const getNewestUsers = async (clientLocation: ClientLocation) => {
    const userCoordinates = getUserCoordinates(clientLocation)
    const users = await nearbyUserQuery(userCoordinates).sort({ dateCreated: -1 }).exec()
    return users
}

const getGenderSortedUsers = async (clientLocation: ClientLocation) => {
    const userCoordinates = getUserCoordinates(clientLocation)
    const users = await nearbyUserQuery(userCoordinates)
        .sort({ 'personalDetails.gender': 1 })
        .exec()
    return users
}

const getSuggestionListFromUserList = async (nearbyUsers: any[], user: UserType) => {
    const suggestionList: SingleSuggestion[] = []
    const userCoordinates = getUserCoordinates(user.location)
    const awaitableSuggestionListGetter = async () => {
        for (const userNear of nearbyUsers) {
            if (userNear._id.toString() === user._id.toString()) {
                continue
            }
            let suggestion: SingleSuggestion
            const userPowerHour = await PowerHour.findOne({
                author: userNear._id,
                $expr: { $gt: [{ $add: ['$time.start', '$time.duration'] }, Date.now()] },
            }).exec()
            const userNearCoordinates = getUserCoordinates(userNear.location)
            const distanceKm = getDistanceFromLatLonInKm(
                // @ts-ignore
                userCoordinates[1],
                // @ts-ignore
                userCoordinates[0],
                userNearCoordinates[1],
                userNearCoordinates[0],
            )
            let userPowerHourParticipants: any[] = []
            if (userPowerHour?.participants) {
                for (const participant of userPowerHour?.participants) {
                    const user = await User.findOne({ _id: participant.userId }).exec()
                    userPowerHourParticipants.push({
                        thumbnail: user?.pictures?.profilePicture,
                        userId: participant.userId,
                    })
                }
            }
            suggestion = {
                userId: userNear._id.toString(),
                pictures: userNear.pictures,
                // @ts-ignore
                distance: getDistanceString(distanceKm),
                distanceKm: distanceKm,
                // @ts-ignore
                powerHour: userPowerHour
                    ? {
                          hasScheduledPowerHour: true,
                          powerHourId: userPowerHour._id.toString(),
                          participants: userPowerHourParticipants,
                          location: {
                              // @ts-ignore
                              gpsCoordinates: userPowerHour.location.gpsCoordinates,
                              address: userPowerHour.location.address,
                              fullAddress: userPowerHour.location.fullAddress,
                          },
                          time: {
                              // @ts-ignore
                              start: userPowerHour.time.start,
                              // @ts-ignore
                              duration: userPowerHour.time.duration,
                          },
                          fitnessActivities: userPowerHour.fitnessActivities,
                          description: userPowerHour.description,
                      }
                    : {
                          hasScheduledPowerHour: false,
                      },
                workoutDetails: userNear.workoutDetails,
                personalDetails: userNear.personalDetails,
                ratings: userNear.ratings,
                location: userNear.location,
            }
            suggestionList.push(suggestion)
        }
    }
    await awaitableSuggestionListGetter()
    return suggestionList
}

const getExploreSuggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sortBy, userId: _id } = req.query
        let user: any
        if (_id) {
            user = await User.findOne({ _id: new mongoose.Types.ObjectId(String(_id)) })
                .lean()
                .exec()
        } else {
            res.status(400).json({ message: 'Missing query parameters' })
            return
        }
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        let suggestions: SingleSuggestion[] = []
        let userList

        if (sortBy) {
            switch (sortBy) {
                case 'nearest':
                    userList = await getNearestUsers(user?.location)
                    suggestions = await getSuggestionListFromUserList(userList, user)
                    res.status(200).json({
                        message: 'Found list of nearby users',
                        data: suggestions,
                    })
                    break
                case 'newest':
                    userList = await getNewestUsers(user?.location)
                    suggestions = await getSuggestionListFromUserList(userList, user)
                    res.status(200).json({
                        message: 'Found list of newest nearby users',
                        data: suggestions,
                    })
                    break
                case 'gender':
                    userList = await getGenderSortedUsers(user?.location)
                    suggestions = await getSuggestionListFromUserList(userList, user)
                    res.status(200).json({
                        message: 'Found list of gender sorted nearby users',
                        data: suggestions,
                    })
                    break

                default:
                    res.status(400).json({ message: 'Invalid sortBy parameter' })
                    break
            }
        } else {
            res.status(400).json({ message: 'Missing query parameters' })
            return
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting user', error })
        console.log(error)
    }
}

export const exploreController = {
    getExploreSuggestions,
}
