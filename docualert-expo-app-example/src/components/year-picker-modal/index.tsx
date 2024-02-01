import React from 'react'
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native'

import { CustomText as Text } from '../text'

export type YearPickerModalProps = {
  setCalendarYear: (year: number) => void
}

export const YearPickerModal: React.FC<YearPickerModalProps> = ({
  setCalendarYear
}) => {
  const handleYearSelection = (year: number) => {
    console.log('Selected year:', year)
    setCalendarYear(year)
  }

  const renderYears = () => {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, index) => currentYear + index)
    const rows = Math.ceil(years.length / 2)

    const yearRows = []
    let yearIndex = 0

    for (let i = 0; i < rows; i++) {
      const row = (
        <View key={i} style={styles.rowContainer}>
          {years.slice(yearIndex, yearIndex + 2).map(year => (
            <TouchableOpacity
              key={year}
              style={styles.yearButton}
              onPress={() => handleYearSelection(year)}>
              <Text style={styles.yearText}>{year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )

      yearRows.push(row)
      yearIndex += 2
    }

    return yearRows
  }

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.modalContainer}>
          <View style={styles.yearContainer}>{renderYears()}</View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  yearContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  yearButton: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5
  },
  yearText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
