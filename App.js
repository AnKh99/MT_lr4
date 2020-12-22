import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, Dimensions, TouchableOpacity, Image} from 'react-native';


let numColumns = 4;
let WIDTH = Dimensions.get('window').width
let updateState = 0;
let newGame = 1;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const cards = [
  {tag: 1, state: 0}, {tag: 2, state: 0}, {tag: 3, state: 0}, {tag: 4, state: 0},
  {tag: 5, state: 0}, {tag: 6, state: 0}, {tag: 7, state: 0}, {tag: 8, state: 0},
  {tag: 11, state: 0}, {tag: 12, state: 0}, {tag: 13, state: 0}, {tag: 14, state: 0},
  {tag: 15, state: 0}, {tag: 16, state: 0}, {tag: 17, state: 0}, {tag: 18, state: 0},
  {tag: 0, state: -1},   //reset
];

const shown = [
  new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0),
  new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0),
  new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0),
  new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0),
  new Animated.Value(0), //reset
]

const opacity = [
  new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), 
  new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), 
  new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), 
  new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), 
  new Animated.Value(1), //reset
]

const images = [
  require('./src/icons/1.png'),
  require('./src/icons/2.png'),
  require('./src/icons/3.png'),
  require('./src/icons/4.png'),
  require('./src/icons/5.png'),
  require('./src/icons/6.png'),
  require('./src/icons/7.png'),
  require('./src/icons/8.png'),
]


const shuffle = () => {
  if(newGame != 0){
    for(let i = 0; i < cards.length - 1; i++){
      shown[i].setValue(0);
      opacity[i].setValue(1);
      cards[i].state = 0;
    }
    for(let i = cards.length - 2; i > 0; i--){
      let j = Math.floor(Math.random() * (i+1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    newGame = 0;
  }
}

const checkPair = () => {
  let first = -1;
  let second = -1;
  for(let i = 0; i< cards.length-1; i++){
    if(cards[i].state === 1){
      if(first == -1)
        first = i;
      else
        second = i;
    }
  }
  if(second != -1 && (cards[first].tag % 10) == (cards[second].tag % 10)){
    cards[first].state = 2;
    cards[second].state = 2;
  }
  else{
    if(second != -1){
      for(let i = 0; i< cards.length-1; i++)
        if(cards[i].state != 2)
          cards[i].state = 0;
    }
  }
}

const getCard = (item, setUpdate) => {
  let _shown = shown[item.index];
  let _tag = cards[item.index].tag;
  let _state = cards[item.index].state;
  const _image = images[_tag%10 - 1];
  let bgColor = _shown.interpolate({
    inputRange: [0,1],
    outputRange: ['rgba(50,50,255,1)', 'rgba(206,35,72,1)'],
  })
  

  let _opacity = opacity[item.index];
  let refresh = () => {
    updateState++;
    setUpdate(updateState + 1);
  }

  let reDraw = () => {
    if(_state == 0){
      setTimeout(refresh, 310);      
    }
    if(_state == 2){
      setTimeout(refresh, 310);
    }
  }

  let click = () =>{
    if(_tag == 0){ // if reset pressed
      newGame = 1;
      shuffle();      
      refresh();
    }
    else if(_state == 0){
      cards[item.index].state = 1;
      Animated.timing(_shown, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      checkPair();
      setTimeout(reDraw, 300);
    }
  };

  if(_state == 0){
    Animated.timing(_shown, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }
  if(_state == 2){
      Animated.timing(_opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
  }

  if(_tag === 0){
    return(
      <Animated.View style={[styles.resetStyle]}>
        <TouchableOpacity style={[styles.resetStyle]} onPress={click}> 
          <Animated.Text style={[styles.cardText, {opacity: 1}]}>
            Reset
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
  else {
    console.log(images[item.index% 8]);
    return(
      <Animated.View style={[styles.cardStyle, {backgroundColor: bgColor, opacity:_opacity}]}>
        <TouchableOpacity style={[styles.cardStyle, {backgroundColor: bgColor}]} onPress={click}>         
        <Animated.Image style={[styles.imageStyle, {opacity:_shown}]} source={_image}/> 
        </TouchableOpacity>
      </Animated.View>
    )
  }
  
};

export default function App() {
  shuffle();
  const [update, setUpdate] = useState(0);
  updateState = update;
  
  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={cards}
        numColumns={numColumns}
        renderItem={(item) => getCard(item, setUpdate)}
        keyExtractor={(item) => item.tag}
        extraData={update}
      />
    </View>
  );
}

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      backgroundColor: '#000000',
    },
    cardStyle: {
      backgroundColor: '#3232ff',
      alignItems: 'center',
      height: WIDTH / numColumns - 10,
      width: WIDTH / numColumns - 10,
      justifyContent: 'center',
      flex: 1,
      margin: 5,
    },
    resetStyle: {
      backgroundColor: '#3232ff',
      alignItems: 'center',
      height: WIDTH / numColumns - 20,
      width: WIDTH - 30,
      justifyContent: 'center',
      flex: 1,
      margin: 5,
    },
    cardStyleSelected: {
      backgroundColor: '#ce2348',
      alignItems: 'center',
      height: WIDTH / numColumns - 10,
      width: WIDTH / numColumns - 10,
      justifyContent: 'center',
      flex: 1,
      margin: 5,
    },
    imageStyle: {
      width: WIDTH / (numColumns * 2),
      height: WIDTH / (numColumns * 2),
    },
    cardText: {
      color: '#fff',
      fontSize: 25
    }
});
