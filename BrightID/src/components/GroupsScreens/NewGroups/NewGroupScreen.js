// @flow

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import SearchConnections from './SearchConnections';
import NewGroupCard from './NewGroupCard';
import ActionSheet from 'react-native-actionsheet';
import store from '../../../store';
import { createNewGroup } from '../actions';
import { renderListOrSpinner } from './renderConnections';
import { clearNewGroupCoFounders } from '../../../actions';

/**
 * Connection screen of BrightID
 * Displays a search input and list of Connection Cards
 */

type State = {
  loading: boolean,
};

export class NewGroupScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    title: 'New Group',
  });

  componentDidMount() {
    const { navigation, dispatch } = this.props;

    navigation.addListener('willBlur', () => {
      dispatch(clearNewGroupCoFounders());
    });
  }

  filterConnections = () => {
    const { connections, searchParam } = this.props;
    return connections
      .filter((item) =>
        `${item.name}`
          .toLowerCase()
          .replace(/\s/g, '')
          .includes(searchParam.toLowerCase().replace(/\s/g, '')),
      )
      .filter((item) => item.status === 'verified');
  };

  cardIsSelected = (card) => {
    const { newGroupCoFounders } = this.props;
    return newGroupCoFounders.includes(card.id);
  };

  renderConnection = ({ item }) => (
    <NewGroupCard
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...item}
      selected={this.cardIsSelected(item)}
      groups={true}
      style={styles.connectionCard}
    />
  );

  getGroupType = async () => {
    const { navigation } = this.props;
    if (this.hasPrimaryGroup()) {
      // there is only general group type, so no need to select
      await store.dispatch(createNewGroup('general'));
      navigation.goBack();
    } else {
      this.actionSheet.show();
    }
  };

  hasPrimaryGroup = () => {
    const { currentGroups, eligibleGroups } = this.props;
    const allGroups = currentGroups.concat(eligibleGroups);
    return allGroups.filter((group) => group.type == 'primary').length > 0;
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>CO-FOUNDERS</Text>
            <Text style={styles.infoText}>
              To create a group, you must select two co-founders
            </Text>
          </View>
          <SearchConnections navigation={this.props.navigation} />
          <View style={styles.mainContainer}>{renderListOrSpinner(this)}</View>
        </View>
        <View style={styles.createGroupButtonContainer}>
          <TouchableOpacity
            onPress={this.getGroupType}
            style={styles.createGroupButton}
          >
            <Text style={styles.buttonInnerText}>Create Group</Text>
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={(o) => {
            this.actionSheet = o;
          }}
          title="What type of group do you want to create?"
          options={['General', 'Primary', 'cancel']}
          cancelButtonIndex={2}
          onPress={async (index) => {
            if (index == 2) {
              return;
            }
            const type = index == 0 ? 'general' : 'primary';
            await store.dispatch(createNewGroup(type));
            navigation.goBack();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionsContainer: {
    flex: 1,
    width: '96.7%',
    borderTopWidth: 1,
    borderTopColor: '#e3e1e1',
  },

  moreIcon: {
    marginRight: 16,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    backgroundColor: '#fff',
    width: '96.7%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e3e1e1',
    marginBottom: 11,
  },
  titleText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.09)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
  },
  connectionCard: {
    marginBottom: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e1e1',
    width: '100%',
  },
  createGroupButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createGroupButton: {
    backgroundColor: '#428BE5',
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 12,
    marginTop: 9,
    marginBottom: 30,
  },
  buttonInnerText: {
    fontFamily: 'ApexNew-Medium',
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default connect((state) => state)(NewGroupScreen);
