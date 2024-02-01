import { StyleSheet, View, Text, TouchableOpacity, Switch } from "react-native";
import { ExtensionDivider } from "../../components";
import RedFlag from "../../../assets/images/svg/HealthRecordIcons/redFlag.svg";
import useTheme from "hooks/useTheme";
import { textStyles } from "globalStyles";

interface SettingsCardProps {
  settingsSubject: string;
  onPress: any;
  text: string;
  isSwitch: boolean;
  switchValue: boolean;
  onSwitchValue: () => void;
}

const SettingsCard = ({
  settingsSubject,
  onPress,
  text,
  isSwitch,
  switchValue,
  onSwitchValue,
}: SettingsCardProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        localStyles.settingsCard,
        { borderBottomColor: theme.lightGreyBorder },
      ]}>
      <View>
        <Text
          style={[localStyles.subjectSettings, { color: theme.darkGreyText }]}>
          {settingsSubject}
        </Text>
        <Text style={[localStyles.subjectText, { color: theme.darkGreyText }]}>
          {text}
        </Text>
      </View>
      <View>
        {isSwitch ? (
          <Switch
            onValueChange={onSwitchValue}
            value={switchValue}
            trackColor={{ false: "#CCCCCC", true: "#CCCCCC" }}
            thumbColor={"#111111"}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  settingsCard: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
    borderBottomWidth: 1,
    marginTop: 20,
  },
  subjectSettings: {
    ...textStyles.mainBold,
  },
  subjectText: {
    width: 259,
    ...textStyles.littleRegular,
    marginTop: 10,
  },
});

export default SettingsCard;
