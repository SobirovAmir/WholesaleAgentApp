import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
};

export type MapScreenProps = BottomTabScreenProps<RootTabParamList, 'Map'>;