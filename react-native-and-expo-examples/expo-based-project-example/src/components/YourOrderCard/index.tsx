import { t } from "i18n-js";
import PrimaryButton from "components/Button/types/PrimaryButton";
import Divider from "components/Divider";
import { textStyles } from "globalStyles";
import useTheme from "hooks/useTheme";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Navigation } from "types";
import { OrderItemInterface } from "types/orders";

interface YourOrderDataProps {
  id: number;
  order_number: string;
  items: Array<OrderItemInterface>;
}

interface YourOrderCardProps {
  navigation?: Navigation;
  order: YourOrderDataProps;
}

const YourOrderCard = ({ navigation, order }: YourOrderCardProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        localStyles.orderSection,
        { borderColor: theme.borderLightGrey },
      ]}>
      <View style={localStyles.orderNumberContainer}>
        <Text
          style={[localStyles.orderSectionText, { color: theme.darkGreyText }]}>
          Order
        </Text>
        <Text style={[localStyles.orderSectionText, { color: theme.primary }]}>
          {order.order_number}
        </Text>
      </View>
      <View style={localStyles.dateView}>
        <Text
          style={[localStyles.orderSectionText, { color: theme.darkGreyText }]}>
          Date
        </Text>
        <Text
          style={[localStyles.mainTextStyling, { color: theme.darkGreyText }]}>
          {order.items[0]?.date}
        </Text>
      </View>
      <View style={localStyles.statusView}>
        <Text
          style={[localStyles.orderSectionText, { color: theme.darkGreyText }]}>
          Status
        </Text>
        <Text
          style={[localStyles.mainTextStyling, { color: theme.darkGreyText }]}>
          {order.items[0]?.status}
        </Text>
      </View>
      <View style={localStyles.totalView}>
        <Text
          style={[localStyles.orderSectionText, { color: theme.darkGreyText }]}>
          Total
        </Text>
        <Text
          style={[localStyles.mainTextStyling, { color: theme.darkGreyText }]}>
          {order.items[0]?.total}
        </Text>
      </View>
      <View
        style={[
          localStyles.testView,
          {
            borderTopColor: theme.borderLightGrey,
            borderBottomColor: theme.borderLightGrey,
            borderColor: theme.borderLightGrey,
          },
        ]}>
        <Text style={[localStyles.testTitle, { color: theme.darkGreyText }]}>
          {order.items[0]?.name}
        </Text>
      </View>
      <View style={[localStyles.buttonscontainer]}>
        <View style={localStyles.viewAndInvoiceButtonContainer}>
          <PrimaryButton
            label={"View"}
            containerStyle={[
              localStyles.btnHeight,
              { borderColor: theme.pressableGreen },
            ]}
            textStyle={{ color: theme.pressableGreen }}
            wrapperStyle={[
              {
                borderColor: theme.pressableGreen,
                borderWidth: 1,
                width: "49%",
              },
            ]}
            onPress={() => {}}
          />
          <Divider size={10} direction={"h"} />
          <PrimaryButton
            label={"Invoice"}
            containerStyle={[
              localStyles.btnHeight,
              { borderColor: theme.pressableGreen },
            ]}
            textStyle={{ color: theme.pressableGreen }}
            wrapperStyle={[
              {
                borderColor: theme.pressableGreen,
                borderWidth: 1,
                width: "49%",
              },
            ]}
            onPress={() => {}}
          />
        </View>

        <PrimaryButton
          label={t("generateLabOrder")}
          containerStyle={[
            localStyles.btnHeight,
            { backgroundColor: theme.primary },
          ]}
          textStyle={{ color: theme.secondary }}
          onPress={() => {}}
        />
        <View style={{ marginTop: 8 }}>
          <PrimaryButton
            label={"Order again"}
            containerStyle={[
              localStyles.btnHeight,
              { backgroundColor: theme.darkGreyText },
            ]}
            textStyle={{ color: theme.secondary }}
            onPress={() => {}}
          />
        </View>
      </View>
      <View
        style={[
          localStyles.labStatusContainer,
          { borderTopColor: theme.borderLightGrey },
        ]}>
        <Text style={[localStyles.labStatusText, { color: theme.primary }]}>
          LAB STATUS:{" "}
        </Text>
        <Text style={{ color: theme.primary, ...textStyles.littleRegular }}>
          PENDING -{" "}
        </Text>
        <Text style={{ color: theme.primary, ...textStyles.littleRegular }}>
          {" "}
          Generate lab
        </Text>
      </View>
      <Text style={[localStyles.orderText, { color: theme.primary }]}>
        order.
      </Text>
    </View>
  );
};

export default YourOrderCard;

const localStyles = StyleSheet.create({
  orderSection: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 16,
  },
  orderNumberContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 24,
    justifyContent: "space-between",
  },
  orderSectionText: {
    ...textStyles.mainBold,
  },
  dateView: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 16,
    justifyContent: "space-between",
  },
  statusView: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 16,
    justifyContent: "space-between",
  },
  totalView: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  mainTextStyling: {
    ...textStyles.mainText,
  },
  testView: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  testTitle: {
    ...textStyles.littleRegular,
    marginVertical: 14,
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonscontainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  btnHeight: {
    height: 48,
  },
  labStatusContainer: {
    borderTopWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 24,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 8,
  },
  labStatusText: {
    ...textStyles.littleBold,
  },
  viewAndInvoiceButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 8,
  },
  orderText: {
    alignSelf: "center",
    ...textStyles.littleRegular,
    marginBottom: 8,
  },
});
