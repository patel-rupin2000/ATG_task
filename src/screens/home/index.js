import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, AsyncStorage,Text } from 'react-native';
import { Input } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { searchImages } from '../../services/home';
import FastImage from 'react-native-fast-image';
import { width } from '../../utils/device';
import { gridList } from '../../utils/grid';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalList from '../../components/common/ModalList';
import { saveToDB, readFromDB } from '../../utils/offline';
import constants from '../../constants';
import NetInfo from '@react-native-community/netinfo';
import { OptionButton } from '../../components/common/OptionButton';
import { HistoryListItem } from '../../components/common/HistoryListItem';
import LinearGradient from 'react-native-linear-gradient';
export class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      imageList: [],
      column: 3,
      page: 0,
      gridModalVisibility: false,
      ModalVisibleStatus: false,
      searchHistory: []
    };
    this.page = 0;
    this.offset = 24;
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: () => <OptionButton onPress={this.gridModalToggle} />
    });
    this.loadHistory();
  };

  loadHistory = async () => {
    let data = await AsyncStorage.getItem(constants.SEARCH_HISTORY);
    if (data) {
      this.setState({
        searchHistory: JSON.parse(data)
      });
    }
  };

  onChange = search => {
    this.setState({ search, imageList: [] });
  };

  search = async (loadMore = false) => {
    const { search } = this.state;
    try {
      const { isConnected } = await NetInfo.fetch();
      if (isConnected) {
        let result = {};
        result = await searchImages();
        if (result.data && result.data.photos) {
          loadMore
            ? this.setState(
                prevState => ({
                  imageList: prevState.imageList.concat(
                    result.data.photos.photo
                  )
                }),
                () => saveToDB(search, this.state.imageList)
              )
            : this.setState(
                prevState => ({
                  imageList: result.data.photos.photo,
                  searchHistory: prevState.searchHistory.concat(search)
                }),
                () => {
                  saveToDB(search, this.state.imageList);
                  AsyncStorage.setItem(
                    constants.SEARCH_HISTORY,
                    JSON.stringify(this.state.searchHistory)
                  );
                }
              );
        }
      } else {
        let savedResult = await readFromDB(search);
        let imageList = JSON.parse(JSON.stringify(savedResult[0])).result;
        this.setState({
          imageList: JSON.parse(imageList)
        });
      }
    } catch (e) {
      alert('API not reachable');
    }
  };

  keyExtractor = (item, index) => index.toString();

  keyExtractorHistory = (item, index) => index.toString();

  renderItem = ({ item: { farm, server, id, secret } }) => {
    console.log(`http://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg`)
    const { column } = this.state;
    return (
      <FastImage
        source={{
          uri: `http://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg`
        }}
        style={{
          width: width / column,
          height: width / column,
          margin: 2
        }}
      />
    );
  };

  renderHistory = ({ item }) => {
    return (
      <HistoryListItem
        item={item}
        onPress={() =>
          this.setState(
            {
              search: item
            },
            () => {
              this.page = 1;
              this.search();
            }
          )
        }
      />
    );
  };

  setGrid = item => {
    this.setState({ column: item.column, gridModalVisibility: false });
  };

  gridModalToggle = () => {
    this.setState(prevState => ({
      gridModalVisibility: !prevState.gridModalVisibility
    }));
  };

  render() {
    const {
      search,
      imageList,
      column,
      gridModalVisibility,
      searchHistory
    } = this.state;
    return (
      <LinearGradient colors={['#2e2e2e','#3d3d3d','#474747','#545454']} style={styles.linearGradient}>
        <View style={{alignSelf:'center'}}>
        <Text style={{ fontSize: 30 ,color:"white",fontWeight:'bold'}}>Flickr Gallery</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: width
          }}>
          <Input
          style={{color:"white"}}
            placeholder="Search Pictures..."
            name="search"
            value={search}
            onChangeText={text => this.onChange(text)}
            returnKeyType={'search'}
            onEndEditing={() => {
              if (search.length > 0) {
                this.page = 1;
                this.search();
              }
            }}
      
            
          />
        </View>
        <ModalList
        style={{color:"white"}}
          list={gridList}
          onPress={this.setGrid}
          visibility={gridModalVisibility}
          setVisibility={this.gridModalToggle}
          selected={column}
        />
        {imageList.length > 0 ? (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={imageList}
            renderItem={this.renderItem}
            key={column}
            numColumns={column}
            contentContainerStyle={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center'
            }}
            onEndReached={() => {
              this.page = this.page + 1;
              this.search(true);
            }}
            onEndReachedThreshold={0.8}
          />
        ) : (
          <FlatList
          style={{color:"white"}}
            keyExtractor={this.keyExtractorHistory}
            data={searchHistory}
            renderItem={this.renderHistory}
            contentContainerStyle={{
              flexDirection: 'column-reverse'
            }}
          />
        )}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  
    
    
  },
});
